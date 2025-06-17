import { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  memoryHistoryAtom,
  memoryHistoryLoadingAtom,
  memoryHistoryErrorAtom,
} from "../store/memoryHistory";

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
  const [memoryHistory, setMemoryHistory] = useRecoilState(memoryHistoryAtom);
  const [loadingState, setLoadingState] = useRecoilState(
    memoryHistoryLoadingAtom
  );
  const [errorState, setErrorState] = useRecoilState(memoryHistoryErrorAtom);

  // Unique key for each serverId+days combination
  const key = serverId ? `${serverId}_${days}` : "";

  useEffect(() => {
    if (!serverId) {
      setMemoryHistory((prev) => ({ ...prev, [key]: [] }));
      setLoadingState((prev) => ({ ...prev, [key]: false }));
      setErrorState((prev) => ({ ...prev, [key]: null }));
      return;
    }
    // Only fetch if we don't already have data for this key
    if (memoryHistory[key] && memoryHistory[key].length > 0) {
      setLoadingState((prev) => ({ ...prev, [key]: false }));
      return;
    }
    setLoadingState((prev) => ({ ...prev, [key]: true }));
    setErrorState((prev) => ({ ...prev, [key]: null }));
    const token = localStorage.getItem("token");
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
        setMemoryHistory((prev) => ({
          ...prev,
          [key]: res.data.memoryHistory,
        }));
      })
      .catch((err) => {
        setErrorState((prev) => ({ ...prev, [key]: err }));
      })
      .finally(() => {
        setLoadingState((prev) => ({ ...prev, [key]: false }));
      });
  }, [serverId, days, key]);

  return {
    data: memoryHistory[key] || [],
    loading: loadingState[key] || false,
    error: errorState[key] || null,
  };
};
