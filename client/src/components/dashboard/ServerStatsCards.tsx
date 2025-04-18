import React from "react";
import { motion } from "framer-motion";

interface ServerStats {
  serverName: string;
  totalPings: number;
  successfulPings: number;
  failedPings: number;
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface ServerStatsCardsProps {
  stats: ServerStats | null;
}

export const ServerStatsCards: React.FC<ServerStatsCardsProps> = ({
  stats,
}) => {
  if (!stats) {
    return (
      <div className="text-center text-white/50 py-8 font-medium">
        Select a server to view its statistics
      </div>
    );
  }

  const cards = [
    {
      title: "Total Pings",
      value: stats.totalPings.toLocaleString(),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-600/20",
      textColor: "text-blue-400",
    },
    {
      title: "Ping Status",
      value: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-400">
              {stats.successfulPings.toLocaleString()} passed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-red-400">
              {stats.failedPings.toLocaleString()} failed
            </span>
          </div>
        </div>
      ),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-purple-500/20 to-purple-600/20",
      textColor: "text-purple-400",
    },
    {
      title: "Uptime",
      value: (
        // <div className="flex items-center gap-2">
        <div>
          <span>{stats.uptime.toFixed(2)}%</span>
          <div className="mt-2.5 flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${stats.uptime}%` }}
            ></div>
          </div>
        </div>
      ),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: "from-green-500/20 to-green-600/20",
      textColor: "text-green-400",
    },
    {
      title: "Memory Usage",
      value: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>
              {(stats.memoryUsage.used / 1024).toFixed(1)}GB /{" "}
              {(stats.memoryUsage.total / 1024).toFixed(1)}GB
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${stats.memoryUsage.percentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-orange-400">
            {stats.memoryUsage.percentage}% used
          </div>
        </div>
      ),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "from-orange-500/20 to-orange-600/20",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          key={card.title}
          className={`rounded-lg bg-gradient-to-br ${card.color} backdrop-blur-sm border border-white/10 p-4`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg bg-black/30 ${card.textColor}`}>
              {card.icon}
            </div>
            <div className="text-xs font-medium text-white/40">Last 24h</div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-white/60">
              {card.title}
            </div>
            <div className="mt-2 text-white font-medium">{card.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
