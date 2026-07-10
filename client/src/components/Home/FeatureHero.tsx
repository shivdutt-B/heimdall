import React from "react";
import image1 from "../../assets/home/image1.png";
import image2 from "../../assets/home/image2.png";
import image3 from "../../assets/home/image3.png";
import image4 from "../../assets/home/image4.png";

const FeatureHero: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-16 text-white overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Everything you need
          </h2>
          <p className="font-Inter text-[16px] mt-6 text-white/70 font-light leading-relaxed text-center">
            Heimdall provides smart server warmers, detailed logs, and failure warnings to keep deployments running smoothly.
          </p>
        </div>

        {/* 2x2 Feature Grid with sharp borders and bigger boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/[0.06] max-w-6xl mx-auto rounded-[5px]">
          
          {/* Card 1: Performance Optimization */}
          <div className="relative border-r border-b border-white/[0.06] h-[380px] p-8 md:p-12 flex flex-col justify-end overflow-hidden group transition-all duration-300 group rounded-top-left-[5px]">
            {/* Background Image */}
            <img
              src={image1}
              alt="Performance Optimization"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none"
            />
            {/* Black Gradient Fade Overlay (starting strong from bottom and disappearing going up) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0" />

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <h3 className="ttext-xl md:text-2xl font-bold text-white group-hover:text-emerald-500 tracking-tight leading-tight duration-400 duration-400">
                Performance optimization
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-normal">
                Reduce cold start delays by 30-50 seconds with customizable, intelligent ping intervals tailored per server instance.
              </p>
            </div>
          </div>

          {/* Card 2: Advanced Monitoring */}
          <div className="relative border-r border-b border-white/[0.06] h-[380px] p-8 md:p-12 flex flex-col justify-end overflow-hidden group transition-all duration-300 group rounded-top-right-[5px]">
            {/* Background Image */}
            <img
              src={image2}
              alt="Advanced Monitoring"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none"
            />
            {/* Black Gradient Fade Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0" />

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <h3 className="ttext-xl md:text-2xl font-bold text-white group-hover:text-emerald-500 tracking-tight leading-tight duration-400">
                Advanced monitoring
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-normal">
                Track real-time response curves, heap memory details, RSS allocations, and general uptime statistics on a live dashboard.
              </p>
            </div>
          </div>

          {/* Card 3: Intelligent Alerting */}
          <div className="relative border-r border-b border-white/[0.06] h-[380px] p-8 md:p-12 flex flex-col justify-end overflow-hidden group transition-all duration-300 group rounded-bottom-left-[5px]">
            {/* Background Image */}
            <img
              src={image3}
              alt="Intelligent Alerting"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none"
            />
            {/* Black Gradient Fade Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0" />

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <h3 className="ttext-xl md:text-2xl font-bold text-white group-hover:text-emerald-500 tracking-tight leading-tight duration-400">
                Intelligent alerting
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-normal">
                Receive instant email failure notifications built with configurable spam prevention thresholds to preserve your inbox.
              </p>
            </div>
          </div>

          {/* Card 4: Scalable Architecture */}
          <div className="relative border-r border-b border-white/[0.06] h-[380px] p-8 md:p-12 flex flex-col justify-end overflow-hidden group transition-all duration-300 group rounded-bottom-right-[5px]">
            {/* Background Image */}
            <img
              src={image4}
              alt="Scalable Architecture"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none"
            />
            {/* Black Gradient Fade Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0" />

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <h3 className="ttext-xl md:text-2xl font-bold text-white group-hover:text-emerald-500 tracking-tight leading-tight duration-400">
                Scalable architecture
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-normal">
                Engineered with a high-performance 6-microservice architecture using BullMQ and Redis queues to monitor hundreds of servers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureHero;
