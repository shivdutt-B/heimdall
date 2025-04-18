import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authState } from "../store/auth";
import axios from "axios";
export const useAuth = () => {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Add 5 second delay for testing purposes
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
    if (token) {
      fetchUser();
    }
  }, [setAuth]);
};
