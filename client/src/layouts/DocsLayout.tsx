import React from "react";

interface DocsLayoutProps {
  children: React.ReactNode;
}

function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="bg-bg-dark text-white/80 min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default DocsLayout;
