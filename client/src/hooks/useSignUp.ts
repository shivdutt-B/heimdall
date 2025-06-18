import { useRecoilState } from "recoil";
import axios from "axios";
import { authState } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export const useSignUp = () => {
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

  const signUp = async ({ name, email, password }: SignUpCredentials) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          name,
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

      // Redirect to dashboard if sign up is successful
      navigate("/dashboard");

      return { success: true };    } catch (error) {
      let errorMessage = "An error occurred during sign up";
      
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

  return { signUp };
};
