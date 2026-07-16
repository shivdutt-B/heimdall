import React from "react";
import logoList from "../Helper/logoList"

const LogoTicker: React.FC = () => {
  return (
    <div className="w-full py-8 sm:py-16 relative">
      <div className="max-w-5xl mx-auto px-6 select-none text-center">
        <p className="text-[18px] md:text-md font-bold tracking-[0.15em] uppercase text-white/80 mb-8">
          Keeps your servers active across leading cloud platforms
        </p>

        {/* Centered, wrappable container */}
        <div className="flex flex-wrap gap-x-12 md:gap-x-16 gap-y-6 items-center justify-center">
          {logoList.map((item) => (

            
            <div key={item.name} className="flex items-center justify-center shrink-0">
              {item.logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
