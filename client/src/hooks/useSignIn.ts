import { useSetRecoilState } from "recoil";
import axios, { AxiosError } from "axios";
import { authState } from "../store/auth";
import { useNavigate } from "react-router-dom";

interface SignInCredentials {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

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

      return { success: true };
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "An error occurred during sign in";
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
