import React from "react";
import StepItem from "./StepItem"
import steps from "../../utils/stepHeroData";

const StepsHero: React.FC = () => {

  return (
    <section className="w-full py-8 sm:py-16 text-white relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        {/* Section Heading */}
        <div className="mb-10 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Simple setup, zero friction
          </h2>
          <p className="font-Inter text-[16px] mt-6 text-white/70 font-light leading-relaxed">
            Configure free-tier endpoints in minutes to eliminate cold starts immediately.
          </p>
        </div>

        {/* Steps List with horizontal divider lines */}
        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {steps.map((step,index) => (
            <StepItem
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsHero;
