import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Helper/Auth";
import { useSignIn } from "../../hooks/useSignIn";
import { useSignUp } from "../../hooks/useSignUp";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Auth = () => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const [isCodeSignIn, setIsCodeSignIn] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [,setIsLoading] = useState(false); // not using isLoading due to is not usage anywhere in the component hence it is throwing error(declared but never used) during deployment(vercel)

  // Auto-clear error messages after 3 seconds
  useEffect(() => {
    if (error || auth.error) {
      const timer = setTimeout(() => {
        setError("");
        setAuth((prev) => ({ ...prev, error: null }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, auth.error, setAuth]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(signInForm);
    if (!result.success) {
      setError(result.error || "An error occurred during sign in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signUp(signUpForm);
    if (!result.success) {
      setError(result.error || "An error occurred during sign up");
    }
  };

  const handleSendVerificationCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setAuth((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-code`,
        { email: signInForm.email }
      );
      setCodeSent(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while sending the code. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleVerificationCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setAuth((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-code`,
        {
          email: signInForm.email,
          code: verificationCode,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setAuth((prev) => ({
          ...prev,
          user: response.data.user,
          token: response.data.token,
          loading: false,
          error: null,
        }));
        navigate("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        setAuth((prev) => ({
          ...prev,
          loading: false,
          // error: err.response.data.message,
        }));
      } else {
        const errorMsg = "An error occurred. Please try again.";
        setError(errorMsg);
        setAuth((prev) => ({ ...prev, loading: false, error: errorMsg }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#040506] text-white/80">
      <div className="w-full max-w-[400px] px-4">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="h-10 bg-[#27272a] grid w-full grid-cols-2 p-0 rounded-md gap-3">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-medium rounded-sm transition-all duration-200"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-medium rounded-sm transition-all duration-200"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {(error || auth.error) && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
              {error || auth.error}
            </div>
          )}

          <TabsContent value="signin" className="animate-fadeIn">
            <form
              onSubmit={
                isCodeSignIn
                  ? codeSent
                    ? handleVerificationCodeSubmit
                    : handleSendVerificationCode
                  : handleSignIn
              }
            >
              <div className="bg-transparent p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Sign In
                  </h2>
                  <p className="text-sm text-white/60">
                    {isCodeSignIn
                      ? codeSent
                        ? "Enter the verification code sent to your email"
                        : "Enter your email to receive a verification code"
                      : "Enter your credentials to access your account"}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={signInForm.email}
                      onChange={(e) =>
                        setSignInForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  {!isCodeSignIn && (
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={signInForm.password}
                        onChange={(e) =>
                          setSignInForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  )}
                  {isCodeSignIn && codeSent && (
                    <div className="space-y-2">
                      <label htmlFor="code" className="text-sm font-medium">
                        Verification Code
                      </label>
                      <input
                        id="code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                        placeholder="Enter verification code"
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={
                      auth.loading ||
                      (isCodeSignIn && codeSent && !verificationCode) || // Only check for verification code when code is sent
                      (!signInForm.email) || // Always require email
                      (!isCodeSignIn && !signInForm.password) // Require password only for regular sign in
                    }
                    className="w-full bg-white text-black font-medium py-2 rounded-sm hover:bg-white/90 transition-colors transform hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {auth.loading
                      ? "Processing..."
                      : isCodeSignIn
                        ? codeSent
                          ? "Verify Code"
                          : "Send Code"
                        : "Sign In"}
                  </button>
                  <button
                    type="button" onClick={() => {
                      setIsCodeSignIn(!isCodeSignIn);
                      setCodeSent(false);
                      setVerificationCode("");
                      setSignInForm(prev => ({ ...prev, password: "" })); // Clear password when switching modes
                    }}
                    className="w-full mt-2 bg-transparent border border-white/30 text-white/80 font-medium py-2 rounded-sm hover:bg-white/10 transition-colors"
                  >
                    {isCodeSignIn
                      ? "Sign in with password"
                      : "Sign in with code"}
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="animate-fadeIn">
            <form onSubmit={handleSignUp}>
              <div className="bg-transparent p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-sm text-white/60">
                    Enter your details to create a new account
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={signUpForm.name}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="signup-email"
                      className="text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={signUpForm.email}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="signup-password"
                      className="text-sm font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={signUpForm.password}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={auth.loading}
                    className="w-full bg-white text-black font-medium py-2 rounded-sm hover:bg-white/90 transition-colors transform hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {auth.loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
