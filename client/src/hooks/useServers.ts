import { useSetRecoilState, useRecoilState } from "recoil";
import { serversAtom, serverDetailsAtom } from "../store/serverAtoms";
import axios from "axios";

export const useServers = () => {
  const setServers = useSetRecoilState(serversAtom);
  const [serverDetails, setServerDetails] = useRecoilState(serverDetailsAtom);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/servers`, {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/servers/${serverId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Fetched server details:", response.data);

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


  return { refetchServers: fetchServers, fetchServerDetails };
};
