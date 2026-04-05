import type { Settings } from "@/schema/setting";
import { getStoredToken, request } from "@/end-points/http";

export const settings = {
  async getSettings(): Promise<Settings> {
    return request<Settings>("/settings", {
      method: "GET",
    });
  },

  async updateSettings(input: Partial<Settings>): Promise<Settings> {
    return request<Settings>("/settings", {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },
};
