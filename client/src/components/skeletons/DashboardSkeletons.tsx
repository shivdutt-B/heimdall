import React from "react";

export const ChartAreaSkeleton: React.FC<{ className?: string }> = ({
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

// Export ServerStatsCardsSkeleton as SectionCardsSkeleton for consistency
export const SectionCardsSkeleton = ServerStatsCardsSkeleton;

export const DataTableSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={`rounded-md border border-gray-800 bg-transparent ${className}`}
    >
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Response Time
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Status Code
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Memory Usage
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="p-4 align-middle">
                  <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                </td>
                <td className="p-4 align-middle">
                  <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4 align-middle">
                  <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4 align-middle">
                  <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4 align-middle">
                  <div className="w-36 h-4 bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center px-4 py-3 border-t border-gray-800 gap-4">
        <div className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
        <div className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
