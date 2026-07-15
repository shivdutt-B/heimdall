import React from "react";

interface DashboardPageProps {
  children: React.ReactNode;
}

function DashboardPage({ children }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-bg-dark font-inter">
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardPage;