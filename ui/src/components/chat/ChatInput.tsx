import { useRef, useState, type KeyboardEvent } from 'react'
import { LuSend, LuSquare, LuPaperclip, LuMic } from 'react-icons/lu'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

export function ChatInput({
  onSend,
  onCancel,
  isGenerating,
}: {
  onSend: (text: string) => void
  onCancel: () => void
  isGenerating: boolean
}) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return
    onSend(trimmed)
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function autoGrow() {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-border bg-bg px-4 pb-4 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="focus-within:border-primary/50 flex items-end gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-lg shadow-black/10 transition-colors">
          <button
            onClick={() => toast('Attach files from the Upload page', { icon: '📎' })}
            className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Attach"
          >
            <LuPaperclip className="h-4 w-4" />
          </button>

          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              autoGrow()
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask InsightForge AI about your documents..."
            className="max-h-40 flex-1 resize-none bg-transparent py-1 text-[13.5px] text-text placeholder:text-text-muted focus:outline-none"
          />

          <button
            onClick={() => toast('Voice input is not available in this demo', { icon: '🎙️' })}
            className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Voice input"
          >
            <LuMic className="h-4 w-4" />
          </button>

          {isGenerating ? (
            <button
              onClick={onCancel}
              className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger transition-colors hover:bg-danger/25"
              aria-label="Stop generating"
            >
              <LuSquare className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className={cn(
                'focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
                value.trim() ? 'gradient-primary text-white shadow-md shadow-primary/30' : 'bg-white/5 text-text-muted',
              )}
              aria-label="Send message"
            >
              <LuSend className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-text-muted">
          InsightForge AI can make mistakes. Verify important information against source documents.
        </p>
      </div>
    </div>
  )
}
