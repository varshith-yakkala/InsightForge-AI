import { create } from 'zustand'
import type { ChatMessage, Conversation } from '@/types'
import { mockConversations } from '@/data/mockData'
import { runQuery } from '@/services/api'
import { uid } from '@/utils/format'

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isGenerating: boolean
  cancelRequested: boolean

  setActiveConversation: (id: string | null) => void
  newConversation: () => string
  togglePin: (id: string) => void
  deleteConversation: (id: string) => void
  sendMessage: (
    text: string,
    settings: { backendUrl: string; topK: number; temperature: number; maxTokens: number },
  ) => Promise<void>
  cancelGeneration: () => void
  setFeedback: (conversationId: string, messageId: string, feedback: 'up' | 'down') => void
  regenerate: (
    conversationId: string,
    messageId: string,
    settings: { backendUrl: string; topK: number; temperature: number; maxTokens: number },
  ) => Promise<void>
}

function titleFromText(text: string) {
  const clean = text.trim().replace(/\s+/g, ' ')
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || 'New conversation'
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeConversationId: null,
  isGenerating: false,
  cancelRequested: false,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  newConversation: () => {
    const id = uid('conv')
    const conv: Conversation = {
      id,
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    }
    set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: id }))
    return id
  },

  togglePin: (id) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
    })),

  deleteConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
    })),

  sendMessage: async (text, settings) => {
    let { activeConversationId } = get()
    if (!activeConversationId) {
      activeConversationId = get().newConversation()
    }
    const conversationId = activeConversationId

    const userMessage: ChatMessage = {
      id: uid('msg'),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    const assistantId = uid('msg')
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      streaming: true,
    }

    set((s) => ({
      isGenerating: true,
      cancelRequested: false,
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              title: c.messages.length === 0 ? titleFromText(text) : c.title,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, userMessage, assistantPlaceholder],
            }
          : c,
      ),
    }))

    const result = await runQuery(settings.backendUrl, text, settings)

    if (get().cancelRequested) {
      set((s) => ({
        isGenerating: false,
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false, content: m.content || '_Generation cancelled._' } : m,
                ),
              }
            : c,
        ),
      }))
      return
    }

    await streamContent(conversationId, assistantId, result.content, set, get)

    set((s) => ({
      isGenerating: false,
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      streaming: false,
                      confidence: result.confidence,
                      sources: result.sources,
                      retrievedChunks: result.retrievedChunks,
                      generationTimeMs: result.generationTimeMs,
                      tokenUsage: result.tokenUsage,
                    }
                  : m,
              ),
            }
          : c,
      ),
    }))
  },

  cancelGeneration: () => set({ cancelRequested: true }),

  setFeedback: (conversationId, messageId, feedback) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, feedback: m.feedback === feedback ? null : feedback } : m,
              ),
            }
          : c,
      ),
    })),

  regenerate: async (conversationId, messageId, settings) => {
    const conv = get().conversations.find((c) => c.id === conversationId)
    if (!conv) return
    const idx = conv.messages.findIndex((m) => m.id === messageId)
    const priorUser = [...conv.messages.slice(0, idx)].reverse().find((m) => m.role === 'user')
    if (!priorUser) return

    set((s) => ({
      isGenerating: true,
      cancelRequested: false,
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: '', streaming: true, sources: undefined, retrievedChunks: undefined } : m,
              ),
            }
          : c,
      ),
    }))

    const result = await runQuery(settings.backendUrl, priorUser.content, settings)
    await streamContent(conversationId, messageId, result.content, set, get)

    set((s) => ({
      isGenerating: false,
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId
                  ? {
                      ...m,
                      streaming: false,
                      confidence: result.confidence,
                      sources: result.sources,
                      retrievedChunks: result.retrievedChunks,
                      generationTimeMs: result.generationTimeMs,
                      tokenUsage: result.tokenUsage,
                      feedback: null,
                    }
                  : m,
              ),
            }
          : c,
      ),
    }))
  },
}))

async function streamContent(
  conversationId: string,
  messageId: string,
  fullText: string,
  set: (fn: (s: ChatState) => Partial<ChatState>) => void,
  get: () => ChatState,
) {
  const words = fullText.split(/(\s+)/)
  let acc = ''
  for (const word of words) {
    if (get().cancelRequested) break
    acc += word
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, content: acc } : m)) }
          : c,
      ),
    }))
    await new Promise((r) => setTimeout(r, 14))
  }
}
