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
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
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

const StepsHero: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Install NPM or Python package",
      description: "Add the lightweight Heimdall wrapper package to your codebase using npm or pip install.",
    },
    {
      number: "2",
      title: "Configure with your app",
      description: "Initialize the package inside your server entry point file.",
    },
    {
      number: "3",
      title: "Deploy your server",
      description: "Push your updated code to Render, Railway, Fly.io, koyeb, or northflank platform.",
    },
    {
      number: "4",
      title: "Add backend URL",
      description: "Register your deployed application endpoint inside your workspace dashboard.",
    },
    {
      number: "5",
      title: "Prevent cold starts",
      description: "Heimdall starts background ping requests to keep your application warm and responsive 24/7.",
    },
  ];

  return (
    <section className="w-full py-24 bg-[#080b11] text-white relative border-t border-white/[0.02]">
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
          {steps.map((step) => (
            <StepItem
              key={step.number}
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
