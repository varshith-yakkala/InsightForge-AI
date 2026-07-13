import { create } from 'zustand'
import type { Document } from '@/types'
import { mockDocuments } from '@/data/mockData'
import { uploadDocuments } from '@/services/api'

interface DocumentsState {
  documents: Document[]
  uploading: { file: File; progress: number }[]
  addDocuments: (docs: Document[]) => void
  removeDocument: (id: string) => void
  toggleFavorite: (id: string) => void
  upload: (backendUrl: string, files: File[]) => Promise<void>
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: mockDocuments,
  uploading: [],

  addDocuments: (docs) => set((s) => ({ documents: [...docs, ...s.documents] })),

  removeDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

  toggleFavorite: (id) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d)),
    })),

  upload: async (backendUrl, files) => {
    set((s) => ({ uploading: [...s.uploading, ...files.map((file) => ({ file, progress: 0 }))] }))

    const result = await uploadDocuments(backendUrl, files, (percent) => {
      set((s) => ({
        uploading: s.uploading.map((u) => (files.includes(u.file) ? { ...u, progress: percent } : u)),
      }))
    })

    get().addDocuments(result.documents)
    set((s) => ({ uploading: s.uploading.filter((u) => !files.includes(u.file)) }))
  },
}))
