import { TextHoverEffect } from "../Common/TextHoverEffect";

const Footer = () => {
  return (
    <footer className="relative w-full bg-black overflow-hidden pt-0 pb-8 md:pb-12 flex flex-col justify-end -mt-1 min-h-[240px]">
      {/* Top blue glow */}
      <div className="absolute -top-4 left-0 right-0 h-[500px] pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-b from-blue-600/50 via-blue-500/20 to-transparent blur-xl mix-blend-screen opacity-100" />
      </div>

      {/* Large text */}
      {/* <MouseTrackingText /> */}
      <TextHoverEffect text="Heimdall" />

      {/* Footer content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 px-0 sm:gap-4 md:gap-8 mb-12">
          {/* ByteHint Info */}
          <div className="flex flex-col space-y-3 md:space-y-4 px-4 sm:px-0">
            <div className="flex items-center gap-3 mb-2">
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Building innovative solutions for the digital future. Transform
              your ideas into reality with our cutting-edge technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
