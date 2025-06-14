import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-black font-inter">
      {/* <SiteHeader /> */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
