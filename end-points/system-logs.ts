import type { SystemLog, LogLevel } from "@/schema/system-log";
import { getStoredToken, request } from "@/end-points/http";

export interface SystemLogsQuery {
  limit?: number;
  offset?: number;
}

export interface ClearSystemLogsInput {
  /** Only delete rows older than N hours. Omit to delete regardless of age. */
  olderThanHours?: number;
  /** Only delete rows of this level. Omit to delete regardless of level. */
  level?: LogLevel;
}

export interface ClearSystemLogsResponse {
  deleted: number;
}

function buildQuery(q: SystemLogsQuery | undefined): string {
  if (!q) return "";
  const params = new URLSearchParams();
  if (q.limit != null) params.set("limit", String(q.limit));
  if (q.offset != null) params.set("offset", String(q.offset));
  const s = params.toString();
  return s ? `?${s}` : "";
}

function buildClearQuery(input: ClearSystemLogsInput): string {
  const params = new URLSearchParams();
  if (input.olderThanHours != null) {
    params.set("olderThanHours", String(input.olderThanHours));
  }
  if (input.level) params.set("level", input.level);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const systemLogs = {
  async getSystemLogs(query?: SystemLogsQuery): Promise<SystemLog[]> {
    return request<SystemLog[]>(`/system-logs${buildQuery(query)}`, {
      method: "GET",
      token: getStoredToken(),
    });
  },
  async clearSystemLogs(
    input: ClearSystemLogsInput = {},
  ): Promise<ClearSystemLogsResponse> {
    return request<ClearSystemLogsResponse>(
      `/system-logs${buildClearQuery(input)}`,
      {
        method: "DELETE",
        token: getStoredToken(),
      },
    );
  },
};
