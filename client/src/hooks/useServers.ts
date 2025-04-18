import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { serversAtom } from "../atoms/serverAtoms";
import axios from "axios";

export const useServers = () => {
  const setServers = useSetRecoilState(serversAtom);

  const fetchServers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/servers", {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log("response.data", response.data);
      setServers(response.data);
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return { refetchServers: fetchServers };
};
