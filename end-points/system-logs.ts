import type { SystemLog } from "@/schema/system-log";
import { getStoredToken, request } from "@/end-points/http";

export const systemLogs = {
  async getSystemLogs(): Promise<SystemLog[]> {
    return request<SystemLog[]>("/system-logs", {
      method: "GET",
      token: getStoredToken(),
    });
  },
};
