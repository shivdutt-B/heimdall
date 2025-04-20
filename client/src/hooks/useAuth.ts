import { useEffect, useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/auth";
import axios from "axios";

export const useAuth = () => {
  const setAuth = useSetRecoilState(authState);
  const auth = useRecoilValue(authState);
  const hasInitiallyFetched = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Add 5 second delay for testing purposes
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Fetching user");
        setAuth((prev) => ({ ...prev, loading: true }));

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );

        const userData = response.data;

        setAuth((prev) => ({
          ...prev,
          user: {
            // id: userData.id,
            name: userData.name,
            email: userData.email,
          },
          loading: false,
          error: null,
        }));
      } catch (error) {
        setAuth((prev) => ({
          ...prev,
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    };

    const token = localStorage.getItem("token");
    if (token && !hasInitiallyFetched.current) {
      hasInitiallyFetched.current = true;
      fetchUser();
    } else if (!token) {
      setAuth((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    }
  }, [setAuth]);

  return {
    isLoading: auth.loading,
    isAuthenticated: !!auth.user,
    user: auth.user,
    error: auth.error,
  };
};
