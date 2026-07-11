import { useEffect, useState } from "react";
import axios from "axios";

interface PublicStats {
  totalPings: number;
  pingsPerDay: number;
}

export const usePublicStats = () => {
  const [stats, setStats] = useState<PublicStats>({
    totalPings: 0,
    pingsPerDay: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/stats`
      const response = await axios.get(url);

      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch public stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};