import React from "react";

export const ServerStatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="rounded-lg bg-gradient-to-br from-gray-800/20 to-gray-700/20 backdrop-blur-sm border border-white/10 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-gray-700 animate-pulse w-10 h-10"></div>
          </div>
          <div className="mt-3">
            <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="mt-2 space-y-2">
              <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-full h-2 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
