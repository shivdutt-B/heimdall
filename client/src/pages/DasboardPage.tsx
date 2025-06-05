import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useRecoilState } from "recoil";
import { selectedDaysAtom } from "../store/serverAtoms";

// Dashboard architecture
import { SectionCards } from "../components/Dashboard/SectionCards";
import { DataTable } from "../components/Dashboard/DataTable";
import { ChartAreaInteractive } from "../components/Dashboard/ChartAreaInteractive";
import { ServerStatsCards } from "../components/Dashboard/ServerStatsCards";

import { useServerData } from "../hooks/useServerData";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

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

const Dashboard: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useRecoilState(selectedDaysAtom);
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "fail">(
    "all"
  );

  // const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    servers,
    serverDetails,
    isLoading: serversLoading,
  } = useServerData(selectedServer);

  // Automatically select the first server on mount
  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0].name);
    }
  }, [servers, selectedServer]);

  // If not authenticated and not loading, redirect to auth page

  // Get the selected server's ID
  const selectedServerId = selectedServer
    ? servers.find((s) => s.name === selectedServer)?.id || null
    : null;

  // Get ping counts for the selected server
  const getPingCounts = () => {
    if (!selectedServerId || !serverDetails[selectedServerId]) {
      return { success: 0, fail: 0 };
    }
    const { pingStats } = serverDetails[selectedServerId];
    return {
      success: pingStats.successful,
      fail: pingStats.failed,
    };
  };

  const pingCounts = getPingCounts();

  // Calculate server stats from real data
  const calculateServerStats = (serverName: string): ServerStats | null => {
    // console.log("calc stats", serverName);
    const server = servers.find((s) => s.name === serverName);
    if (!server || !serverDetails[server.id]) return null;

    const details = serverDetails[server.id];
    const { pingStats } = details;

    const memoryUsage = {
      used: 0,
      total: 0,
      percentage: 0,
    };

    return {
      serverName,
      totalPings: pingStats.total,
      successfulPings: pingStats.successful,
      failedPings: pingStats.failed,
      uptime: parseFloat(pingStats.successRate),
      memoryUsage,
    };
  };

  // console.log("selected90", selectedServer);

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
                loading={serversLoading}
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
              loading={serversLoading}
            />
          </section>

          {/* Analytics Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Analytics Overview
              </h2>
            </div>
            <div className="bg-black/20 rounded-lg border border-white/10 ">
              <ChartAreaInteractive
                className="w-full"
                serverId={selectedServerId}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
              />
            </div>
          </section>

          {/* Data Table Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium text-white/90 rounded-md transition-colors ${
                    statusFilter === "all"
                      ? "bg-white/20 font-semibold"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  All
                  <span className="ml-1.5 bg-white/10 text-xs px-1.5 rounded-full">
                    {pingCounts.success + pingCounts.fail}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("success")}
                  className={`px-3 py-1.5 text-sm font-medium text-white/90 rounded-md transition-colors flex items-center gap-1 ${
                    statusFilter === "success"
                      ? "bg-white/20 font-semibold"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Success
                  <span className="bg-green-500/20 text-green-400 text-xs px-1.5 rounded-full">
                    {pingCounts.success}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("fail")}
                  className={`px-3 py-1.5 text-sm font-medium text-white/90 rounded-md transition-colors flex items-center gap-1 ${
                    statusFilter === "fail"
                      ? "bg-white/20 font-semibold"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Fail
                  <span className="bg-red-500/20 text-red-400 text-xs px-1.5 rounded-full">
                    {pingCounts.fail}
                  </span>
                </button>
              </div>
            </div>
            <DataTable
              serverId={selectedServerId}
              selectedDays={selectedDays}
              statusFilter={statusFilter}
            />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
