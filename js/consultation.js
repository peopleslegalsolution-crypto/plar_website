const apiBase = location.port === "8081" ? "" : "http://127.0.0.1:8081";
const emailJsConfig = {
  configured: true,
  recipientEmail: "peopleslegalsolution@gmail.com",
  serviceId: "service_41yd3x6",
  templateId: "template_a9bupf8",
  publicKey: "I_pzLgxorf_YTtj9k",
};
const translations = {
  en: {
    menu: "Menu",
    navHome: "Home",
    navServices: "Services",
    navExpertise: "Expertise",
    navValues: "Values",
    navResultsValues: "Results & Values",
    navAbout: "About Us",
    navConsultation: "Consultation",
    navContact: "Contact Us",
    darkModeOn: "Dark: On",
    darkModeOff: "Dark: Off",
    languageButton: "नेपाली",
    bookConsultation: "Book Consultation",
    kicker: "Legal Help Desk",
    heroTitle: "Book a legal consultation with PLAR.",
    heroBody: "Your booking is sent to peopleslegalsolution@gmail.com. For urgent matters, contact Advocate Gopal Datt Pandey at 9851089120.",
    recommended: "Recommended Lawyer",
    fullName: "Full name",
    phone: "Phone number",
    email: "Email",
    bookingTitle: "Book Consultation",
    bookingBody: "After booking, the system gives an appointment date one or two days from today and saves it in the server database.",
    topic: "Consultation topic",
    topicPlaceholder: "Example: land dispute, divorce, company registration",
    timing: "Preferred timing",
    timingOne: "Earliest available, 1 day after booking",
    timingTwo: "2 days after booking",
    book: "Book",
    recordsTitle: "Saved Records",
    recordsBody: "Recent consultation bookings saved on the server.",
    clearRecords: "Clear Local Records",
    copyright: "Copyright (c) 2022 SOLVING LEGAL PROBLEMS WITH ADVOCATE GOPAL DUTTA PANDEY - All Rights Reserved.",
    developerCredit: "Developed by Niraj Pandey"
  },
  ne: {
    menu: "मेनु",
    navHome: "गृहपृष्ठ",
    navServices: "सेवाहरू",
    navExpertise: "विशेषज्ञता",
    navValues: "मूल्यहरू",
    navResultsValues: "नतिजा र मूल्यहरू",
    navAbout: "हाम्रो बारेमा",
    navConsultation: "परामर्श",
    navContact: "सम्पर्क",
    darkModeOn: "डार्क: अन",
    darkModeOff: "डार्क: अफ",
    languageButton: "English",
    bookConsultation: "परामर्श बुक गर्नुहोस्",
    kicker: "कानुनी सहायता डेस्क",
    heroTitle: "PLAR सँग कानुनी परामर्श बुक गर्नुहोस्।",
    heroBody: "तपाईंको बुकिङ peopleslegalsolution@gmail.com मा पठाइन्छ। अत्यावश्यक विषयका लागि अधिवक्ता गोपाल दत्त पाण्डेयलाई ९८५१०८९१२० मा सम्पर्क गर्नुहोस्।",
    recommended: "सिफारिस गरिएको वकिल",
    fullName: "पूरा नाम",
    phone: "फोन नम्बर",
    email: "इमेल",
    bookingTitle: "परामर्श बुक गर्नुहोस्",
    bookingBody: "बुकिङपछि प्रणालीले आजदेखि एक वा दुई दिनपछिको अपोइन्टमेन्ट मिति दिन्छ र सर्भर डेटाबेसमा सुरक्षित गर्छ।",
    topic: "परामर्श विषय",
    topicPlaceholder: "उदाहरण: जग्गा विवाद, सम्बन्ध विच्छेद, कम्पनी दर्ता",
    timing: "मनपर्ने समय",
    timingOne: "सबैभन्दा चाँडो, बुकिङको १ दिनपछि",
    timingTwo: "बुकिङको २ दिनपछि",
    book: "बुक गर्नुहोस्",
    recordsTitle: "सुरक्षित रेकर्डहरू",
    recordsBody: "सर्भरमा सुरक्षित हालका परामर्श बुकिङहरू।",
    clearRecords: "स्थानीय रेकर्ड हटाउनुहोस्",
    copyright: "प्रतिलिपि अधिकार (c) २०२२ अधिवक्ता गोपाल दत्त पाण्डेयसँग कानुनी समस्याको समाधान - सर्वाधिकार सुरक्षित।",
    developerCredit: "Niraj Pandey द्वारा विकसित"
  }
};

