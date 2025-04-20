import { useEffect } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { serversAtom, serverDetailsAtom } from "../store/serverAtoms";
import axios from "axios";

export const useServers = () => {
  const setServers = useSetRecoilState(serversAtom);
  const [serverDetails, setServerDetails] = useRecoilState(serverDetailsAtom);

  const fetchServers = async () => {
    try {
      // Add artificial delay for testing
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/servers", {
        headers: {
          "x-auth-token": token,
        },
      });
      setServers(response.data);
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  const fetchServerDetails = async (serverId: string) => {
    // Return cached data if available
    if (serverDetails[serverId]) {
      return serverDetails[serverId];
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/servers/${serverId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Update cache with new data
      setServerDetails((prev) => ({
        ...prev,
        [serverId]: response.data,
      }));

      return response.data;
    } catch (error) {
      console.error("Error fetching server details:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return { refetchServers: fetchServers, fetchServerDetails };
};
