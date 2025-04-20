import React from "react";

interface DataTableSkeletonProps {
  className?: string;
}

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
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
