import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
  title: string;
  url: string;
  pingTime: string;
  pingInterval: string;
  status: "online" | "offline";
}

type CarouselItem = { type: "add-new" } | { type: "card"; data: Card };

interface SectionCardsProps {
  onServerSelect: (serverName: string | null) => void;
  selectedServer?: string | null;
}

export const SectionCards: React.FC<SectionCardsProps> = ({
  onServerSelect,
  selectedServer: externalSelectedServer,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Sync internal selection with external selection
  useEffect(() => {
    if (externalSelectedServer) {
      setSelectedCard(externalSelectedServer);
    }
  }, [externalSelectedServer]);

  // Update cards per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // sm
        setCardsPerPage(1);
      } else if (width < 1024) {
        // md
        setCardsPerPage(2);
      } else {
        // lg and above
        setCardsPerPage(3);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards: Card[] = [
    {
      title: "google server",
      url: "https://www.google.com",
      pingTime: "2024-01-10 15:30:00",
      pingInterval: "5m",
      status: "online",
    },
    {
      title: "youtube server",
      url: "https://www.youtube.com",
      pingTime: "2024-01-10 15:25:00",
      pingInterval: "10m",
      status: "offline",
    },
    {
      title: "amazon server",
      url: "https://www.amazon.com",
      pingTime: "2024-01-10 15:20:00",
      pingInterval: "15m",
      status: "online",
    },
    {
      title: "flipkart server",
      url: "https://www.flipkart.com",
      pingTime: "2024-01-10 15:15:00",
      pingInterval: "20m",
      status: "offline",
    },
    {
      title: "netflix server",
      url: "https://www.netflix.com",
      pingTime: "2024-01-10 15:10:00",
      pingInterval: "5m",
      status: "online",
    },
    {
      title: "microsoft server",
      url: "https://www.microsoft.com",
      pingTime: "2024-01-10 15:05:00",
      pingInterval: "10m",
      status: "online",
    },
  ];

  const allItems: CarouselItem[] = [
    { type: "add-new" },
    ...cards.map((card) => ({ type: "card" as const, data: card })),
  ];

  const pageCount = Math.ceil(allItems.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const visibleItems = allItems.slice(startIndex, startIndex + cardsPerPage);

  // Reset to first page when cardsPerPage changes
  useEffect(() => {
    setCurrentPage(0);
  }, [cardsPerPage]);

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

  // Handle card selection
  const handleCardSelect = (serverName: string) => {
    setSelectedCard(serverName);
    onServerSelect(serverName);
  };

  return (
    <div className="w-full">
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage === index
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
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 -ml-4 sm:-ml-6 text-white rounded-xl transition-all duration-200 ${
            currentPage === 0
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

        <div className="overflow-hidden px-4 sm:px-6">
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
                    key={`${item.data.title}-${index}`}
                    onClick={() => handleCardSelect(item.data.title)}
                    className={`rounded-lg border-white/10 border bg-black/20 p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 group relative cursor-pointer ${
                      selectedCard === item.data.title
                        ? "ring-2 ring-blue-500/50 border-blue-500/50 bg-white/5"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-white capitalize hover:text-gray-300 transition-colors">
                        {item.data.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.data.status === "online"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {item.data.status}
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
                          Last ping: {item.data.pingTime}
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
                          Ping interval: {item.data.pingInterval}
                        </span>
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                        Modify
                      </button>
                      <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
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
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 -mr-4 sm:-mr-6 text-white rounded-xl transition-all duration-200 ${
            currentPage === pageCount - 1
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
    </div>
  );
};
