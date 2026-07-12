import { useEffect, useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/auth";
import axios from "axios";

export const useAuth = () => {
  const setAuth = useSetRecoilState(authState);
  const auth = useRecoilValue(authState);
  const hasInitiallyFetched = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuth({
        user: null,
        token: null,
        loading: false,
        error: null,
      });
      return;
    }

    if (hasInitiallyFetched.current) return;
    hasInitiallyFetched.current = true;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            headers: {
              "x-auth-token": token,
            },
          },
        );

        setAuth({
          user: {
            name: data.name,
            email: data.email,
          },
          token,
          loading: false,
          error: null,
        });
      } catch (err) {
        localStorage.removeItem("token");

        setAuth({
          user: null,
          token: null,
          loading: false,
          error: err instanceof Error ? err.message : "Authentication failed",
        });
      }
    };

    fetchUser();
  }, [setAuth]);

  return {
    isLoading: auth.loading,
    isAuthenticated: !!auth.user,
    user: auth.user,
    error: auth.error,
  };
};
