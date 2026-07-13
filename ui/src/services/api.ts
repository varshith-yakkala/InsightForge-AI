import axios from 'axios'
import type { SystemStatus, Document } from '@/types'
import { generateMockAssistantMessage } from '@/data/mockData'
import { uid } from '@/utils/format'

function client(backendUrl: string) {
  return axios.create({ baseURL: backendUrl, timeout: 8000 })
}

export async function checkHealth(backendUrl: string): Promise<SystemStatus> {
  const started = performance.now()
  try {
    const res = await client(backendUrl).get('/health')
    const latencyMs = Math.round(performance.now() - started)
    return {
      backend: 'online',
      embeddingModel: res.data?.embeddingModel ?? 'text-embedding-3-large',
      llmModel: res.data?.llmModel ?? 'gpt-4-turbo',
      latencyMs,
    }
  } catch {
    // Demo mode: no live backend configured/reachable.
    return {
      backend: 'offline',
      embeddingModel: 'text-embedding-3-large',
      llmModel: 'gpt-4-turbo',
    }
  }
}

export interface UploadResult {
  documents: Document[]
}

export async function uploadDocuments(
  backendUrl: string,
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  try {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const res = await client(backendUrl).post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
      },
    })
    return { documents: res.data?.documents ?? [] }
  } catch {
    // Demo mode: simulate progress and return locally-constructed document records.
    await simulateProgress(onProgress)
    return {
      documents: files.map((f) => ({
        id: uid('doc'),
        filename: f.name,
        fileType: inferFileType(f.name),
        sizeBytes: f.size,
        uploadedAt: new Date().toISOString(),
        chunks: Math.max(4, Math.round(f.size / 3200)),
        embeddingStatus: 'indexed' as const,
        indexed: true,
      })),
    }
  }
}

export interface QueryResult {
  content: string
  confidence: number
  sources: ReturnType<typeof generateMockAssistantMessage>['sources']
  retrievedChunks: ReturnType<typeof generateMockAssistantMessage>['retrievedChunks']
  generationTimeMs: number
  tokenUsage: { prompt: number; completion: number; total: number }
}

export async function runQuery(
  backendUrl: string,
  question: string,
  settings: { topK: number; temperature: number; maxTokens: number },
): Promise<QueryResult> {
  try {
    const res = await client(backendUrl).post('/query', { question, ...settings })
    return res.data
  } catch {
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700))
    return generateMockAssistantMessage()
  }
}

function inferFileType(filename: string): 'pdf' | 'txt' | 'md' {
  if (filename.endsWith('.pdf')) return 'pdf'
  if (filename.endsWith('.md')) return 'md'
  return 'txt'
}

async function simulateProgress(onProgress?: (percent: number) => void) {
  if (!onProgress) return
  for (let p = 0; p <= 100; p += Math.round(10 + Math.random() * 15)) {
    onProgress(Math.min(p, 100))
    await new Promise((r) => setTimeout(r, 120))
  }
  onProgress(100)
}
