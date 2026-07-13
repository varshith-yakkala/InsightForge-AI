import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import toast from 'react-hot-toast'
import {
  LuCopy,
  LuThumbsUp,
  LuThumbsDown,
  LuRotateCw,
  LuCheck,
  LuUser,
  LuSparkles,
  LuGauge,
} from 'react-icons/lu'
import type { ChatMessage, SourceCitation } from '@/types'
import { SourceCard } from './SourceCard'
import { cn } from '@/utils/cn'
import { formatMs, formatPercent } from '@/utils/format'

export function MessageBubble({
  message,
  onFeedback,
  onRegenerate,
  onOpenSource,
  onSelectContext,
  active,
}: {
  message: ChatMessage
  onFeedback: (id: string, fb: 'up' | 'down') => void
  onRegenerate: (id: string) => void
  onOpenSource: (s: SourceCitation) => void
  onSelectContext: (id: string) => void
  active?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 1500)
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end gap-3 px-4 py-2"
      >
        <div className="max-w-[70%] rounded-2xl rounded-tr-sm gradient-primary px-4 py-2.5 text-[13.5px] leading-relaxed text-white shadow-lg shadow-primary/10">
          {message.content}
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card border border-border">
          <LuUser className="h-3.5 w-3.5 text-text-light" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectContext(message.id)}
      className={cn(
        'group flex gap-3 rounded-xl px-4 py-3 transition-colors',
        active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]',
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary shadow-md shadow-primary/20">
        <LuSparkles className="h-3.5 w-3.5 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        {message.streaming && !message.content ? (
          <ThinkingIndicator />
        ) : (
          <div className="md-content max-w-none text-[13.5px] text-text-light">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeKatex]}
            >
              {message.content}
            </ReactMarkdown>
            {message.streaming && <span className="animate-typing-blink text-primary">▍</span>}
          </div>
        )}

        {!message.streaming && message.confidence !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <LuGauge className="h-3 w-3 text-success" />
            <span className="text-[11px] text-text-muted">
              Confidence: <span className="font-medium text-success">{formatPercent(message.confidence)}</span>
            </span>
            {message.generationTimeMs && (
              <>
                <span className="text-text-muted">·</span>
                <span className="text-[11px] text-text-muted">{formatMs(message.generationTimeMs)}</span>
              </>
            )}
          </div>
        )}

        {!message.streaming && message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
              Sources ({message.sources.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {message.sources.map((s, i) => (
                <SourceCard key={s.id} source={s} index={i} onOpen={onOpenSource} />
              ))}
            </div>
          </div>
        )}

        {!message.streaming && message.content && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <ActionIcon onClick={handleCopy} label="Copy">
              {copied ? <LuCheck className="h-3.5 w-3.5 text-success" /> : <LuCopy className="h-3.5 w-3.5" />}
            </ActionIcon>
            <ActionIcon onClick={() => onFeedback(message.id, 'up')} label="Good response" active={message.feedback === 'up'}>
              <LuThumbsUp className={cn('h-3.5 w-3.5', message.feedback === 'up' && 'fill-current text-success')} />
            </ActionIcon>
            <ActionIcon onClick={() => onFeedback(message.id, 'down')} label="Bad response" active={message.feedback === 'down'}>
              <LuThumbsDown className={cn('h-3.5 w-3.5', message.feedback === 'down' && 'fill-current text-danger')} />
            </ActionIcon>
            <ActionIcon onClick={() => onRegenerate(message.id)} label="Regenerate">
              <LuRotateCw className="h-3.5 w-3.5" />
            </ActionIcon>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ActionIcon({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  active?: boolean
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={label}
      className={cn(
        'focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/5 hover:text-text',
        active && 'text-text',
      )}
    >
      {children}
    </button>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="text-xs text-text-muted">Thinking</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  )
}
