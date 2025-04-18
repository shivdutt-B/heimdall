import React from "react";
import { Link } from "react-router-dom";

export const SiteHeader: React.FC = () => {
  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/reports", label: "Reports" },
    { href: "/dashboard/documents", label: "Documents" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-semibold text-white">Acme Inc.</h2>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
            <div className="h-8 w-8 rounded-full bg-gray-700" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
