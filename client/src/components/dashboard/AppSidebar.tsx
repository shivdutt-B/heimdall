import React from "react";
import { NavMain } from "./NavMain";
import { NavDocuments } from "./NavDocuments";
import { NavUser } from "./NavUser";
import { useMobile } from "../../hooks/use-mobile";
import { useSidebar } from "../../contexts/SidebarContext";

export const AppSidebar: React.FC = () => {
  const isMobile = useMobile();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <>
      <div
        className={`fixed inset-y-0 z-50 flex flex-col bg-gray-800 transition-all duration-300
          ${isCollapsed ? "w-16" : "w-72"} ${isMobile ? "hidden" : ""}`}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <h2
            className={`text-xl font-semibold text-white overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-40"
            }`}
          >
            Acme Inc.
          </h2>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <svg
              className={`h-5 w-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4 py-4 flex-1">
          <div className="px-3 py-2">
            <h2
              className={`mb-2 px-4 text-lg font-semibold tracking-tight text-white transition-opacity ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Overview
            </h2>
            <NavMain isCollapsed={isCollapsed} />
          </div>
          <div className="px-3 py-2">
            <h2
              className={`mb-2 px-4 text-lg font-semibold tracking-tight text-white transition-opacity ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Documents
            </h2>
            <NavDocuments isCollapsed={isCollapsed} />
          </div>
        </div>
        <div
          className={`mt-auto transition-opacity ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <NavUser />
        </div>
      </div>
      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
