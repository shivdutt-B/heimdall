import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { DataTableSkeleton } from "../skeletons/DashboardSkeletons";

interface Props {
  className?: string;
  serverId: string | null;
  selectedDays: number;
  statusFilter: "all" | "success" | "fail";
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

export const DataTable: React.FC<Props> = ({
  className,
  serverId,
  selectedDays,
  statusFilter,
}) => {
  const [pings, setPings] = useState<PingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPingData = async () => {
      if (!serverId) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/servers/server-pings?id=${serverId}&days=${selectedDays}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (response.data && response.data.pings) {
          setPings(response.data.pings);
          setCurrentPage(1); // Reset to first page when data changes
        }
      } catch (error) {
        console.error("Error fetching ping data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPingData();
  }, [serverId, selectedDays]);

  // Filter pings based on status
  const filteredPings = pings.filter((ping) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "success") return ping.status === true;
    if (statusFilter === "fail") return ping.status === false;
    return true;
  });

  // Update total pages based on filtered items
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPings.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredPings.length]);

  if (!serverId || loading) {
    return <DataTableSkeleton className={className} />;
  }

  // Get current page items from filtered data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPings.slice(indexOfFirstItem, indexOfLastItem);

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
            {currentItems.map((ping) => (
              <tr key={ping.id} className="border-b border-gray-800">
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        ping.status
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
                    ? `${ping.heapUsage.toFixed(2)}/${ping.totalHeap.toFixed(
                        2
                      )} MB`
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

      {/* Pagination */}
      <div className="flex items-center justify-center px-4 py-3 border-t border-gray-800 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-semibold text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-sm text-gray-400">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-semibold text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
