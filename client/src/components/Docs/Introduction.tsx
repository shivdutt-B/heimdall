import React, { useState } from "react";
import { Button } from "../Common/button";
import { Check, ChevronDown, Copy, Info } from "lucide-react";
import { Link } from "react-router-dom";

// Header section component
const Header: React.FC = () => (
  <div className="space-y-2 mb-8">
    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-white">
      Introduction
    </h1>
    <p className="text-[17px] text-white/60">
      Learn how to keep your servers awake and monitor their performance with
      Heimdall.
    </p>
  </div>
);

// Feature card component
interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="flex-1 rounded-[3px] border border-white/10 bg-transparent p-6">
    <div className="flex items-center gap-2 mb-2">
      <Check className="h-5 w-5 text-emerald-400" />
      <h3 className="font-medium text-white">{title}</h3>
    </div>
    <p className="text-sm text-white/60">{description}</p>
  </div>
);

// What is Heimdall section
const WhatIsHeimdall: React.FC = () => (
  <section className="space-y-4">
    <h2 className="scroll-m-20 border-b border-white/10 pb-2 text-3xl font-semibold tracking-tight text-white">
      What is Heimdall?
    </h2>
    <p className="text-white/80">
      Heimdall is a smart server watchdog that prevents backend servers from
      sleeping by pinging them periodically and tracking uptime performance.
      It's particularly useful for services hosted on platforms like Render,
      Fly.io, and Railway, which may put your servers to sleep after periods of
      inactivity.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 my-6">
      <FeatureCard
        title="Prevent Cold Starts"
        description="Keep your servers warm and responsive by preventing them from going idle."
      />
      <FeatureCard
        title="Monitor Performance"
        description="Track response times and uptime with detailed analytics and historical data."
      />
      <FeatureCard
        title="Get Alerts"
        description="Receive notifications when your servers go down or experience issues."
      />
    </div>
  </section>
);

// Step component for Getting Started section
interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex items-center gap-4">
    <span className="font-sans text-3xl font-bold text-neutral-500 select-none shrink-0 leading-none">
      {number}
    </span>
    <div>
      <p className="font-medium text-white">{title}</p>
      <p className="text-white/60">{description}</p>
    </div>
  </div>
);

// Getting Started section
const GettingStarted: React.FC = () => (
  <section className="space-y-4">
    <h2 className="scroll-m-20 border-b border-white/10 pb-2 text-3xl font-semibold tracking-tight text-white">
      Getting Started
    </h2>
    <p className="text-white/80">
      Getting started with Heimdall is simple. You can be up and running in just
      a few minutes.
    </p>
    <div className="space-y-4 my-6">
      <Step
        number={1}
        title="Create an account"
        description="Sign up for a free Heimdall account to get started."
      />
      <Step
        number={2}
        title="Add your server"
        description="Enter your server URL and configure how often you want Heimdall to check on it."
      />
      <Step
        number={3}
        title="Monitor your server"
        description="Heimdall will start pinging your server and tracking its performance."
      />
    </div>
  </section>
);

