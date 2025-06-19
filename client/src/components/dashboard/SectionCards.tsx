import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { serversAtom } from "../../store/serverAtoms";
import { format } from "date-fns";
import { SectionCardsSkeleton } from "../../skeletons/dashboard/SectionCardsSkeleton";
import axios from "axios";
import { useServers } from "../../hooks/useServers";

interface Server {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  lastPingedAt: string | null;
  pingInterval: number;
  failureThreshold: number;
}

type CarouselItem = { type: "add-new" } | { type: "card"; data: Server };

interface SectionCardsProps {
  onServerSelect: (serverName: string | null) => void;
  selectedServer?: string | null;
  loading?: boolean;
  hasServers?: boolean;
}

// Function to handle adding a new server
type AddServerParams = { name: string; url: string; pingInterval: number; failureThreshold: number };
async function addServer(
  { name, url, pingInterval, failureThreshold }: AddServerParams,
  token: string | null
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/servers`,
      {
        name,
        url,
        pingInterval,
        failureThreshold,
      },
      {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (err: unknown) {
    let message = "Failed to add server. Please try again.";
    if (axios.isAxiosError(err) && err.response && err.response.data) {
      const errorData = err.response.data;
      if (errorData.message) {
        message = errorData.message;
      } else if (errorData.errors) {
        // Express-validator errors
        message = errorData.errors.map((e: any) => e.msg).join(", ");
      }
    }
    return { success: false, error: message };
  }
}

// Function to handle deleting a server
async function handleDeleteServer(serverId: string, token: string | null) {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/servers/${serverId}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    return { success: true };
  } catch (err: unknown) {
    let message = "Failed to delete server. Please try again.";
    if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
      message = err.response.data.message;
    }
    return { success: false, error: message };
  }
}

// Function to handle modifying a server
async function modifyServer(
  serverId: string,
  data: { name: string; url: string; pingInterval: number; failureThreshold: number },
  token: string | null
) {
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/servers/${serverId}`,
      data,
      {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true };
  } catch (err: unknown) {
    let message = "Failed to modify server. Please try again.";
    if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
      message = err.response.data.message;
    }
    return { success: false, error: message };
  }
}

// Function to handle modifying a server and all related state
async function handleModifyServer({
  e,
  serverToModify,
  modifyForm,
  setIsModifying,
  setModifyError,
  setShowModifyDialog,
  setServerToModify,
  refetchServers
}: {
  e: React.FormEvent,
  serverToModify: Server,
  modifyForm: { name: string; url: string; pingInterval: number; failureThreshold: number },
  setIsModifying: (v: boolean) => void,
  setModifyError: (v: string) => void,
  setShowModifyDialog: (v: boolean) => void,
  setServerToModify: (v: Server | null) => void,
  refetchServers: () => void
}) {
  e.preventDefault();
  setIsModifying(true);
  setModifyError("");
  const token = localStorage.getItem("token");
  const result = await modifyServer(
    serverToModify.id,
    {
      name: modifyForm.name,
      url: modifyForm.url,
      pingInterval: modifyForm.pingInterval,
      failureThreshold: modifyForm.failureThreshold,
    },
    token
  );
  if (result.success) {
    setShowModifyDialog(false);
    setServerToModify(null);
    refetchServers();
  } else {
    setModifyError(result.error || "Failed to modify server. Please try again.");
  }
  setIsModifying(false);
}

