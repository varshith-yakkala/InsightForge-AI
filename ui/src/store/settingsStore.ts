import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RagSettings } from '@/types'

interface SettingsState extends RagSettings {
  update: (patch: Partial<RagSettings>) => void
  reset: () => void
}

const defaults: RagSettings = {
  llmModel: 'gpt-4-turbo',
  embeddingModel: 'text-embedding-3-large',
  chunkSize: 512,
  chunkOverlap: 64,
  topK: 5,
  temperature: 0.3,
  maxTokens: 1024,
  backendUrl: 'http://localhost:8000',
  theme: 'dark',
  accentColor: '#4F46E5',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      update: (patch) => set((s) => ({ ...s, ...patch })),
      reset: () => set({ ...defaults }),
    }),
    { name: 'insightforge-settings' },
  ),
)
