import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DataTableSkeleton } from "../../skeletons/dashboard/DataTableSkeleton";
import { useRecoilValue } from "recoil";
import { serverDetailsAtom } from "../../store/serverAtoms";

interface Props {
  className?: string;
  serverId: string | null;
  statusFilter: "all" | "success" | "fail";
  pings: PingData[];
  loading: boolean;
  hasServers?: boolean;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  totalPings: number;
  error?: any;
  refetch?: () => void;
}

interface PingData {
  id: string;
  serverId: string;
  status: boolean;
  responseTime: number | null;
  statusCode: number | null;
  timestamp: string;
  heapUsage: number | null;
  totalHeap: number | null;
  rssMemory: number | null;
  totalRss: number | null;
}

const ITEMS_PER_PAGE = 10;

export const DataTable: React.FC<Props> = ({
  className,
  serverId,
  statusFilter,
  pings,
  loading,
  hasServers = true,
  page,
  setPage,
  hasMore,
  totalPings,
  error,
  refetch,
}) => {
  const serverDetails = useRecoilValue(serverDetailsAtom);
  let pingStats = { total: 0, successful: 0, failed: 0 };
  if (serverId && serverDetails[serverId] && serverDetails[serverId].pingStats) {
    pingStats = serverDetails[serverId].pingStats;
  }

  // Filter pings based on status
  const filteredPings = pings.filter((ping) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "success") return ping.status === true;
    if (statusFilter === "fail") return ping.status === false;
    return true;
  });

  const totalPages = Math.ceil(totalPings / ITEMS_PER_PAGE) || 1;
  // Remove frontend slicing: just use filteredPings
  const currentItems = filteredPings;

  if (loading && !pings.length) {
    return <DataTableSkeleton className={className} />;
  }

  // Handle empty states
  const EmptyState = ({ message }: { message: string }) => (
    <div className={`rounded-md border border-gray-800 bg-transparent ${className}`}>
      <div className="p-6 text-center">
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );

  if (!hasServers) {
    return <EmptyState message="No servers found. Add a server to view ping history." />;
  }

  if (!serverId) {
    return <EmptyState message="Select a server to view ping history" />;
  }

  if (filteredPings.length === 0) {
    return <EmptyState message="No ping data available for the selected filter." />;
  }

  if (error) {
    return (
      <div className={`rounded-md border border-red-700 bg-red-950/80 p-6 text-center ${className}`}>
        <p className="text-red-400 mb-4">{error?.message || String(error) || 'Failed to load pings.'}</p>
        {refetch && (
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-md border border-gray-800 bg-transparent ${className}`}>
      {/* Ping counts from serverDetails */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 px-4 pt-4">
        <button
          className="px-3 py-1.5 text-sm font-medium text-white/90 rounded-md bg-white/20 font-semibold"
          disabled
        >
          All
          <span className="ml-1.5 bg-white/10 text-xs px-1.5 rounded-full">
            {pingStats.total}
          </span>
        </button>
        <button
          className="px-3 py-1.5 text-sm font-medium text-white/90 rounded-md bg-green-500/20 font-semibold"
          disabled
        >
          Success
          <span className="bg-green-500/20 text-green-400 text-xs px-1.5 rounded-full">
            {pingStats.successful}
          </span>
        </button>
        <button
          className="px-3 py-1.5 text-sm font-medium text-white/90 rounded-md bg-red-500/20 font-semibold"
          disabled
        >
          Fail
          <span className="bg-red-500/20 text-red-400 text-xs px-1.5 rounded-full">
            {pingStats.failed}
          </span>
        </button>
      </div>
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
            {currentItems.map((ping) => (
              <tr key={ping.id} className="border-b border-gray-800">
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${ping.status
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                      }
                    `}
                  >
                    {ping.status ? "Success" : "Failed"}
                  </span>
                </td>
                <td className="p-4 align-middle text-gray-300">
                  {ping.responseTime ? `${ping.responseTime}ms` : "N/A"}
                </td>
                <td className="p-4 align-middle text-gray-300">
                  {ping.statusCode || "N/A"}
                </td>
                <td className="p-4 align-middle text-gray-300">
                  {ping.heapUsage && ping.totalHeap
                    ? `${ping.heapUsage.toFixed(2)}/${ping.totalHeap.toFixed(2)} MB`
                    : "N/A"}
                </td>
                <td className="p-4 align-middle text-gray-300">
                  {format(new Date(ping.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-center px-4 py-3 border-t border-gray-800 gap-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm font-semibold text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Prev
        </button>
        <span className="text-sm text-gray-400">
          {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || !hasMore}
          className="px-3 py-1.5 text-sm font-semibold text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
