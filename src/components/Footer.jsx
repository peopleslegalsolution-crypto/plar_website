export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 py-8 md:py-12">
      <div className="max-w-350 mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <p className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wide uppercase">
            Copyright (c) 2022 SOLVING LEGAL PROBLEMS WITH ADVOCATE GOPAL DUTTA
            PANDEY - All Rights Reserved.
          </p>
          <p className="mt-2 text-[10px] sm:text-xs text-zinc-900 font-semibold tracking-wide uppercase">
            Developed by Niraj Pandey
          </p>
        </div>
      </div>
    </footer>
  );
}

