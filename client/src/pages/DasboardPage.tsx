import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useRecoilState } from "recoil";
import { selectedDaysAtom } from "../store/serverAtoms";
import { useServerPings } from "../hooks/useServerPings";

// Dashboard architecture
import { SectionCards } from "../components/dashboard/SectionCards";
import { DataTable } from "../components/dashboard/DataTable";
import { ChartAreaInteractive } from "../components/dashboard/ChartAreaInteractive";
import { ServerStatsCards } from "../components/dashboard/ServerStatsCards";

import { useServerData } from "../hooks/useServerData";

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
  // const [statusFilter, setStatusFilter] = useState<"all" | "success" | "fail">(
  //   "all"
  // );
  // Not declaring setStatusFilter, due to its no usage hence it is throwing an error(declared but never used) during deployment on vercel.
  const [statusFilter] = useState<"all" | "success" | "fail">(
    "all"
  );
  const [page, setPage] = useState(1);

  const {
    servers,
    serverDetails,
    isLoading: serversLoading,
    hasServers,
  } = useServerData(selectedServer);

  // Get the selected server's ID
  const selectedServerId = selectedServer
    ? servers.find((s) => s.name === selectedServer)?.id || null
    : null;

  // Fetch pings for the selected server and page
  const {
    data: pings,
    loading: pingsLoading,
    hasMore,
    total: totalPings,
    error: pingsError,
    refetch: refetchPings,
  } = useServerPings(
    selectedServerId,
    selectedDays,
    page
  );

  // Only auto-select first server if there are servers and none is selected
  useEffect(() => {
    console.log(pings, "pings");
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0].name);
    }
  }, [servers, selectedServer]);

  // Reset page when server, days, or filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedServerId, selectedDays, statusFilter]);

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
                hasServers={hasServers}
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
              hasServers={hasServers}
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
                // pings={pings}
                // loading={pingsLoading}
                hasServers={hasServers}
              />
            </div>
          </section>

          {/* Data Table Section */}
          <section className="space-y-4">
            <DataTable
              className=""
              serverId={selectedServerId}
              statusFilter={statusFilter}
              pings={pings}
              loading={pingsLoading}
              hasServers={hasServers}
              page={page}
              setPage={setPage}
              hasMore={hasMore}
              totalPings={totalPings}
              error={pingsError}
              refetch={refetchPings}
            />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
