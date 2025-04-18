import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { SectionCards } from "../components/dashboard/SectionCards";
import { DataTable } from "../components/dashboard/DataTable";
import { ChartAreaInteractive } from "../components/dashboard/ChartAreaInteractive";
import { ServerStatsCards } from "../components/dashboard/ServerStatsCards";
import { useServers } from "../hooks/useServers";
import { useRecoilValue } from "recoil";
import { serversAtom } from "../atoms/serverAtoms";

interface ServerStats {
  serverName: string;
  totalPings: number;
  successfulPings: number;
  failedPings: number;
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

type ServerStatsMap = {
  [key: string]: ServerStats;
};

// Mock data for demonstration
const mockServerStats: ServerStatsMap = {
  "google server": {
    serverName: "google server",
    totalPings: 43250,
    successfulPings: 43200,
    failedPings: 50,
    uptime: 99.88,
    memoryUsage: {
      used: 6144, // 6GB in MB
      total: 8192, // 8GB in MB
      percentage: 75,
    },
  },
  "youtube server": {
    serverName: "youtube server",
    totalPings: 38900,
    successfulPings: 38500,
    failedPings: 400,
    uptime: 98.97,
    memoryUsage: {
      used: 12288, // 12GB in MB
      total: 16384, // 16GB in MB
      percentage: 85,
    },
  },
  "amazon server": {
    serverName: "amazon server",
    totalPings: 41500,
    successfulPings: 41450,
    failedPings: 50,
    uptime: 99.87,
    memoryUsage: {
      used: 4096, // 4GB in MB
      total: 8192, // 8GB in MB
      percentage: 50,
    },
  },
  "flipkart server": {
    serverName: "flipkart server",
    totalPings: 35800,
    successfulPings: 35000,
    failedPings: 800,
    uptime: 97.77,
    memoryUsage: {
      used: 3072, // 3GB in MB
      total: 4096, // 4GB in MB
      percentage: 65,
    },
  },
  "netflix server": {
    serverName: "netflix server",
    totalPings: 42100,
    successfulPings: 42000,
    failedPings: 100,
    uptime: 99.76,
    memoryUsage: {
      used: 14336, // 14GB in MB
      total: 16384, // 16GB in MB
      percentage: 88,
    },
  },
  "microsoft server": {
    serverName: "microsoft server",
    totalPings: 39800,
    successfulPings: 39750,
    failedPings: 50,
    uptime: 99.87,
    memoryUsage: {
      used: 8192, // 8GB in MB
      total: 16384, // 16GB in MB
      percentage: 45,
    },
  },
};

const Dashboard: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const { refetchServers } = useServers(); // Initialize the server data fetching
  const servers = useRecoilValue(serversAtom);

  // Automatically select the first server on mount
  useEffect(() => {
    if (servers.length > 0) {
      setSelectedServer(servers[0].name);
    }
  }, [servers]);

  // Calculate server stats from real data
  const calculateServerStats = (serverName: string): ServerStats | null => {
    const server = servers.find((s) => s.name === serverName);
    if (!server) return null;

    const totalPings = server.pingHistory.length;
    const successfulPings = server.pingHistory.filter(
      (ping) => ping.status
    ).length;
    const failedPings = totalPings - successfulPings;
    const uptime = totalPings > 0 ? (successfulPings / totalPings) * 100 : 100;

    // Get the latest ping for memory stats
    const latestPing = server.pingHistory[0];
    const memoryUsage = {
      used: latestPing?.heapUsage || 0,
      total: latestPing?.totalHeap || 0,
      percentage: latestPing
        ? (latestPing.heapUsage / latestPing.totalHeap) * 100
        : 0,
    };

    return {
      serverName,
      totalPings,
      successfulPings,
      failedPings,
      uptime,
      memoryUsage,
    };
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#040506]">
        <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Active Servers Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Active Servers
              </h2>
            </div>
            <div className="w-full">
              <SectionCards
                onServerSelect={setSelectedServer}
                selectedServer={selectedServer}
              />
            </div>
          </section>

          {/* Server Stats Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Server Statistics
              </h2>
              {selectedServer && (
                <div className="text-sm font-medium text-white/60">
                  Viewing stats for{" "}
                  <span className="text-blue-400 font-semibold">
                    {selectedServer}
                  </span>
                </div>
              )}
            </div>
            <ServerStatsCards
              stats={
                selectedServer ? calculateServerStats(selectedServer) : null
              }
            />
          </section>

          {/* Analytics Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Analytics Overview
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  Last 3 months
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  Last 30 days
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  Last 7 days
                </button>
              </div>
            </div>
            <div className="bg-black/20 rounded-lg border border-white/10 p-4 sm:p-6">
              <ChartAreaInteractive className="w-full" />
            </div>
          </section>

          {/* Data Table Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button className="px-3 py-1.5 text-sm font-semibold text-white bg-white/10 rounded-md">
                  Overview
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                  Performance
                  <span className="bg-white/10 text-xs px-1.5 rounded-full">
                    3
                  </span>
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                  Team
                  <span className="bg-white/10 text-xs px-1.5 rounded-full">
                    2
                  </span>
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  Documents
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-white/90 bg-white/5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1">
                  <span>Customize</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <DataTable />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
