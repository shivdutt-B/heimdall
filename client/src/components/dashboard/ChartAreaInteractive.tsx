import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  className?: string;
}

// Clean up data to remove duplicates and sort by date
const data = [
  { date: "Jun 1", visitors: 3000, engagement: 1400 },
  { date: "Jun 3", visitors: 2000, engagement: 1300 },
  { date: "Jun 5", visitors: 2780, engagement: 1908 },
  { date: "Jun 7", visitors: 4890, engagement: 2800 },
  { date: "Jun 9", visitors: 2390, engagement: 1800 },
  { date: "Jun 11", visitors: 3490, engagement: 2300 },
  { date: "Jun 13", visitors: 2000, engagement: 1500 },
  { date: "Jun 15", visitors: 4000, engagement: 2400 },
  { date: "Jun 17", visitors: 3000, engagement: 2000 },
  { date: "Jun 19", visitors: 2000, engagement: 1600 },
  { date: "Jun 21", visitors: 4000, engagement: 2400 },
  { date: "Jun 23", visitors: 3000, engagement: 2000 },
  { date: "Jun 25", visitors: 2000, engagement: 1600 },
  { date: "Jun 27", visitors: 4000, engagement: 2400 },
  { date: "Jun 30", visitors: 2000, engagement: 1500 },
  { date: "Jul 2", visitors: 3500, engagement: 2100 },
  { date: "Jul 4", visitors: 4200, engagement: 2600 },
  { date: "Jul 6", visitors: 3800, engagement: 2300 },
  { date: "Jul 8", visitors: 2900, engagement: 1900 },
  { date: "Jul 10", visitors: 3300, engagement: 2000 },
  { date: "Jul 12", visitors: 4100, engagement: 2500 },
  { date: "Jul 14", visitors: 3600, engagement: 2200 },
  { date: "Jul 16", visitors: 2800, engagement: 1700 },
  { date: "Jul 18", visitors: 3900, engagement: 2400 },
  { date: "Jul 20", visitors: 4300, engagement: 2700 },
  { date: "Jul 22", visitors: 3700, engagement: 2300 },
  { date: "Jul 24", visitors: 3100, engagement: 1900 },
  { date: "Jul 26", visitors: 4000, engagement: 2500 },
  { date: "Jul 28", visitors: 3400, engagement: 2100 },
  { date: "Jul 30", visitors: 3800, engagement: 2400 },
];

export const ChartAreaInteractive: React.FC<Props> = ({ className }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Calculate the width based on data points (50px per point is a good starting point)
  const chartWidth = Math.max(data.length * 50, 800);

  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900/50 ${className}`}
    >
      {/* Chart Header with Navigation */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
            <span className="text-sm font-medium text-white/60">Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="text-sm font-medium text-white/60">
              Engagement
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const container = document.getElementById("chart-container");
              if (container) {
                container.scrollTo({
                  left: Math.max(0, container.scrollLeft - 200),
                  behavior: "smooth",
                });
              }
            }}
            className="p-2 text-white/60 hover:text-white/90 transition-colors disabled:opacity-50"
            disabled={scrollPosition === 0}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              const container = document.getElementById("chart-container");
              if (container) {
                container.scrollTo({
                  left: container.scrollLeft + 200,
                  behavior: "smooth",
                });
              }
            }}
            className="p-2 text-white/60 hover:text-white/90 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
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

      {/* Scrollable Chart Container */}
      <div
        id="chart-container"
        className="overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-gray-900/20 transition-all duration-300 scroll-smooth px-4"
        onScroll={(e) =>
          setScrollPosition((e.target as HTMLDivElement).scrollLeft)
        }
      >
        <div
          className="h-[300px] min-w-[800px] py-4"
          style={{ width: chartWidth }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorEngagement"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#4B5563"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#4B5563"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEngagement)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
