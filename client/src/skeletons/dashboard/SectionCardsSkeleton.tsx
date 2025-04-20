import React from "react";

export const SectionCardsSkeleton: React.FC = () => {
  return (
    <div>
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-700 animate-pulse"
          />
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-black/20 p-4 sm:p-6"
          >
            <div className="flex justify-between items-start">
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-3">
              <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
