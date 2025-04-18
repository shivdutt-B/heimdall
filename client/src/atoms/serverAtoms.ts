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
  responseTime: number;
  statusCode: number;
  timestamp: string;
  heapUsage: number;
  totalHeap: number;
  rssMemory: number;
  totalRss: number;
}

export interface Server {
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
  alertSettings: AlertSettings;
  pingHistory: PingHistory[];
}

export const serversAtom = atom<Server[]>({
  key: "serversState",
  default: [],
});
