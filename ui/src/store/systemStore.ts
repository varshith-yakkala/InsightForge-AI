import { create } from "zustand";
import type { SystemStatus } from "@/types";
import { checkHealth } from "@/services/api";

interface SystemState extends SystemStatus {
  refresh: (backendUrl: string) => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
  backend: "connecting",

  embeddingModel: "Loading...",

  llmModel: "Loading...",

  latencyMs: undefined,

  refresh: async (backendUrl: string) => {
    try {
      const status = await checkHealth(backendUrl);

      set({
        backend: status.backend,
        embeddingModel: status.embeddingModel,
        llmModel: status.llmModel,
        latencyMs: status.latencyMs,
      });
    } catch (err) {
      console.error("Health check failed:", err);

      set({
        backend: "offline",
        embeddingModel: "Unavailable",
        llmModel: "Unavailable",
        latencyMs: undefined,
      });
    }
  },
}));