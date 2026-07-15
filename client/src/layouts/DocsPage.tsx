import React from "react";

interface DocsPageProps {
  children: React.ReactNode;
}

function DocsPage({ children }: DocsPageProps) {
  return (
    <div className="bg-bg-dark text-white/80 min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default DocsPage;
