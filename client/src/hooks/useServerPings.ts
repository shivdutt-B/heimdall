import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { pingHistoryAtom } from "../store/serverAtoms";
import axios from "axios";

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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useServerPings = (serverId: string | null, days: number, msg:string) => {
  const [pingHistory, setPingHistory] = useRecoilState(pingHistoryAtom);
  const [data, setData] = useState<PingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = serverId ? `${serverId}-${days}` : null;

  const fetchPings = useCallback(
    async (force = false) => {
      if (!serverId) return;
      const now = Date.now();
      const cachedData = cacheKey ? pingHistory[cacheKey] : undefined;
      if (
        !force &&
        cachedData &&
        cachedData.lastFetched &&
        now - cachedData.lastFetched < CACHE_DURATION
      ) {
        setData(cachedData.data);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/servers/server-pings?id=${serverId}&days=${days}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setPingHistory((prev) => ({
          ...prev,
          [cacheKey!]: {
            data: response.data.pings,
            lastFetched: now,
          },
        }));

        console.log("fetching pings ========)))", response.data.pings);

        setData(response.data.pings);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [serverId, days, cacheKey, pingHistory, setPingHistory]
  );

  useEffect(() => {
    fetchPings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId, days]);

  return { data, loading, error, refetch: () => fetchPings(true) };
};
