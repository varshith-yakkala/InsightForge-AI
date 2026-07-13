// ---------- Documents ----------

export type FileKind = 'pdf' | 'txt' | 'md'

export type IndexStatus = 'queued' | 'chunking' | 'embedding' | 'indexed' | 'failed'

export interface DocumentChunk {
  id: string
  chunkIndex: number
  page?: number
  text: string
  similarity?: number
}

export interface Document {
  id: string
  filename: string
  fileType: FileKind
  sizeBytes: number
  uploadedAt: string
  chunks: number
  embeddingStatus: IndexStatus
  indexed: boolean
  favorite?: boolean
}

// ---------- Chat ----------

export type MessageRole = 'user' | 'assistant'

export interface SourceCitation {
  id: string
  documentId: string
  filename: string
  fileType: FileKind
  page?: number
  chunkIndex: number
  similarity: number
  preview: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  confidence?: number
  sources?: SourceCitation[]
  retrievedChunks?: DocumentChunk[]
  generationTimeMs?: number
  tokenUsage?: { prompt: number; completion: number; total: number }
  feedback?: 'up' | 'down' | null
  streaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pinned?: boolean
  messages: ChatMessage[]
}

// ---------- System ----------

export type ConnectionStatus = 'online' | 'offline' | 'connecting'

export interface SystemStatus {
  backend: ConnectionStatus
  embeddingModel: string
  llmModel: string
  latencyMs?: number
}

export interface RagSettings {
  llmModel: string
  embeddingModel: string
  chunkSize: number
  chunkOverlap: number
  topK: number
  temperature: number
  maxTokens: number
  backendUrl: string
  theme: 'dark' | 'light'
  accentColor: string
}

export interface DashboardStats {
  documentsIndexed: number
  totalChunks: number
  totalEmbeddings: number
  totalQueries: number
  avgRetrievalMs: number
  avgLlmResponseMs: number
  uploadTrend: { date: string; count: number }[]
  queriesTrend: { date: string; count: number }[]
  documentTypeBreakdown: { type: FileKind; count: number }[]
}