// Syntax highlighting helper functions
const colorizeKeywords = (code: string, language: string): React.ReactNode => {
  if (language === "nodejs" || language === "javascript") {
    return code.split(/\b/).map((part, i) => {
      if (
        /^(const|let|var|function|return|import|export|from|if|else|for|while|class|async|await)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(console|require|app|res|req|process|Math|Date|JSON|Object|Array)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-cyan-300">
            {part}
          </span>
        );
      } else if (/^(true|false|null|undefined|this|new)$/.test(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      } else if (/^[0-9]+$/.test(part)) {
        return (
          <span key={i} className="text-pink-400">
            {part}
          </span>
        );
      } else if (
        /^(get|post|put|delete|map|forEach|use|'use strict'|=>)$/.test(part)
      ) {
        return (
          <span key={i} className="text-green-400">
            {part}
          </span>
        );
      } else if (part.startsWith("//")) {
        return (
          <span key={i} className="text-slate-400">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  } else if (language === "django" || language === "python") {
    return code.split(/\b/).map((part, i) => {
      if (
        /^(def|import|from|as|return|if|elif|else|for|while|class|try|except|with|print|self)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(datetime|json|response|request|psutil|round|process|JsonResponse|f)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-cyan-300">
            {part}
          </span>
        );
      } else if (/^(True|False|None|self)$/.test(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      } else if (/^[0-9]+$/.test(part)) {
        return (
          <span key={i} className="text-pink-400">
            {part}
          </span>
        );
      } else if (/^(get|post|put|delete|__init__|@)$/.test(part)) {
        return (
          <span key={i} className="text-green-400">
            {part}
          </span>
        );
      } else if (part.startsWith("#")) {
        return (
          <span key={i} className="text-slate-400">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  } else if (language === "spring" || language === "java") {
    return code.split(/\b/).map((part, i) => {
      if (
        /^(public|private|protected|class|interface|void|static|final|return|if|else|for|while|try|catch|import|package|extends|implements)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(System|String|Map|HashMap|LocalDateTime|MemoryMXBean|ManagementFactory)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-cyan-300">
            {part}
          </span>
        );
      } else if (/^(true|false|null|this|new)$/.test(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      } else if (/^[0-9]+$/.test(part)) {
        return (
          <span key={i} className="text-pink-400">
            {part}
          </span>
        );
      } else if (
        /^(GET|POST|PUT|DELETE|@RestController|@GetMapping)$/.test(part)
      ) {
        return (
          <span key={i} className="text-green-400">
            {part}
          </span>
        );
      } else if (part.startsWith("//")) {
        return (
          <span key={i} className="text-slate-400">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  } else if (language === "ruby") {
    return code.split(/\b/).map((part, i) => {
      if (
        /^(def|class|module|require|include|extend|attr_accessor|return|if|else|end|do)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (/^(Rails|Time|logger|render|json|config|routes)$/.test(part)) {
        return (
          <span key={i} className="text-cyan-300">
            {part}
          </span>
        );
      } else if (/^(true|false|nil|self)$/.test(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      } else if (/^[0-9]+$/.test(part)) {
        return (
          <span key={i} className="text-pink-400">
            {part}
          </span>
        );
      } else if (/^(get|post|put|delete|to|<|>)$/.test(part)) {
        return (
          <span key={i} className="text-green-400">
            {part}
          </span>
        );
      } else if (part.startsWith("#")) {
        return (
          <span key={i} className="text-slate-400">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  } else if (language === "php") {
    return code.split(/\b/).map((part, i) => {
      if (
        /^(function|return|if|else|foreach|while|class|public|private|protected|namespace|use|require|include)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(Route|Log|response|request|date|memory_get_usage|round|header|exit|echo|json_encode)$/.test(
          part,
        )
      ) {
        return (
          <span key={i} className="text-cyan-300">
            {part}
          </span>
        );
      } else if (/^(true|false|null|this|self)$/.test(part)) {
        return (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        );
      } else if (/^[0-9]+$/.test(part)) {
        return (
          <span key={i} className="text-pink-400">
            {part}
          </span>
        );
      } else if (/^(get|post|put|delete|->|=>)$/.test(part)) {
        return (
          <span key={i} className="text-green-400">
            {part}
          </span>
        );
      } else if (part.startsWith("//")) {
        return (
          <span key={i} className="text-slate-400">
            {part}
          </span>
        );
      } else if (part.startsWith("<?php") || part.startsWith("?>")) {
        return (
          <span key={i} className="text-blue-400">
            {part}
          </span>
        );
      } else if (part.startsWith("$")) {
        return (
          <span key={i} className="text-yellow-300">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  }

  // Default case: return the original code
  return code;
};

// API code examples
const nodeJsCode = `// Express.js endpoint
const express = require('express');
const heimdall = require('heimdall-nodejs-sdk');

const app = express();

// Add Heimdall ping endpoint
heimdall.ping(app);

app.listen(3000, () => console.log("Server running on port 3000"));`;

const djangoCode = `from django.urls import path
from heimdall_python_sdk import register_ping, heimdall_ping_point

urlpatterns = [
    path(heimdall_ping_point, register_ping(framework="django")),
    # your other URL patterns...
]`;

const fastapiCode = `from fastapi import FastAPI
from heimdall_python_sdk import register_ping
import uvicorn

app = FastAPI()
register_ping(app)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
`;

const flaskCode = `from heimdall_python_sdk import register_ping
from flask import Flask

app = Flask(__name__)
register_ping(app)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
`;

const ApiReference: React.FC = () => {
  const [activeTech, setActiveTech] = useState("nodejs");
  const [copied, setCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const handleCopyCode = () => {
    const code = getCodeSnippet(activeTech);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInstall = () => {
    const installCmd = getInstallCommand(activeTech);
    if (installCmd) {
      navigator.clipboard.writeText(installCmd);
      setInstallCopied(true);
      setTimeout(() => setInstallCopied(false), 1800);
    }
  };

  const getInstallCommand = (tech: string) => {
    switch (tech) {
      case "nodejs":
        return "npm install heimdall-nodejs-sdk";
      case "django":
      case "fastapi":
      case "flask":
        return "pip install heimdall-python-sdk";
      default:
        return null;
    }
  };

  const getCodeSnippet = (tech: string) => {
    switch (tech) {
      case "nodejs":
        return nodeJsCode;
      case "django":
        return djangoCode;
      case "fastapi":
        return fastapiCode;
      case "flask":
        return flaskCode;
      default:
        return "";
    }
  };

  const getLanguage = (tech: string) => {
    switch (tech) {
      case "nodejs":
        return "nodejs";
      case "django":
      case "fastapi":
      case "flask":
        return "django";
      default:
        return "";
    }
  };

  const getFilename = (tech: string) => {
    switch (tech) {
      case "nodejs":
        return "index.js";
      case "django":
        return "urls.py";
      case "fastapi":
        return "main.py";
      case "flask":
        return "app.py";
      default:
        return "code";
    }
  };

  const techs = [
    { id: "nodejs", label: "Node.js" },
    { id: "django", label: "Django" },
    { id: "fastapi", label: "FastAPI" },
    { id: "flask", label: "Flask" },
    { id: "springboot", label: "Spring Boot" },
  ];

  const installCmd = getInstallCommand(activeTech);
  const code = getCodeSnippet(activeTech);
  const language = getLanguage(activeTech);
  const filename = getFilename(activeTech);

  return (
    <section className="space-y-4">
      <h2 className="scroll-m-20 border-b border-white/10 pb-2 text-3xl font-semibold tracking-tight text-white">
        API Reference
      </h2>
      <p className="text-white/80">
        Heimdall provides a RESTful API that you can use to programmatically
        manage your monitoring setup. Below are examples of how to implement a
        ping endpoint in various frameworks that Heimdall can monitor.
      </p>

      {/* Standalone Technology Selector Tabs */}
      <div className="flex gap-4 flex-wrap border-b border-white/10 mb-6">
        {techs.map((t) => {
          const isActive = activeTech === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTech(t.id)}
              className={`py-3 text-[13px] font-medium transition duration-200 border-b-2 cursor-pointer ${
                isActive
                  ? "text-emerald-500 border-emerald-500"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 mt-6">
        {installCmd && (
          <div className="rounded-[4px] border border-white/10 bg-transparent overflow-hidden shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/15 select-none">
              <span className="text-[12px] font-mono text-white/40 font-semibold">
                Command
              </span>
              <button
                onClick={handleCopyInstall}
                className="p-1.5 rounded-[4px] border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition cursor-pointer"
              >
                {installCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-transparent text-left">
              <pre className="font-mono text-[13px] overflow-x-auto">
                <code className="leading-relaxed text-white font-bold">
                  {installCmd}
                </code>
              </pre>
            </div>
          </div>
        )}

        <div className="rounded-[4px] border border-white/10 bg-transparent overflow-hidden shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-transparent select-none">
            <span className="text-[12px] font-mono text-white/40 font-semibold">
              Code
            </span>
            <div className="flex items-center gap-2">
              {/*  */}
              {activeTech !== "springboot" && (
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-[4px] border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Code Body or Placeholder */}
          <div className="bg-transparent text-left">
            {activeTech === "springboot" ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <h3 className="text-white font-semibold text-base">
                  Spring Boot SDK
                </h3>
                <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                  We are currently developing the Spring Boot SDK. It will be
                  released and documented here soon.
                </p>
              </div>
            ) : (
              <div className="p-4">
                <pre className="font-mono text-xs overflow-x-auto">
                  <code className="leading-relaxed block">
                    {colorizeKeywords(code, language)}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ item component
interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <div className="rounded-[4px] border border-white/10 bg-transparent p-4">
    <div className="flex items-center gap-2">
      <ChevronDown className="h-5 w-5 text-emerald-400" />
      <h3 className="font-medium text-white">{question}</h3>
    </div>
    <div className="mt-2 pl-7">
      <p className="text-white/60">{answer}</p>
    </div>
  </div>
);

// FAQ section
const Faq: React.FC = () => (
  <section className="space-y-4">
    <h2 className="scroll-m-20 border-b border-white/10 pb-2 text-3xl font-semibold tracking-tight text-white">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4 my-6">
      <FaqItem
        question="How often does Heimdall ping my servers?"
        answer="By default, Heimdall pings your servers every 5 minutes. You can customize and increase this interval"
      />
      <FaqItem
        question="Does Heimdall work with any type of server?"
        answer="Yes, Heimdall works with any HTTPS endpoint. This includes web servers, API servers, and any other service that can respond to HTTP requests."
      />
      <FaqItem
        question="Does Heimdall works with localhost?"
        answer="No, Heimdall is designed to monitor remote servers. It cannot ping localhost or local network addresses directly."
      />
      <FaqItem
        question="Is there a limit to how many servers I can monitor?"
        answer="You can monitor as many servers as you want."
      />
    </div>
  </section>
);

// Warning banner component
const WarningBanner: React.FC = () => (
  <div className="bg-yellow-200 border-[3px] border-yellow-500 rounded-[5px] p-6 mb-8 shadow-md">
    <div className="flex items-center mb-4">
      <span className="mr-4 text-2xl">
        <img
          src="https://fonts.gstatic.com/s/e/notoemoji/16.0/26a0_fe0f/72.png"
          alt="⚠️"
          className="w-6 h-6"
          draggable="false"
        />
      </span>
      <div>
        <h2 className="text-black text-xl font-bold tracking-tight">
          Free Tier Usage Warning
        </h2>
      </div>
    </div>

    <p className="text-base font-semibold text-black leading-relaxed">
      Running this service continuously will consume your entire{" "}
      <span className="inline-block bg-yellow-500 text-black font-semibold px-[4px] rounded-[2px]">
        750-hour free tier
      </span>{" "}
      quota on free hosting platforms like Render, Railway, or Fly.io.
    </p>
  </div>
);

// Main Introduction component
const Introduction: React.FC = () => {
  return (
    <div className="overflow-auto font-inter">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          to="/"
          className="h-8 px-2 border-gray-700 bg-white/80 text-black mb-3 inline-flex items-center font-inter font-medium rounded-xs"
        >
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H3m0 0l6-6m-6 6l6 6"
            />
          </svg>
          Home
        </Link>
        <WarningBanner />
        <Header />
        <div className="space-y-10">
          <WhatIsHeimdall />
          <GettingStarted />
          <ApiReference />
          <Faq />
          {/* Next Steps section commented out as per previous changes */}
        </div>
        <Link
          to="/"
          className="h-8 px-2 border-gray-700 bg-white/80 text-black mb-3 inline-flex items-center font-inter font-medium rounded-xs"
        >
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H3m0 0l6-6m-6 6l6 6"
            />
          </svg>
          Home
        </Link>
      </div>
    </div>
  );
};

export default Introduction;
