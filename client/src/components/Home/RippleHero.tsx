import React from "react";
import HeroOnRipple from "./HeroOnRipple";

const RippleHero: React.FC = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
      {/* Fading Grid Background */}
      <div className="absolute inset-0 fading-grid-bg pointer-events-none z-0" />
      
      <div className="w-full z-10">
        <HeroOnRipple />
      </div>
    </div>
  );
};

export default RippleHero;
