import React from "react";

export const NavUser: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-200">John Doe</p>
          <p className="text-xs text-gray-400">john@example.com</p>
        </div>
      </div>
      <button
        className="ml-auto rounded-lg p-2 text-gray-400 hover:text-gray-100"
        onClick={() => {
          /* Add logout logic */
        }}
      >
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
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
};
