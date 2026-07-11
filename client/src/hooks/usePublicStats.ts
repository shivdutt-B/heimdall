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
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

    //   const url = `${import.meta.env.VITE_API_URL}/api/users/stats`
    const url = `http://localhost:5000/api/users/stats`
      console.log('url: ', url)
      const response = await axios.get(url);
      console.log('res: ', response.data)

      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch public stats:", err);
      setError("Failed to fetch public stats.");
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
    error,
    refetch: fetchStats,
  };
};