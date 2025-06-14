import React from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-zinc-800 w-16 h-16 rounded-md flex items-center justify-center mb-6">
        <span className="text-white text-2xl font-semibold">{number}</span>
      </div>
      <h3 className="text-white text-xl font-medium mb-2">{title}</h3>
      <p className="text-white text-md">{description}</p>
    </div>
  );
};

const StepsHero: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Login to your account",
      description: "and get started.",
    },
    {
      number: 2,
      title: "Code Snippet",
      description: "Past Code Snippet In Your Code.",
    },
    {
      number: 3,
      title: "Add your server",
      description: "to the dashboard.",
    },
    {
      number: 4,
      title: "Monitor your server",
      description: "and get notified when it goes down.",
    },
  ];

  return (
    <div className="w-full bg-[#040506] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          {/* Horizontal connector line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-[1px] bg-zinc-800 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsHero;
