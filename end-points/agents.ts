import type { Agent } from "@/schema/agent";
import { getStoredToken, request } from "@/end-points/http";

export const agents = {
  async getAgents() {
    return request<Agent[]>("/agents", {
      method: "GET",
      token: getStoredToken(),
    });
  },

  async createAgent(input: Partial<Agent>): Promise<Agent> {
    return request<Agent>("/agents", {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },

  async updateAgent(id: number, input: Partial<Agent>): Promise<Agent> {
    return request<Agent>(`/agents/${id}`, {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },

  async deleteAgent(id: number): Promise<void> {
    return request<void>(`/agents/${id}`, {
      method: "DELETE",
      token: getStoredToken(),
    });
  },
};
