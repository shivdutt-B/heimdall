import { useEffect, useState } from "react";
import axios from "axios";

export interface MemoryData {
  id: string;
  serverId: string;
  timestamp: string;
  heapUsage: number | null;
  totalHeap: number | null;
  rssMemory: number | null;
  totalRss: number | null;
}

export const useMemoryHistory = (serverId: string | null, days: number) => {
  const [data, setData] = useState<MemoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!serverId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    console.log("Fetching memory history for server:", serverId, "days:", days);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/servers/memory-history`,
        {
          id: serverId,
          days: days,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      )
      .then((res) => {
        console.log("Memory history data:", res.data);
        setData(res.data.memoryHistory);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serverId, days]);

  return { data, loading, error };
};
