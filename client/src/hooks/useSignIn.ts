import { useSetRecoilState, useRecoilState } from "recoil";
import axios, { AxiosError } from "axios";
import { authState } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface SignInCredentials {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  // Clear error after 3 seconds
  useEffect(() => {
    if (auth.error) {
      const timer = setTimeout(() => {
        setAuth((prev) => ({ ...prev, error: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [auth.error, setAuth]);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Update auth state
      setAuth({
        user,
        token,
        loading: false,
        error: null,
      });

      // Redirect to dashboard if sign in is successful
      navigate("/dashboard");

      return { success: true };    } catch (error) {
      let errorMessage = "An error occurred during sign in";
      
      // Handle axios error with response
      if (axios.isAxiosError(error) && error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  return { signIn };
};
