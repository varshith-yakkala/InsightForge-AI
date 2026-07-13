import type { Document, Conversation, SourceCitation, DocumentChunk, DashboardStats, FileKind } from '@/types'
import { uid } from '@/utils/format'

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()

export const mockDocuments: Document[] = [
  {
    id: 'doc_1',
    filename: 'Q3_Financial_Report.pdf',
    fileType: 'pdf',
    sizeBytes: 2_453_120,
    uploadedAt: hoursAgo(2),
    chunks: 142,
    embeddingStatus: 'indexed',
    indexed: true,
    favorite: true,
  },
  {
    id: 'doc_2',
    filename: 'product-architecture-notes.md',
    fileType: 'md',
    sizeBytes: 84_233,
    uploadedAt: hoursAgo(5),
    chunks: 38,
    embeddingStatus: 'indexed',
    indexed: true,
  },
  {
    id: 'doc_3',
    filename: 'customer_interview_transcripts.txt',
    fileType: 'txt',
    sizeBytes: 512_400,
    uploadedAt: hoursAgo(9),
    chunks: 96,
    embeddingStatus: 'indexed',
    indexed: true,
  },
  {
    id: 'doc_4',
    filename: 'security_compliance_policy.pdf',
    fileType: 'pdf',
    sizeBytes: 1_120_990,
    uploadedAt: hoursAgo(27),
    chunks: 61,
    embeddingStatus: 'embedding',
    indexed: false,
  },
  {
    id: 'doc_5',
    filename: 'onboarding-guide.md',
    fileType: 'md',
    sizeBytes: 45_120,
    uploadedAt: hoursAgo(48),
    chunks: 21,
    embeddingStatus: 'indexed',
    indexed: true,
  },
  {
    id: 'doc_6',
    filename: 'engineering_postmortem_notes.txt',
    fileType: 'txt',
    sizeBytes: 203_880,
    uploadedAt: hoursAgo(72),
    chunks: 29,
    embeddingStatus: 'failed',
    indexed: false,
  },
]

function makeChunks(docs: Document[]): DocumentChunk[] {
  const previews = [
    'Revenue for the quarter increased 18% year-over-year, driven primarily by expansion in the enterprise segment...',
    'The retrieval pipeline uses hybrid search combining dense vector similarity with BM25 keyword matching for...',
    'Customers consistently cited onboarding friction as the top blocker to activation, particularly around...',
    'All data at rest is encrypted using AES-256, and access to production systems requires hardware key MFA...',
    'New team members should complete the environment setup checklist before their first sprint planning...',
  ]
  return Array.from({ length: 4 }).map((_, i) => {
    const doc = docs[i % docs.length]
    return {
      id: uid('chunk'),
      chunkIndex: i + 1,
      page: doc.fileType === 'pdf' ? i + 2 : undefined,
      text: previews[i % previews.length],
      similarity: 0.94 - i * 0.06,
    }
  })
}

function makeSources(docs: Document[]): SourceCitation[] {
  return makeChunks(docs).map((c, i) => {
    const doc = docs[i % docs.length]
    return {
      id: uid('src'),
      documentId: doc.id,
      filename: doc.filename,
      fileType: doc.fileType,
      page: c.page,
      chunkIndex: c.chunkIndex,
      similarity: c.similarity ?? 0.9,
      preview: c.text,
    }
  })
}

const sampleAnswer = `Based on the indexed documents, here's what I found:

Revenue grew **18% year-over-year**, largely attributed to expansion within the enterprise segment and a reduction in mid-market churn. The finance team highlighted three contributing factors:

1. Enterprise contract renewals came in **12% above** forecast
2. New logo acquisition in EMEA outpaced plan by 4 deals
3. Net revenue retention improved to 118%

\`\`\`sql
SELECT quarter, SUM(revenue) AS total_revenue
FROM finance.quarterly_summary
WHERE quarter = 'Q3-2026'
GROUP BY quarter;
\`\`\`

| Metric | Q2 | Q3 | Change |
|---|---|---|---|
| Revenue | $4.2M | $5.0M | +18% |
| NRR | 111% | 118% | +7pt |
| Churn | 3.1% | 2.4% | -0.7pt |

Let me know if you'd like a deeper breakdown by region or segment.`

export function generateMockAssistantMessage() {
  const docs = mockDocuments.filter((d) => d.indexed)
  return {
    content: sampleAnswer,
    confidence: 0.91,
    sources: makeSources(docs),
    retrievedChunks: makeChunks(docs),
    generationTimeMs: 1240 + Math.round(Math.random() * 600),
    tokenUsage: { prompt: 1832, completion: 246, total: 2078 },
  }
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Q3 revenue growth drivers',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    pinned: true,
    messages: [],
  },
  {
    id: 'conv_2',
    title: 'RAG chunking strategy comparison',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(5),
    messages: [],
  },
  {
    id: 'conv_3',
    title: 'Customer onboarding friction points',
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(28),
    messages: [],
  },
  {
    id: 'conv_4',
    title: 'Security policy summary for auditors',
    createdAt: hoursAgo(75),
    updatedAt: hoursAgo(70),
    messages: [],
  },
]

export const suggestedPrompts: string[] = [
  'Summarize the key takeaways from the Q3 financial report',
  'What did customers say about onboarding friction?',
  'Explain our retrieval architecture in plain terms',
  'List the security controls covered in the compliance policy',
]

function dayLabel(daysAgo: number) {
  const d = new Date(now - daysAgo * 86_400_000)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const mockDashboardStats: DashboardStats = {
  documentsIndexed: mockDocuments.filter((d) => d.indexed).length,
  totalChunks: mockDocuments.reduce((sum, d) => sum + d.chunks, 0),
  totalEmbeddings: mockDocuments.reduce((sum, d) => sum + d.chunks, 0),
  totalQueries: 1284,
  avgRetrievalMs: 186,
  avgLlmResponseMs: 1340,
  uploadTrend: Array.from({ length: 7 }).map((_, i) => ({
    date: dayLabel(6 - i),
    count: Math.round(2 + Math.random() * 6),
  })),
  queriesTrend: Array.from({ length: 7 }).map((_, i) => ({
    date: dayLabel(6 - i),
    count: Math.round(40 + Math.random() * 120),
  })),
  documentTypeBreakdown: (['pdf', 'md', 'txt'] as FileKind[]).map((type) => ({
    type,
    count: mockDocuments.filter((d) => d.fileType === type).length,
  })),
}