export const SectionCards: React.FC<SectionCardsProps> = ({
  onServerSelect,
  selectedServer: externalSelectedServer,
  loading = false,
  hasServers = true
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const servers = useRecoilValue(serversAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Initialize forms with 300 seconds (5 minutes) as default
  const [form, setForm] = useState({
    name: "",
    url: "",
    pingInterval: 300,
    failureThreshold: 3,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);
  const { refetchServers } = useServers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [serverToModify, setServerToModify] = useState<Server | null>(null);
  const [modifyForm, setModifyForm] = useState({
    name: "",
    url: "",
    pingInterval: 300,
    failureThreshold: 3,
  });
  const [isModifying, setIsModifying] = useState(false);
  const [modifyError, setModifyError] = useState("");

  // Automatically clear error after 5 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);
  // Automatically clear delete error after 3 seconds
  useEffect(() => {
    if (deleteError) {
      const timer = setTimeout(() => setDeleteError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteError]);

  // Automatically clear modify error after 3 seconds
  useEffect(() => {
    if (modifyError) {
      const timer = setTimeout(() => setModifyError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [modifyError]);

  // Update cards per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerPage(1);
      } else if (width < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync internal selection with external selection
  useEffect(() => {
    if (externalSelectedServer) {
      setSelectedCard(externalSelectedServer);
    }
  }, [externalSelectedServer]);

  // Ensure a server is always selected after servers are loaded
  useEffect(() => {
    if (
      servers.length > 0 &&
      !selectedCard &&
      !externalSelectedServer
    ) {
      setSelectedCard(servers[0].name);
      onServerSelect(servers[0].name);
    }
  }, [servers, selectedCard, externalSelectedServer, onServerSelect]);

  // Show skeleton during loading
  if (loading) {
    return <SectionCardsSkeleton />;
  }

  // Helper to map ServerBasic to Server (for CarouselItem)
  function mapServerBasicToServer(server: any): Server {
    return {
      id: server.id,
      name: server.name,
      url: server.url,
      isActive: server.isActive,
      lastPingedAt: server.lastPingedAt,
      pingInterval: server.pingInterval,
      failureThreshold: server.failureThreshold ?? 3, // fallback if missing
    };
  }

  const items: CarouselItem[] = [
    { type: "add-new" },
    ...servers.map((server) => ({ type: "card" as const, data: mapServerBasicToServer(server) })),
  ];

  // If there are no servers, show only the add new card with a message
  if (!hasServers) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDialogOpen(true);
          }}
          className="relative flex flex-col items-center justify-center p-6 rounded-lg border border-dashed border-gray-700 bg-black/20 cursor-pointer hover:border-gray-600 transition-colors group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Add your first server</span>
            <p className="text-xs text-center text-gray-500 group-hover:text-gray-400">Get started by adding a server to monitor</p>
          </div>
        </div>

        {/* Make sure the dialog is rendered even in empty state */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-bg-[#27272a] p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px] backdrop-blur-sm">
            <div className="bg-[#181A20] rounded-lg p-0 w-full max-w-md shadow-lg">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormError("");
                  setIsSubmitting(true);
                  const token = localStorage.getItem("token");
                  const result = await addServer(form, token);
                  if (result.success) {
                    setIsDialogOpen(false);
                    setForm({
                      name: "",
                      url: "",
                      pingInterval: 60,
                      failureThreshold: 3,
                    });
                    refetchServers();
                    setIsSubmitting(false);
                  } else {
                    setFormError(
                      result.error || "Failed to add server. Please try again."
                    );
                    setIsSubmitting(false);
                  }
                }}
                className="bg-black p-6 border border-gray-700 shadow-lg rounded-lg min-h-[400px]"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Add New Server
                  </h2>
                  <p className="text-sm text-white/60">
                    Enter the details to add a new server to your dashboard
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-sm text-white"
                      htmlFor="server-name"
                    >
                      Server Name
                    </label>
                    <input
                      id="server-name"
                      type="text"
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="My Server"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-sm text-white"
                      htmlFor="server-url"
                    >
                      URL
                    </label>
                    <input
                      id="server-url"
                      type="url"
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                      value={form.url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, url: e.target.value }))
                      }
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-sm text-white"
                      htmlFor="ping-interval"
                    >
                      Ping Interval (seconds)
                      <span className="text-xs ml-1 text-gray-400">(Minimum: 5 minutes / 300 seconds)</span>
                    </label>
                    <input
                      id="ping-interval"
                      type="number"
                      min={300}
                      onKeyDown={(e) => {
                        // Prevent typing negative numbers
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setForm((f) => ({
                          ...f,
                          pingInterval: value < 300 ? 300 : value,
                        }));
                      }}
                      className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                      value={form.pingInterval}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-sm text-white flex items-center gap-1"
                      htmlFor="failure-threshold"
                    >
                      Failure Threshold
                      <div className="relative group cursor-pointer mb-1">
                        <span className="text-white font-bold border-[1px] py-[1px] px-[6px] rounded-full text-[10px]">
                          !
                        </span>
                        <div className="absolute z-10 hidden group-hover:block w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-full left-1/2 -translate-x-1/2 mt-1">
                          Alerts you after this many consecutive server failures.
                        </div>
                      </div>
                    </label>

                    <select
                      id="failure-threshold"
                      className="w-full p-2 border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm bg-black"
                      value={form.failureThreshold}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          failureThreshold: Number(e.target.value),
                        }))
                      }
                      required
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formError && (
                    <div className="mt-3 p-2 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
                      {formError}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-700 transition-colors cursor-pointer text-[15px] font-semibold"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-white/90 transition-colors transform duration-200 text-sm cursor-pointer flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
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
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                      {isSubmitting ? "Adding..." : "Add Server"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div >
    );
  }

  const pageCount = Math.ceil(items.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + cardsPerPage);

  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardSelect = (serverName: string) => {
    setSelectedCard(serverName);
    onServerSelect(serverName);
  };

  const formatPingInterval = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="w-full">
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === index
              ? "bg-white w-4"
              : "bg-gray-600 hover:bg-gray-500"
              }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Cards Carousel */}
      <div className="relative">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 -ml-4 sm:-ml-6 text-white rounded-xl transition-all duration-200 ${currentPage === 0
            ? "opacity-0 cursor-not-allowed"
            : "bg-black/30 hover:bg-black/50 backdrop-blur-sm hover:scale-110"
            }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {visibleItems.map((item, index) =>
                item.type === "add-new" ? (
                  <div
                    key="add-new"
                    className="rounded-lg border-dashed border-2 border-white/20 p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center h-full group"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-8 h-8 text-white/40 mb-3 group-hover:text-white/60 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-white/40 group-hover:text-white/60 font-semibold">
                        Add New Server
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={`${item.data.id}-${index}`}
                    onClick={() => handleCardSelect(item.data.name)}
                    className={`rounded-lg border-white/10 border bg-black/20 p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 group relative cursor-pointer ${selectedCard === item.data.name
                      ? "ring-2 ring-blue-500/50 border-blue-500/50 bg-white/5"
                      : ""
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-white capitalize hover:text-gray-300 transition-colors">
                        {item.data.name}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.data.isActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                          }`}
                      >
                        {item.data.isActive ? "online" : "offline"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[15px] font-medium text-white/80 hover:text-blue-400 transition-colors break-all">
                        {item.data.url}
                      </p>
                      <p className="mt-2 text-[13px] font-medium text-gray-400 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 mt-[1px] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="truncate">
                          Last ping:{" "}
                          {item.data.lastPingedAt
                            ? format(
                              new Date(item.data.lastPingedAt),
                              "yyyy-MM-dd HH:mm:ss"
                            )
                            : "Never"}
                        </span>
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-gray-400 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 mt-[1px] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 4v16m12-16v16M6 8h12M6 16h12"
                          />
                        </svg>
                        <span className="truncate">
                          Ping interval:{" "}
                          {formatPingInterval(item.data.pingInterval)}
                        </span>
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-gray-400 flex items-center gap-1">
                        <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.37032 11.0726L5.41421 14.0287C4.63317 14.8097 4.63316 16.076 5.41421 16.8571L6.95611 18.399C7.73715 19.18 9.00348 19.18 9.78453 18.399L12.7406 15.4429M11.0726 8.37032L14.0287 5.41421C14.8097 4.63317 16.076 4.63316 16.8571 5.41421L18.399 6.95611C19.18 7.73715 19.18 9.00348 18.399 9.78453L15.4429 12.7406M6.64883 6.64883L4.88296 4.88296M19.0992 19.0992L17.3333 17.3333M9.35119 5.87299V4M14.6488 20V18.127M5.87299 9.35119H4M20 14.6488H18.127" stroke="#99a1af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                        <span className="truncate">
                          Failure Threshold:{" "}
                          {item.data.failureThreshold}
                        </span>
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <button
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          setServerToModify(item.data);
                          setModifyForm({
                            name: item.data.name,
                            url: item.data.url,
                            pingInterval: item.data.pingInterval,
                            failureThreshold: item.data.failureThreshold,
                          });
                          setShowModifyDialog(true);
                        }}
                      >
                        Modify
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        onClick={() => {
                          setServerToDelete(item.data);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 -mr-4 sm:-mr-6 text-white rounded-xl transition-all duration-200 ${currentPage === pageCount - 1
            ? "opacity-0 cursor-not-allowed"
            : "bg-black/30 hover:bg-black/50 backdrop-blur-sm hover:scale-110"
            }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Add New Server Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-bg-[#27272a] p-6 border border-gray-700 shadow-lg rounded-sm min-h-[400px] backdrop-blur-sm">
          <div className="bg-[#181A20] rounded-lg p-0 w-full max-w-md shadow-lg">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError("");
                setIsSubmitting(true);
                const token = localStorage.getItem("token");
                const result = await addServer(form, token);
                if (result.success) {
                  setIsDialogOpen(false);
                  setForm({
                    name: "",
                    url: "",
                    pingInterval: 60,
                    failureThreshold: 3,
                  });
                  refetchServers();
                  setIsSubmitting(false);
                } else {
                  setFormError(
                    result.error || "Failed to add server. Please try again."
                  );
                  setIsSubmitting(false);
                }
              }}
              className="bg-black p-6 border border-gray-700 shadow-lg rounded-lg min-h-[400px]"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Add New Server
                </h2>
                <p className="text-sm text-white/60">
                  Enter the details to add a new server to your dashboard
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-sm text-white"
                    htmlFor="server-name"
                  >
                    Server Name
                  </label>
                  <input
                    id="server-name"
                    type="text"
                    className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="My Server"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-sm text-white"
                    htmlFor="server-url"
                  >
                    URL
                  </label>
                  <input
                    id="server-url"
                    type="url"
                    className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-sm text-white"
                    htmlFor="ping-interval"
                  >
                    Ping Interval (seconds)
                    <span className="text-xs ml-1 text-gray-400">(Minimum: 5 minutes / 300 seconds)</span>
                  </label>
                  <input
                    id="ping-interval"
                    type="number"
                    min={300}
                    onKeyDown={(e) => {
                      // Prevent typing negative numbers
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setForm((f) => ({
                        ...f,
                        pingInterval: value < 300 ? 300 : value,
                      }));
                    }}
                    className="w-full p-2 bg-transparent border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm"
                    value={form.pingInterval}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-sm text-white flex items-center gap-1"
                    htmlFor="failure-threshold"
                  >
                    Failure Threshold
                    <div className="relative group cursor-pointer mb-1">
                      <span className="text-white font-bold border-[1px] py-[1px] px-[6px] rounded-full text-[10px]">
                        !
                      </span>
                      <div className="absolute z-10 hidden group-hover:block w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-full left-1/2 -translate-x-1/2 mt-1">
                        Alerts you after this many consecutive server failures.
                      </div>
                    </div>
                  </label>
                  <select
                    id="failure-threshold"
                    className="w-full p-2 border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 hover:border-gray-500 text-white text-sm bg-black"
                    value={form.failureThreshold}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        failureThreshold: Number(e.target.value),
                      }))
                    }
                    required
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                {formError && (
                  <div className="mt-3 p-2 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
                    {formError}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-700 transition-colors cursor-pointer text-[15px] font-semibold"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-medium rounded-sm hover:bg-white/90 transition-colors transform duration-200 text-sm cursor-pointer flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {isSubmitting ? "Adding..." : "Add Server"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && serverToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <div className="bg-black rounded-lg p-6 w-full max-w-xs shadow-lg border border-gray-700 text-center">
            <h2 className="text-md font-semibold text-white mb-2">
              Confirm Delete
            </h2>
            <p className="text-white/70 mb-4 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-400">
                {serverToDelete.name}
              </span>
              ?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 bg-white text-black rounded font-semibold text-sm cursor-pointer"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold text-sm cursor-pointer"
                disabled={isDeleting}
                onClick={async () => {
                  if (!serverToDelete) return;
                  setIsDeleting(true);
                  setDeleteError("");
                  const token = localStorage.getItem("token");
                  const result = await handleDeleteServer(
                    serverToDelete.id,
                    token
                  );
                  if (result.success) {
                    setShowDeleteConfirm(false);
                    setServerToDelete(null);
                    refetchServers();
                    // Set a new selected server after deletion
                    setTimeout(() => {
                      const remainingServers = servers.filter(s => s.id !== serverToDelete.id);
                      if (remainingServers.length > 0) {
                        setSelectedCard(remainingServers[0].name);
                        onServerSelect(remainingServers[0].name);
                      } else {
                        setSelectedCard(null);
                        onServerSelect(null);
                      }
                    }, 0);
                  } else {
                    setDeleteError(
                      result.error ||
                      "Failed to delete server. Please try again."
                    );
                  }
                  setIsDeleting(false);
                }}
              >
                {isDeleting && (
                  <svg
                    className="animate-spin h-4 w-4 text-white inline-block mr-2"
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
            {deleteError && (
              <div className="mt-3 p-2 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
                {deleteError}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modify Server Dialog */}
      {showModifyDialog && serverToModify && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <div className="bg-black rounded-lg p-6 w-full max-w-[400px] shadow-lg border border-gray-700 text-center">
            <h2 className="text-md font-semibold text-white mb-2">
              Modify Server
            </h2>
            <form
              onSubmit={(e) => handleModifyServer({
                e,
                serverToModify,
                modifyForm,
                setIsModifying,
                setModifyError,
                setShowModifyDialog,
                setServerToModify,
                refetchServers
              })}
              className="flex flex-col gap-4"
            >
              <div className="text-left">
                <label className="block text-white/80 mb-1 text-sm">
                  Server Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded bg-transparent text-white text-sm border border-gray-700 focus:outline-none"
                  value={modifyForm.name}
                  onChange={(e) =>
                    setModifyForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="text-left">
                <label className="block text-white/80 mb-1 text-sm">URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded bg-transparent text-white text-sm border border-gray-700 focus:outline-none"
                  value={modifyForm.url}
                  onChange={(e) =>
                    setModifyForm((f) => ({ ...f, url: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="text-left">                <label className="block text-white/80 mb-1 text-sm">
                Ping Interval (seconds)
                <span className="text-xs ml-1 text-gray-400">(Minimum: 5 minutes / 300 seconds)</span>
              </label>
                <input
                  type="number"
                  min={300}
                  className="w-full px-3 py-2 rounded bg-transparent text-white text-sm border border-gray-700 focus:outline-none"
                  value={modifyForm.pingInterval}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setModifyForm((f) => ({
                      ...f,
                      pingInterval: value < 300 ? 300 : value,
                    }));
                  }}
                  required
                />
              </div>
              <div className="text-left">
                <label
                  className="text-sm font-sm text-white flex items-center gap-1"
                  htmlFor="failure-threshold"
                >
                  Failure Threshold
                  <div className="relative group cursor-pointer mb-1">
                    <span className="text-white font-bold border-[1px] py-[1px] px-[6px] rounded-full text-[10px]">
                      !
                    </span>
                    <div className="absolute z-10 hidden group-hover:block w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg top-full left-1/2 -translate-x-1/2 mt-1">
                      Alerts you after this many consecutive server failures.
                    </div>
                  </div>
                </label>
                <select
                  id="modify-failure-threshold"
                  className="w-full px-3 py-2 rounded bg-black text-white text-sm border border-gray-700 focus:outline-none"
                  value={modifyForm.failureThreshold}
                  onChange={(e) =>
                    setModifyForm((f) => ({
                      ...f,
                      failureThreshold: Number(e.target.value),
                    }))
                  }
                  required
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              {modifyError && (
                <div className="mt-2 p-2 bg-red-900/50 border border-red-500/50 text-red-200 rounded-sm text-sm">
                  {modifyError}
                </div>
              )}
              <div className="flex gap-2 justify-center mt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-black rounded font-semibold text-sm cursor-pointer"
                  onClick={() => setShowModifyDialog(false)}
                  disabled={isModifying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm cursor-pointer flex items-center justify-center"
                  disabled={isModifying}
                >
                  {isModifying && (
                    <svg
                      className="animate-spin h-4 w-4 text-white inline-block mr-2"
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  {isModifying ? "Saving..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
