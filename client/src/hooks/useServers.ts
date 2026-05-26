import { useSetRecoilState, useRecoilState } from "recoil";
import { serversAtom, serverDetailsAtom } from "../store/serverAtoms";
import axios from "axios";

interface ServerData {
  name: string;
  url: string;
  pingInterval: number;
  failureThreshold: number;
}

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

  const addServer = async (data: ServerData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/servers`,
        data,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (err: unknown) {
      let message = "Failed to add server. Please try again.";
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.message) {
          message = errorData.message;
        } else if (errorData.errors) {
          message = errorData.errors.map((e: any) => e.msg).join(", ");
        }
      }
      return { success: false, error: message };
    }
  };

  const deleteServer = async (serverId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/servers/${serverId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      return { success: true };
    } catch (err: unknown) {
      let message = "Failed to delete server. Please try again.";
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      return { success: false, error: message };
    }
  };

  const modifyServer = async (serverId: string, data: ServerData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/servers/${serverId}`,
        data,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true };
    } catch (err: unknown) {
      let message = "Failed to modify server. Please try again.";
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      return { success: false, error: message };
    }
  };

  return {
    refetchServers: fetchServers,
    fetchServerDetails,
    addServer,
    deleteServer,
    modifyServer,
  };
};
