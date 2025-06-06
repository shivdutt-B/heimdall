import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartAreaSkeleton } from "../../skeletons/dashboard/ChartAreaSkeleton";

interface Props {
  className?: string;
  serverId: string | null;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  pings: PingData[];
  loading: boolean;
}

interface PingData {
  id: string;
  serverId: string;
  status: boolean;
  responseTime: number | null;
  statusCode: number | null;
  timestamp: string;
  heapUsage: number | null;
  totalHeap: number | null;
  rssMemory: number | null;
  totalRss: number | null;
}

interface ChartData {
  date: string;
  rss: number | null;
  heap: number | null;
}

export const ChartAreaInteractive: React.FC<Props> = ({
  className,
  serverId,
  selectedDays,
  setSelectedDays,
  pings,
  loading,
}) => {
  const [daysInput, setDaysInput] = useState(selectedDays.toString());

  useEffect(() => {
    setDaysInput(selectedDays.toString());
  }, [selectedDays]);

  // Calculate the width based on data points (50px per point is a good starting point)
  const chartData: ChartData[] = pings.map((ping) => ({
    date: ping.timestamp,
    rss: ping.rssMemory,
    heap: ping.heapUsage,
  }));
  const chartWidth = Math.max(chartData.length * 50, 800);

  if (!serverId || loading) {
    return <ChartAreaSkeleton className={className} />;
  }

  return (
    <div
      className={`rounded-md border border-gray-800 bg-transparent ${className}`}
    >
      {/* Chart Header with Navigation */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
            <span className="text-sm font-medium text-white/60">
              RSS Memory
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="text-sm font-medium text-white/60">
              Heap Memory
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/60">Last</span>
            <input
              type="number"
              min="1"
              max="365"
              value={daysInput}
              onChange={(e) => {
                const value = e.target.value;
                if (parseInt(value) > 0 && parseInt(value) <= 365) {
                  setDaysInput(value);
                }
              }}
              className="w-16 px-2 py-1 text-sm font-medium text-white/90 bg-transparent rounded-md border border-gray-700 focus:outline-none"
            />
            <span className="text-sm font-medium text-white/60">Days</span>
            <button
              onClick={() => {
                const days = parseInt(daysInput);
                if (days > 0 && days <= 365) {
                  setSelectedDays(days);
                }
              }}
              className="px-3 py-1 text-sm font-semibold text-white/90 bg-blue-500 rounded-sm transition-colors cursor-pointer"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Chart Container */}
      <div
        id="chart-container"
        className="overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-gray-900/20 transition-all duration-300 scroll-smooth px-4"
      >
        <div
          className="h-[300px] min-w-[800px] py-4"
          style={{ width: chartWidth }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRSS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHeap" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                label={{ value: "Date", position: "bottom", offset: 0 }}
              />
              <YAxis
                stroke="#4B5563"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} MB`}
                label={{
                  value: "Memory (MB)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
                formatter={(value) => [`${value} MB`]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Area
                type="monotone"
                dataKey="rss"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRSS)"
                name="RSS Memory"
              />
              <Area
                type="monotone"
                dataKey="heap"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHeap)"
                name="Heap Memory"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
