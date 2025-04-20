import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { serversAtom, serverDetailsAtom } from "../store/serverAtoms";
import { authState } from "../store/auth";
import { useServers } from "./useServers";

export const useServerData = (selectedServer: string | null) => {
  const { refetchServers, fetchServerDetails } = useServers();
  const setServers = useSetRecoilState(serversAtom);
  const auth = useRecoilValue(authState);
  const servers = useRecoilValue(serversAtom);
  const serverDetails = useRecoilValue(serverDetailsAtom);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Fetch servers when auth is ready
  useEffect(() => {
    const fetchData = async () => {
      if (auth.user && !auth.loading) {
        setIsDataLoading(true);
        try {
          await refetchServers();
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    fetchData();
  }, [auth.user, auth.loading, refetchServers]);

  // Fetch server details when a server is selected and auth is ready
  useEffect(() => {
    const fetchDetails = async () => {
      if (auth.user && !auth.loading && selectedServer) {
        const server = servers.find((s) => s.name === selectedServer);
        if (server) {
          setIsDataLoading(true);
          try {
            await fetchServerDetails(server.id);
          } finally {
            setIsDataLoading(false);
          }
        }
      }
    };

    fetchDetails();
  }, [selectedServer, servers, auth.user, auth.loading, fetchServerDetails]);

  return {
    servers,
    serverDetails,
    isLoading: auth.loading || isDataLoading,
    isAuthenticated: !!auth.user,
  };
};
