import { atom } from "recoil";

interface AlertSettings {
  id: string;
  serverId: string;
  emailNotifications: boolean;
  failureThreshold: number;
  responseTimeThreshold: number | null;
}

interface PingHistory {
  id: string;
  serverId: string;
  status: boolean;
  responseTime: number | null;
  statusCode: number | null;
  timestamp: string;
  // heapUsage: number | null;
  // totalHeap: number | null;
  // rssMemory: number | null;
  // totalRss: number | null;
}

interface PingStats {
  total: number;
  successful: number;
  failed: number;
  successRate: string;
}

export interface ServerBasic {
  id: string;
  userId: string;
  url: string;
  name: string;
  description: string | null;
  isActive: boolean;
  pingInterval: number;
  createdAt: string;
  updatedAt: string;
  lastPingedAt: string | null;
}

export interface ServerDetailed extends ServerBasic {
  alertSettings?: AlertSettings;
  pingHistory?: PingHistory[];
  pingStats: PingStats;
}

// Interface for ping history cache
interface PingHistoryCache {
  [key: string]: {
    // key format: `${serverId}-${days}`
    data: PingHistory[];
    lastFetched: number;
  };
}

// Store the list of basic server info
export const serversAtom = atom<ServerBasic[]>({
  key: "serversState",
  default: [],
});

// Store detailed server data with caching
export const serverDetailsAtom = atom<{ [key: string]: ServerDetailed }>({
  key: "serverDetailsState",
  default: {},
});

// Store ping history data with caching
export const pingHistoryAtom = atom<PingHistoryCache>({
  key: "pingHistoryState",
  default: {},
});

export const selectedDaysAtom = atom<number>({
  key: "selectedDaysAtom",
  default: 7,
});
