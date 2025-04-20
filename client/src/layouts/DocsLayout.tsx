import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface DocsLayoutProps {
  children: React.ReactNode;
}

function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="bg-[#040506] text-white/80 min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default DocsLayout;
