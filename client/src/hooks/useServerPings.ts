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
const PAGE_SIZE = 10;

export const useServerPings = (serverId: string | null, days: number, page: number) => {
  const [pingHistory, setPingHistory] = useRecoilState(pingHistoryAtom);
  const [data, setData] = useState<PingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const cacheKey = serverId ? `${serverId}-${days}-page-${page}` : null;

  const fetchPings = useCallback(
    async () => {
      if (!serverId) return;
      const now = Date.now();
      const cachedData = cacheKey ? pingHistory[cacheKey] : undefined;
      if (
        cachedData &&
        cachedData.lastFetched &&
        now - cachedData.lastFetched < CACHE_DURATION
      ) {
        setData(cachedData.data);
        setTotal((cachedData as any).total || cachedData.data.length);
        setHasMore((cachedData as any).hasMore !== undefined ? (cachedData as any).hasMore : (cachedData.data.length === PAGE_SIZE));
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/servers/server-pings?id=${serverId}&days=${days}&page=${page}&limit=${PAGE_SIZE}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const { pings, totalPings, hasMore: more } = response.data;
        setPingHistory((prev) => ({
          ...prev,
          [cacheKey!]: {
            data: pings,
            lastFetched: now,
            total: totalPings,
            hasMore: more,
          },
        }));
        setData(pings);
        setTotal(totalPings);
        setHasMore(more);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [serverId, days, page, cacheKey, pingHistory, setPingHistory]
  );

  useEffect(() => {
    setData([]);
    setHasMore(true);
    setTotal(0);
    if (serverId) fetchPings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId, days, page]);

  return {
    data,
    loading,
    error,
    hasMore,
    total,
    refetch: fetchPings,
  };
};
