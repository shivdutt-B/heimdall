import { useRecoilState } from "recoil";
import axios from "axios";
import { authState } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useSignInWithCode = () => {
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

  const sendCode = async (email: string) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-code`,
        { email }
      );

      setAuth((prev) => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error) {
      let errorMessage = "An error occurred while sending the code. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-code`,
        {
          email,
          code,
        }
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuth({
          user,
          token,
          loading: false,
          error: null,
        });

        navigate("/dashboard");
        return { success: true };
      } else {
        throw new Error("No token returned");
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  return { sendCode, verifyCode };
};
