import { useRecoilValue, useResetRecoilState } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import { authState } from "../../store/auth";
import { serversAtom, serverDetailsAtom, pingHistoryAtom, selectedDaysAtom } from "../../store/serverAtoms";
import useDeleteAccount from "../../hooks/useDeleteAccount";
import React from "react";

const NavBar: React.FC = () => {
  const auth = useRecoilValue(authState);
  const [showUserDialog, setShowUserDialog] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const navigate = useNavigate();
  const resetAuth = useResetRecoilState(authState);
  const resetServers = useResetRecoilState(serversAtom);
  const resetServerDetails = useResetRecoilState(serverDetailsAtom);
  const resetPingHistory = useResetRecoilState(pingHistoryAtom);
  const resetSelectedDays = useResetRecoilState(selectedDaysAtom);
  const { deleteAccount, loading, error, setError } = useDeleteAccount();

  // Close dialog on outside click
  React.useEffect(() => {
    if (!showUserDialog) return;
    function handleClick(e: MouseEvent) {
      if (
        !document.getElementById("user-dialog")?.contains(e.target as Node) &&
        !document.getElementById("signup-link")?.contains(e.target as Node)
      ) {
        setShowUserDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserDialog]);

  // Auto-clear error after 3 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm text-white shadow-sm bg-transparent transition-all duration-200">
      <div className="flex h-16 w-full items-center px-2 sm:px-5 lg:px-20">
        {/* Mobile navigation */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex flex-col gap-1.5 pl-2">
            <Link
              className="transition-opacity hover:opacity-75 text-2xl"
              to="/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35px"
                height="35px"
                viewBox="0 0 28 26"
                fill="#fff"
              >
                <path
                  d="M9.38669 11.7586C12.6314 11.7586 15.2617 9.12628 15.2617 5.87928C15.2617 2.63224 12.6314 0 9.38669 0C6.142 0 3.51168 2.63224 3.51168 5.87928C3.51168 9.12628 6.142 11.7586 9.38669 11.7586Z"
                  fill="#fff"
                />
                <path
                  d="M19.9447 8.00949C21.5748 8.00949 22.8964 6.68699 22.8964 5.05562C22.8964 3.42427 21.5748 2.10179 19.9447 2.10179C18.3145 2.10179 16.993 3.42427 16.993 5.05562C16.993 6.68699 18.3145 8.00949 19.9447 8.00949Z"
                  fill="#fff"
                />
                <path
                  d="M2.95182 17.5744C4.58199 17.5744 5.90351 16.2519 5.90351 14.6205C5.90351 12.9892 4.58199 11.6667 2.95182 11.6667C1.32165 11.6667 0.000129382 12.9892 0.000129382 14.6205C0.000129382 16.2519 1.32165 17.5744 2.95182 17.5744Z"
                  fill="#fff"
                />
                <path
                  d="M19.2067 21.8698C22.5925 21.8698 25.3372 19.1231 25.3372 15.7348C25.3372 12.3467 22.5925 9.59995 19.2067 9.59995C15.821 9.59995 13.0763 12.3467 13.0763 15.7348C13.0763 19.1231 15.821 21.8698 19.2067 21.8698Z"
                  fill="#fff"
                />
                <path
                  d="M8.73393 24C10.7716 24 12.4235 22.3469 12.4235 20.3077C12.4235 18.2685 10.7716 16.6154 8.73393 16.6154C6.69621 16.6154 5.04431 18.2685 5.04431 20.3077C5.04431 22.3469 6.69621 24 8.73393 24Z"
                  fill="#fff"
                />
              </svg>
            </Link>
          </div>
          <button
            id="nav-menu-button"
            className="rounded-full p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45px"
              height="45px"
              viewBox="0 -960 960 960"
              className="shrink-0 h-7 w-7"
              fill="currentColor"
            >
              <path d="M150-240q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5z"></path>
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden flex-grow items-center justify-between space-x-4 md:flex">
          <div className="flex items-center">
            <div className="flex flex-col gap-1.5">
              <Link
                className="transition-opacity hover:opacity-75 text-2xl font-inter font-bold"
                to="/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35px"
                  height="35px"
                  viewBox="0 0 28 26"
                  fill="#fff"
                >
                  <path
                    d="M9.38669 11.7586C12.6314 11.7586 15.2617 9.12628 15.2617 5.87928C15.2617 2.63224 12.6314 0 9.38669 0C6.142 0 3.51168 2.63224 3.51168 5.87928C3.51168 9.12628 6.142 11.7586 9.38669 11.7586Z"
                    fill="#fff"
                  />
                  <path
                    d="M19.9447 8.00949C21.5748 8.00949 22.8964 6.68699 22.8964 5.05562C22.8964 3.42427 21.5748 2.10179 19.9447 2.10179C18.3145 2.10179 16.993 3.42427 16.993 5.05562C16.993 6.68699 18.3145 8.00949 19.9447 8.00949Z"
                    fill="#fff"
                  />
                  <path
                    d="M2.95182 17.5744C4.58199 17.5744 5.90351 16.2519 5.90351 14.6205C5.90351 12.9892 4.58199 11.6667 2.95182 11.6667C1.32165 11.6667 0.000129382 12.9892 0.000129382 14.6205C0.000129382 16.2519 1.32165 17.5744 2.95182 17.5744Z"
                    fill="#fff"
                  />
                  <path
                    d="M19.2067 21.8698C22.5925 21.8698 25.3372 19.1231 25.3372 15.7348C25.3372 12.3467 22.5925 9.59995 19.2067 9.59995C15.821 9.59995 13.0763 12.3467 13.0763 15.7348C13.0763 19.1231 15.821 21.8698 19.2067 21.8698Z"
                    fill="#fff"
                  />
                  <path
                    d="M8.73393 24C10.7716 24 12.4235 22.3469 12.4235 20.3077C12.4235 18.2685 10.7716 16.6154 8.73393 16.6154C6.69621 16.6154 5.04431 18.2685 5.04431 20.3077C5.04431 22.3469 6.69621 24 8.73393 24Z"
                    fill="#fff"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auth buttons */}
            <div className="shrink-0">
              <div className="flex gap-2">
                <Link
                  to="/docs"
                  className="justify-center whitespace-nowrap text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-sm px-2 py-3 flex items-center gap-1 transition-colors hover:bg-transparent hover:text-muted-foreground border border-[grey] bg-[#27272a] text-white"
                >
                  Docs
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </Link>

                {auth.loading ? (
                  <div className="inline-flex text-black items-center justify-center gap-2 whitespace-nowrap text-[13px] font-medium h-8 rounded-sm px-2 py-3 border border-gray-300 bg-white">
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <button
                    className="inline-flex text-black items-center justify-center gap-2 whitespace-nowrap text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none bg-white text-primary-foreground hover:bg-white/90 h-8 rounded-sm px-2 py-3 border border-gray-300 relative"
                    id="signup-link"
                    type="button"
                    onClick={(e) => {
                      if (auth.user) {
                        e.preventDefault();
                        setShowUserDialog(!showUserDialog);
                      } else {
                        navigate('/auth');
                      }
                    }}
                  >
                    {auth.user ? "Profile" : "Auth"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-0"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {showUserDialog && auth.user && (
                      <div
                        id="user-dialog"
                        className="w-64 bg-black border border-gray-700 rounded shadow-lg z-50 p-4 text-left flex flex-col items-stretch gap-2"
                        style={{ top: "50px", position: "absolute", right: 0 }}
                      >
                        <div className="mb-2">
                          <div className="text-white text-sm font-semibold">
                            {auth.user.email}
                          </div>
                          <div className="text-white/70 text-xs">{auth.user.name}</div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                          <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full text-white text-sm px-3 py-2 rounded hover:bg-gray-800 text-left"
                          >
                            Logout
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(true);
                              setShowUserDialog(false);
                            }}
                            className="w-full text-red-500 text-sm px-3 py-2 rounded hover:bg-gray-800 text-left"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <div className="bg-black rounded-lg p-6 w-full max-w-xs shadow-lg border border-gray-700 text-center">
            <h2 className="text-md font-semibold text-white mb-2">
              Confirm Logout
            </h2>
            <p className="text-white/70 mb-4 text-sm">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 bg-white text-black rounded font-semibold text-sm cursor-pointer"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold text-sm cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  resetAuth();
                  resetServers();
                  resetServerDetails();
                  resetPingHistory();
                  resetSelectedDays();
                  setShowLogoutConfirm(false);
                  setShowUserDialog(false);
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <div className="bg-black rounded-lg p-6 w-full max-w-xs shadow-lg border border-gray-700 text-center">
            <h2 className="text-md font-semibold text-white mb-2">
              Delete Account
            </h2>
            <p className="text-white/70 mb-4 text-sm">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 mb-4 transition-all duration-300 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-red-500 shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-red-500 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 bg-white text-black rounded font-semibold text-sm cursor-pointer"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded font-semibold text-sm cursor-pointer ${loading ? 'opacity-50' : 'hover:bg-red-700'
                  }`}
                onClick={() => deleteAccount(() => setShowDeleteConfirm(false))}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
