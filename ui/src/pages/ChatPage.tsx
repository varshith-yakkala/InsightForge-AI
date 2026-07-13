import { useEffect, useMemo, useRef, useState } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useSettingsStore } from '@/store/settingsStore'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { RightPanel } from '@/components/layout/RightPanel'
import { Navbar } from '@/components/layout/Navbar'
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal'
import type { SourceCitation } from '@/types'

export function ChatPage() {
  const { conversations, activeConversationId, sendMessage, cancelGeneration, isGenerating, setFeedback, regenerate } =
    useChatStore()
  const settings = useSettingsStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [previewSource, setPreviewSource] = useState<SourceCitation | null>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null
  const messages = activeConversation?.messages ?? []

  const selectedMessage = useMemo(() => {
    if (selectedMessageId) return messages.find((m) => m.id === selectedMessageId) ?? null
    return [...messages].reverse().find((m) => m.role === 'assistant' && !m.streaming) ?? null
  }, [messages, selectedMessageId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  function handleSend(text: string) {
    setSelectedMessageId(null)
    sendMessage(text, {
      backendUrl: settings.backendUrl,
      topK: settings.topK,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    })
  }

  function handleRegenerate(messageId: string) {
    if (!activeConversationId) return
    regenerate(activeConversationId, messageId, {
      backendUrl: settings.backendUrl,
      topK: settings.topK,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    })
  }

  return (
    <div className="flex h-full min-w-0 flex-1">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <Navbar
          title={activeConversation?.title ?? 'New conversation'}
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen((o) => !o)}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onPrompt={handleSend} />
          ) : (
            <div className="mx-auto max-w-3xl py-4">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onFeedback={(id, fb) => activeConversationId && setFeedback(activeConversationId, id, fb)}
                  onRegenerate={handleRegenerate}
                  onOpenSource={setPreviewSource}
                  onSelectContext={setSelectedMessageId}
                  active={selectedMessageId === m.id}
                />
              ))}
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} onCancel={cancelGeneration} isGenerating={isGenerating} />
      </div>

      {rightPanelOpen && <RightPanel message={selectedMessage} />}

      <DocumentPreviewModal source={previewSource} onClose={() => setPreviewSource(null)} />
    </div>
  )
}
