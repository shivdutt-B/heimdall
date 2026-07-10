import React from "react";

interface TechItem {
  name: string;
  hoverColor: string;
}

const techList: TechItem[] = [
  {
    name: "Node.js",
    hoverColor: "group-hover:text-[#339933] group-hover:opacity-100",
  },
  {
    name: "Express.js",
    hoverColor: "group-hover:text-[#a8b9c0] group-hover:opacity-100",
  },
  {
    name: "Flask",
    hoverColor: "group-hover:text-[#cce8e1] group-hover:opacity-100",
  },
  {
    name: "Django",
    hoverColor: "group-hover:text-[#44b78b] group-hover:opacity-100",
  },
  {
    name: "FastAPI",
    hoverColor: "group-hover:text-[#05998b] group-hover:opacity-100",
  },
  {
    name: "Spring Boot",
    hoverColor: "group-hover:text-[#6db33f] group-hover:opacity-100",
  },
];

const SupportedTech: React.FC = () => {
  return (
    <div className="w-full py-8 sm:py-16 relative select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <p className="text-[18px] md:text-md font-bold tracking-[0.15em] uppercase text-white/80 mb-16">
          Compatible with all major languages and frameworks
        </p>

        {/* Symmetrical wrappable flexbox grid of sharp-bordered boxes */}
        <div className="flex flex-wrap items-center justify-center max-w-5xl mx-auto">
          {techList.map((tech) => (
            <div
              key={tech.name}
              className="border border-white/[0.06] hover:border-white/[0.12] py-5 px-12 flex items-center justify-center transition-all duration-300 hover:bg-white/[0.01] group cursor-pointer shrink-0"
            >
              <span
                className={`opacity-40 text-white font-Inter text-[35px] md:text-[45px] font-extrabold tracking-tight transition-all duration-300 ${tech.hoverColor}`}
              >
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportedTech;
