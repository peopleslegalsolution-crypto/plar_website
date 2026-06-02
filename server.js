import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const dataDir = join(root, "data");
const dbPath = join(dataDir, "database.json");

async function loadEnv() {
  try {
    const envText = await readFile(join(root, ".env"), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional; server still runs and reports missing EmailJS config.
  }
}

await loadEnv();

const port = Number(process.env.PORT || 8081);
const recipientEmail = process.env.RECIPIENT_EMAIL || "peoplelegalsolution@gmail.com";
const lawyerName = "Gopal Datt Pandey";
const lawyerPhone = "9851089120";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function ensureDatabase() {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(dbPath);
  } catch {
    await writeFile(dbPath, JSON.stringify({ records: [] }, null, 2));
  }
}

async function readDatabase() {
  await ensureDatabase();
  return JSON.parse(await readFile(dbPath, "utf8"));
}

async function writeDatabase(database) {
  await writeFile(dbPath, JSON.stringify(database, null, 2));
}

async function addRecord(record) {
  const database = await readDatabase();
  const saved = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  database.records.unshift(saved);
  database.records = database.records.slice(0, 200);
  await writeDatabase(database);
  return saved;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function requiredFields(payload, fields) {
  return fields.filter((field) => !String(payload[field] || "").trim());
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function appointmentDate(timing) {
  const daysAfter = String(timing || "").startsWith("2") ? 2 : 1;
  const date = new Date();
  date.setDate(date.getDate() + daysAfter);
  return formatDate(date);
}

function emailConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
}

function canSendEmail() {
  const config = emailConfig();
  return Boolean(config.serviceId && config.templateId && config.publicKey);
}

function emailConfigStatus() {
  const config = emailConfig();
  return {
    configured: canSendEmail(),
    recipientEmail,
    serviceId: config.serviceId || "",
    templateId: config.templateId || "",
    publicKey: config.publicKey || "",
    hasServiceId: Boolean(config.serviceId),
    hasTemplateId: Boolean(config.templateId),
    hasPublicKey: Boolean(config.publicKey),
    hasPrivateKey: Boolean(config.privateKey),
  };
}

function emailPayload(templateParams) {
  const config = emailConfig();
  return {
    configured: canSendEmail(),
    recipientEmail,
    serviceId: config.serviceId || "",
    templateId: config.templateId || "",
    publicKey: config.publicKey || "",
    templateParams,
  };
}

async function handleBooking(req, res) {
  const payload = await readJsonBody(req);
  const missing = requiredFields(payload, ["name", "phone", "topic", "timing"]);
  if (missing.length) {
    sendJson(res, 400, { message: `Missing required fields: ${missing.join(", ")}` });
    return;
  }

  const appointment = appointmentDate(payload.timing);
  const record = await addRecord({ type: "Consultation Booking", ...payload, appointment });
  const email = emailPayload({
    subject: "New PLAR consultation booking",
    submission_type: "Consultation Booking",
    name: payload.name,
    phone: payload.phone,
    email: payload.email || "Not provided",
    case_type: payload.topic,
    problem: payload.topic,
    appointment,
    lawyer_name: lawyerName,
    lawyer_phone: lawyerPhone,
    message: [
      "New consultation booking from PLAR website",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Email: ${payload.email || "Not provided"}`,
      `Topic: ${payload.topic}`,
      `Preferred timing: ${payload.timing}`,
      `System appointment date: ${appointment}`,
      `Requested lawyer: ${lawyerName}`,
      `Lawyer phone: ${lawyerPhone}`,
    ].join("\n"),
  });

  sendJson(res, 200, { ok: true, appointment, message: "Booking saved successfully.", email, record });
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const publicAssetRoots = ["/home/", "/expertise/", "/gallery/", "/values/"];
  const filePath = normalize(
    join(root, publicAssetRoots.some((assetRoot) => pathname.startsWith(assetRoot)) ? "public" + pathname : pathname)
  );

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    await stat(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/records") {
      const database = await readDatabase();
      sendJson(res, 200, database.records);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/email-status") {
      sendJson(res, 200, emailConfigStatus());
      return;
    }

    if (req.method === "DELETE" && url.pathname === "/api/records") {
      await writeDatabase({ records: [] });
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/bookings") {
      await handleBooking(req, res);
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { message: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { message: error.message || "Server error" });
  }
});

await ensureDatabase();
server.listen(port, () => {
  console.log(`PLAR server running at http://127.0.0.1:${port}/`);
  if (!canSendEmail()) {
    console.log("EmailJS is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY to send email.");
  }
});
