import { TextHoverEffect } from "../Common/TextHoverEffect";

const Footer = () => {
  return (
    <footer className="relative w-full bg-bg-dark pb-8 flex flex-col justify-end -mt-1 min-h-[240px]">
      {/* Top blue glow */}
      <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[300px] pointer-events-none z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/35 via-blue-600/5 to-transparent blur-3xl mix-blend-screen opacity-90" />
      </div>

      {/* Large text */}
      <TextHoverEffect text="Heimdall" />

      {/* Footer content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center space-y-6">
        <p className="text-white/40 text-[16px] leading-relaxed max-w-2xl">
          Heimdall is a comprehensive ping and uptime monitoring platform designed to
          eliminate cold starts on free hosting platforms like Render, Railway, Fly.io, koyeb, and Northflank.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <a
            href="https://github.com/shivdutt-B"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-emerald-500 transition-colors"
          >
            GitHub ↗
          </a>
          <span className="text-white/10">•</span>
          <a
            href="https://www.linkedin.com/in/shivdutt-bhadakwad-07a462280/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-emerald-500 transition-colors"
          >
            LinkedIn ↗
          </a>
          <span className="text-white/10">•</span>
          <a
            href="https://shivdutt.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-emerald-500 transition-colors"
          >
            Portfolio ↗
          </a>
        </div>
        <p className="text-white/20 text-xs pt-4">
          &copy; {new Date().getFullYear()} Heimdall. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
