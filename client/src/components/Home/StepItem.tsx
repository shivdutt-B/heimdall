import React from "react";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const StepItem: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="group py-12 md:py-14 px-6 -mx-6 flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start hover:bg-white/[0.015] transition-all duration-300 cursor-pointer">
      {/* Left side: Big fat number & Step Heading */}
      <div className="w-full md:w-[45%] flex gap-6 md:gap-8 items-center transform group-hover:translate-x-2 transition-transform duration-300">
        <span className="font-sans text-5xl md:text-6xl font-black text-white/10 transition-colors duration-300 select-none shrink-0 leading-none">
          {number}
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-emerald-400">
          {title}
        </h3>
      </div>

      {/* Right side: Description */}
      <div className="flex-1">
        <p className="text-gray-400 group-hover:text-gray-200 text-sm md:text-base leading-relaxed font-normal max-w-xl transition-colors duration-300 pt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StepItem;