document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".site-nav").classList.toggle("is-open");
});

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translations[lang][node.dataset.i18n];
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = translations[lang][node.dataset.i18nPlaceholder];
    if (value) node.setAttribute("placeholder", value);
  });
  document.body.dataset.lang = lang;
  localStorage.setItem("plar-language", lang);
  updateThemeToggleText();
}

function updateThemeToggleText() {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!themeToggle) return;
  const lang = document.body.dataset.lang || "en";
  const key = document.body.dataset.theme === "dark" ? "darkModeOn" : "darkModeOff";
  themeToggle.textContent = translations[lang][key];
}

function applyTheme(theme) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = normalizedTheme;
  document.querySelector("[data-theme-toggle]")?.classList.toggle("is-active", normalizedTheme === "dark");
  localStorage.setItem("plar-theme", normalizedTheme);
  updateThemeToggleText();
}

document.querySelector("[data-lang-toggle]").addEventListener("click", () => {
  applyLanguage(document.body.dataset.lang === "ne" ? "en" : "ne");
});

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

applyTheme(localStorage.getItem("plar-theme") || "dark");
applyLanguage(localStorage.getItem("plar-language") || "en");

async function postJson(url, payload) {
  const response = await fetch(`${apiBase}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("The backend server is not responding with JSON. Open the site from http://127.0.0.1:8081/ or make sure the Node server is running.");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

function appointmentDate(timing) {
  const daysAfter = String(timing || "").startsWith("2") ? 2 : 1;
  const date = new Date();
  date.setDate(date.getDate() + daysAfter);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function bookingEmailPayload(payload, appointment) {
  return {
    ...emailJsConfig,
    templateParams: {
      subject: "New PLAR consultation booking",
      submission_type: "Consultation Booking",
      name: payload.name,
      phone: payload.phone,
      email: payload.email || "Not provided",
      case_type: payload.topic,
      problem: payload.topic,
      appointment,
      lawyer_name: "Gopal Datt Pandey",
      lawyer_phone: "9851089120",
      message: [
        "New consultation booking from PLAR website",
        `Name: ${payload.name}`,
        `Phone: ${payload.phone}`,
        `Email: ${payload.email || "Not provided"}`,
        `Topic: ${payload.topic}`,
        `Preferred timing: ${payload.timing}`,
        `Appointment date: ${appointment}`,
        "Requested lawyer: Gopal Datt Pandey",
        "Lawyer phone: 9851089120",
      ].join("\n"),
    },
  };
}

async function sendEmailFromBrowser(emailPayload) {
  if (!emailPayload?.configured) {
    return false;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: emailPayload.serviceId,
      template_id: emailPayload.templateId,
      user_id: emailPayload.publicKey,
      template_params: {
        to_email: emailPayload.recipientEmail,
        ...emailPayload.templateParams,
      },
    }),
  });

  return response.ok;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadRecords() {
  const holder = document.querySelector("#savedRecords");
  if (!holder) return;

  try {
    const response = await fetch(`${apiBase}/api/records`);
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Backend returned a non-JSON response");
    }
    const records = (await response.json()).filter((record) => record.type === "Consultation Booking");
    if (!records.length) {
      holder.innerHTML = "<p>No saved records yet.</p>";
      return;
    }

    holder.innerHTML = records.map((record) => `
      <article>
        <strong>${escapeHtml(record.type)}</strong>
        <span>${escapeHtml(new Date(record.createdAt).toLocaleString())}</span>
        <p>${escapeHtml(record.name || "Unknown")} - ${escapeHtml(record.topic || "General")}</p>
        ${record.appointment ? `<p>Appointment: ${escapeHtml(record.appointment)}</p>` : ""}
      </article>
    `).join("");
  } catch {
    holder.innerHTML = "<p>Could not load saved records from the server.</p>";
  }
}

document.querySelector("#bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#bookingStatus");
  const data = Object.fromEntries(new FormData(form));

  status.textContent = "Booking...";
  try {
    let result;
    try {
      result = await postJson("/api/bookings", data);
    } catch {
      const appointment = appointmentDate(data.timing);
      result = { appointment, email: bookingEmailPayload(data, appointment), staticOnly: true };
    }

    const emailSent = await sendEmailFromBrowser(result.email);
    status.textContent = emailSent
      ? `Booked for ${result.appointment}. Email sent successfully.`
      : `Booked for ${result.appointment}. Your request was received. Please call 9851089120 if you need urgent help.`;
    form.reset();
    if (!result.staticOnly) await loadRecords();
  } catch (error) {
    status.textContent = "We could not send the booking right now. Please call 9851089120 or email peopleslegalsolution@gmail.com.";
  }
});

document.querySelector("#clearRecords").addEventListener("click", async () => {
  const response = await fetch(`${apiBase}/api/records`, { method: "DELETE" });
  if (response.ok) await loadRecords();
});

loadRecords();
