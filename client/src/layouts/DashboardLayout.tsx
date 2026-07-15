import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedDaysAtom } from "../store/serverAtoms";
import { useServerPings } from "../hooks/useServerPings";
import { useServerData } from "../hooks/useServerData";

import { SectionCards } from "../components/dashboard/SectionCards";
import { DataTable } from "../components/dashboard/DataTable";
import { ChartAreaInteractive } from "../components/dashboard/ChartAreaInteractive";
import { ServerStatsCards } from "../components/dashboard/ServerStatsCards";

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

const DashboardPage: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] =
    useRecoilState(selectedDaysAtom);

  const [statusFilter] = useState<"all" | "success" | "fail">("all");
  const [page, setPage] = useState(1);

  const {
    servers,
    serverDetails,
    isLoading: serversLoading,
    hasServers,
  } = useServerData(selectedServer);

  const selectedServerId = selectedServer
    ? servers.find((s) => s.name === selectedServer)?.id || null
    : null;

  const {
    data: pings,
    loading: pingsLoading,
    hasMore,
    total: totalPings,
    error: pingsError,
    refetch: refetchPings,
  } = useServerPings(selectedServerId, selectedDays, page);

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0].name);
    }
  }, [servers, selectedServer]);

  useEffect(() => {
    setPage(1);
  }, [selectedServerId, selectedDays, statusFilter]);

  const calculateServerStats = (
    serverName: string
  ): ServerStats | null => {
    const server = servers.find((s) => s.name === serverName);

    if (!server || !serverDetails[server.id]) return null;

    const { pingStats } = serverDetails[server.id];

    return {
      serverName,
      totalPings: pingStats.total,
      successfulPings: pingStats.successful,
      failedPings: pingStats.failed,
      uptime: parseFloat(pingStats.successRate),
      memoryUsage: {
        used: 0,
        total: 0,
        percentage: 0,
      },
    };
  };

  return (
    <div className="min-h-screen bg-bg-dark font-inter">
      <main className="flex-1">
        <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">

          {/* Active Servers */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Active Servers
            </h2>

            <SectionCards
              onServerSelect={setSelectedServer}
              selectedServer={selectedServer}
              loading={serversLoading}
              hasServers={hasServers}
            />
          </section>

          {/* Server Statistics */}
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
                selectedServer
                  ? calculateServerStats(selectedServer)
                  : null
              }
              loading={serversLoading}
              hasServers={hasServers}
            />
          </section>

          {/* Analytics */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Analytics Overview
            </h2>

            <div className="bg-black/20 rounded-[3px] border border-white/10">
              <ChartAreaInteractive
                className="w-full"
                serverId={selectedServerId}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                hasServers={hasServers}
              />
            </div>
          </section>

          {/* Ping History */}
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
      </main>
    </div>
  );
};

export default DashboardPage;