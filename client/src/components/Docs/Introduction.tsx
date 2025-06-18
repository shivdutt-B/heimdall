import React, { useState } from "react";
import { Button } from "../Common/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Check, ChevronDown, Copy, CheckCircle2 } from "lucide-react";
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
  <div className="flex-1 rounded-lg border border-white/10 bg-white/5 p-6">
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
  <div className="flex items-start gap-3">
    <div className="bg-indigo-600/20 p-1 rounded-full mt-1">
      <span className="text-indigo-400 font-bold text-sm">{number}</span>
    </div>
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
          part
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(console|require|app|res|req|process|Math|Date|JSON|Object|Array)$/.test(
          part
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
          part
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(datetime|json|response|request|psutil|round|process|JsonResponse|f)$/.test(
          part
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
          part
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(System|String|Map|HashMap|LocalDateTime|MemoryMXBean|ManagementFactory)$/.test(
          part
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
          part
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
          part
        )
      ) {
        return (
          <span key={i} className="text-fuchsia-400">
            {part}
          </span>
        );
      } else if (
        /^(Route|Log|response|request|date|memory_get_usage|round|header|exit|echo|json_encode)$/.test(
          part
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

// Enhanced Code block component for API examples with copy button
interface CodeBlockProps {
  method: string;
  endpoint: string;
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  method,
  endpoint,
  code,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get theme color based on language
  const getThemeColor = (lang: string) => {
    switch (lang) {
      case "nodejs":
        return "bg-green-600";
      case "django":
        return "bg-emerald-600";
      case "fastapi":
        return "bg-cyan-600";
      case "flask":
        return "bg-orange-600";
      case "spring":
        return "bg-blue-600";
      case "ruby":
        return "bg-red-600";
      case "php":
        return "bg-purple-600";
      default:
        return "bg-indigo-600";
    }
  };

  const methodBgColor = getThemeColor(language);
  const borderColor = methodBgColor.replace("bg-", "border-");

  // Installation command for each framework
  const getInstallCommand = (lang: string) => {
    switch (lang) {
      case "nodejs":
        return {
          cmd: "npm install heimdall-nodejs-sdk",
          color: "text-green-300 bg-green-950/40 border border-green-700"
        };
      case "django":
        return {
          cmd: "pip install heimdall-python-sdk",
          color: "text-emerald-300 bg-emerald-950/40 border border-emerald-700"
        };
      case "fastapi":
        return {
          cmd: "pip install heimdall-python-sdk",
          color: "text-cyan-300 bg-cyan-950/40 border border-cyan-700"
        };
      case "flask":
        return {
          cmd: "pip install heimdall-python-sdk",
          color: "text-orange-300 bg-orange-950/40 border border-orange-700"
        };
      default:
        return null;
    }
  };

  const install = getInstallCommand(language);

  return (
    <>
      {install && (
        <div className="flex items-center justify-between mb-4 bg-[#0d1117] py-2 pl-1 pr-[15px]">
          <span className={`font-mono bg-[#151b23] text-sm rounded px-3 py-2 shadow-sm`}>{install.cmd}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(install.cmd);
              setInstallCopied(true);
              setTimeout(() => setInstallCopied(false), 1800);
            }}
            className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[#040506] border border-white/20 text-white hover:bg-white/10 h-8 px-3 rounded-md text-sm"
            style={{ minWidth: 65 }}
          >
            {installCopied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      )}
      <div className="relative">
        <div className={`rounded-md bg-[#0d1117] p-4 border ${borderColor.replace(
          "600",
          "800"
        )} border-opacity-40`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-6 items-center gap-1 text-sm">
              <div
                className={`rounded px-2 py-1 font-mono text-xs font-medium text-white ${methodBgColor}`}
              >
                {method}
              </div>
              <span className="text-white/60 ml-2">{endpoint}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 border border-gray-600 hover:bg-gray-600 text-black rounded-sm bg-white/10 transition duration-200 ease-in-out"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-400" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
          <pre
            className={`p-4 font-mono text-sm overflow-x-auto rounded-md bg-[#161b22]  ${borderColor.replace(
              "600",
              "500"
            )}`}
          >
            <code className="leading-relaxed">
              {colorizeKeywords(code, language)}
            </code>
          </pre>
        </div>
      </div>
    </>
  );
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

// API Reference section
const ApiReference: React.FC = () => {
  // Language-specific theme colors and styling
  const getTabStyles = (language: string) => {
    switch (language) {
      case "nodejs":
        return "data-[state=active]:bg-green-600";
      case "django":
        return "data-[state=active]:bg-emerald-600";
      case "fastapi":
        return "data-[state=active]:bg-cyan-600";
      case "flask":
        return "data-[state=active]:bg-orange-600";
      case "spring":
        return "data-[state=active]:bg-blue-600";
      case "ruby":
        return "data-[state=active]:bg-red-600";
      case "php":
        return "data-[state=active]:bg-purple-600";
      default:
        return "data-[state=active]:bg-indigo-600";
    }
  };

  const getTabContentBackground = (language: string) => {
    switch (language) {
      case "nodejs":
        return "bg-gradient-to-br from-green-950/30 to-transparent";
      case "django":
        return "bg-gradient-to-br from-emerald-950/30 to-transparent";
      case "fastapi":
        return "bg-gradient-to-br from-cyan-950/30 to-transparent";
      case "flask":
        return "bg-gradient-to-br from-orange-950/30 to-transparent";
      case "spring":
        return "bg-gradient-to-br from-blue-950/30 to-transparent";
      case "ruby":
        return "bg-gradient-to-br from-red-950/30 to-transparent";
      case "php":
        return "bg-gradient-to-br from-purple-950/30 to-transparent";
      default:
        return "";
    }
  };

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

      <Tabs defaultValue="nodejs" className="w-full my-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 bg-[#161b22] p-1 rounded-md">
          <TabsTrigger
            value="nodejs"
            className={`text-white ${getTabStyles(
              "nodejs"
            )} data-[state=active]:text-white transition-colors duration-200 rounded-xs truncate`}
          >
            Node.js
          </TabsTrigger>
          <TabsTrigger
            value="django"
            className={`text-white ${getTabStyles(
              "django"
            )} data-[state=active]:text-white transition-colors duration-200 rounded-xs truncate`}
          >
            Django
          </TabsTrigger>
          <TabsTrigger
            value="fastapi"
            className={`text-white ${getTabStyles(
              "fastapi"
            )} data-[state=active]:text-white transition-colors duration-200 rounded-xs truncate`}
          >
            FastAPI
          </TabsTrigger>
          <TabsTrigger
            value="flask"
            className={`text-white ${getTabStyles(
              "flask"
            )} data-[state=active]:text-white transition-colors duration-200 rounded-xs truncate`}
          >
            Flask
          </TabsTrigger>
          <TabsTrigger
            value="spring"
            className={`text-white ${getTabStyles(
              "spring"
            )} data-[state=active]:text-white transition-colors duration-200 rounded-xs truncate`}
          >
            Spring Boot
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="nodejs"
          className={`mt-4 rounded-md p-1 ${getTabContentBackground("nodejs")}`}
        >
          <CodeBlock
            method="GET"
            endpoint="/__ping__"
            code={nodeJsCode}
            language="nodejs"
          />
        </TabsContent>

        <TabsContent
          value="django"
          className={`mt-4 rounded-md p-1 ${getTabContentBackground("django")}`}
        >
          <CodeBlock
            method="GET"
            endpoint="/__ping__"
            code={djangoCode}
            language="django"
          />
        </TabsContent>

        <TabsContent
          value="fastapi"
          className={`mt-4 rounded-md p-1 ${getTabContentBackground("fastapi")}`}
        >
          <CodeBlock
            method="GET"
            endpoint="/__ping__"
            code={fastapiCode}
            language="fastapi"
          />
        </TabsContent>

        <TabsContent
          value="flask"
          className={`mt-4 rounded-md p-1 ${getTabContentBackground("flask")}`}
        >
          <CodeBlock
            method="GET"
            endpoint="/__ping__"
            code={flaskCode}
            language="flask"
          />
        </TabsContent>

        <TabsContent
          value="spring"
          className={`mt-4 rounded-md p-1 ${getTabContentBackground("spring")}`}
        >
          <div className="p-6 text-white/80 text-base">
            We are working on the Spring Boot SDK. It will be released soon.
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

// FAQ item component
interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
    <div className="flex items-center gap-2">
      <ChevronDown className="h-5 w-5 text-indigo-400" />
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
  <div className="bg-yellow-100 border-3 border-yellow-500 rounded-lg p-6 mb-8 shadow-md">
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
        <h2 className="text-yellow-700 text-xl font-bold tracking-tight">
          Free Tier Usage Warning
        </h2>
      </div>
    </div>

    <p className="text-base font-semibold text-yellow-900 leading-relaxed">
      Running this service continuously will consume your entire
      <span className="inline-block bg-yellow-300 text-yellow-900 font-semibold px-2 py-0.5 rounded ml-1">
        750-hour free tier
      </span>
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
