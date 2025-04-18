import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../resources/Auth";
import { useSignIn } from "../hooks/useSignIn";
import { useSignUp } from "../hooks/useSignUp";
import { useRecoilValue } from "recoil";
import { authState } from "../store/auth";

const Auth = () => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const auth = useRecoilValue(authState);

  const [signInForm, setSignInForm] = React.useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(signInForm);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(signUpForm);
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

          {auth.error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
              {auth.error}
            </div>
          )}

          <TabsContent value="signin" className="animate-fadeIn">
            <form onSubmit={handleSignIn}>
              <div className="bg-transparent p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Sign In
                  </h2>
                  <p className="text-sm text-white/60">
                    Enter your credentials to access your account
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
                  <button
                    type="submit"
                    disabled={auth.loading}
                    className="w-full bg-white text-black font-medium py-2 rounded-sm hover:bg-white/90 transition-colors transform hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {auth.loading ? "Signing in..." : "Sign In"}
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
