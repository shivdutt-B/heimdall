import React from "react";

interface ChartAreaSkeletonProps {
  className?: string;
}

export const ChartAreaSkeleton: React.FC<ChartAreaSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={`rounded-md border border-gray-800 bg-transparent ${className}`}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-12 h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[300px] p-4">
        <div className="w-full h-full bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
