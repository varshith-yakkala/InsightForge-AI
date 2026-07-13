import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LuSearch,
  LuPlus,
  LuFiles,
  LuUpload,
  LuLayoutDashboard,
  LuSettings,
  LuInfo,
  LuCornerDownLeft,
} from 'react-icons/lu'
import { useChatStore } from '@/store/chatStore'

interface Command {
  id: string
  label: string
  group: string
  icon: React.ReactNode
  action: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const newConversation = useChatStore((s) => s.newConversation)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const commands: Command[] = useMemo(
    () => [
      { id: 'new-chat', label: 'Start a new chat', group: 'Actions', icon: <LuPlus className="h-3.5 w-3.5" />, action: () => { newConversation(); navigate('/') } },
      { id: 'documents', label: 'Go to Documents', group: 'Navigate', icon: <LuFiles className="h-3.5 w-3.5" />, action: () => navigate('/documents') },
      { id: 'upload', label: 'Upload documents', group: 'Navigate', icon: <LuUpload className="h-3.5 w-3.5" />, action: () => navigate('/upload') },
      { id: 'dashboard', label: 'Go to Dashboard', group: 'Navigate', icon: <LuLayoutDashboard className="h-3.5 w-3.5" />, action: () => navigate('/dashboard') },
      { id: 'settings', label: 'Open Settings', group: 'Navigate', icon: <LuSettings className="h-3.5 w-3.5" />, action: () => navigate('/settings') },
      { id: 'about', label: 'About InsightForge AI', group: 'Navigate', icon: <LuInfo className="h-3.5 w-3.5" />, action: () => navigate('/about') },
    ],
    [navigate, newConversation],
  )

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  function run(cmd: Command) {
    cmd.action()
    setOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-light bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <LuSearch className="h-4 w-4 text-text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && <p className="px-3 py-6 text-center text-xs text-text-muted">No matching commands</p>}
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => run(cmd)}
                  className="focus-ring group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-light transition-colors hover:bg-white/5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-text-muted group-hover:text-primary">
                    {cmd.icon}
                  </span>
                  {cmd.label}
                  <LuCornerDownLeft className="ml-auto h-3 w-3 text-text-muted opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
