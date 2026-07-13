import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuPlus,
  LuSearch,
  LuFiles,
  LuPin,
  LuTrash2,
  LuSettings,
  LuInfo,
  LuSun,
  LuMoon,
  LuLayoutDashboard,
  LuMessageSquare,
} from 'react-icons/lu'
import { cn } from '@/utils/cn'
import { formatRelativeTime, formatBytes } from '@/utils/format'
import { useChatStore } from '@/store/chatStore'
import { useDocumentsStore } from '@/store/documentsStore'
import { useSettingsStore } from '@/store/settingsStore'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const { conversations, activeConversationId, setActiveConversation, newConversation, togglePin, deleteConversation } =
    useChatStore()
  const documents = useDocumentsStore((s) => s.documents)
  const { theme, update } = useSettingsStore()

  const totalStorage = documents.reduce((sum, d) => sum + d.sizeBytes, 0)
  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
  const pinned = filtered.filter((c) => c.pinned)
  const recent = filtered.filter((c) => !c.pinned)

  function handleNewChat() {
    newConversation()
    navigate('/')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className="relative z-20 flex h-full shrink-0 flex-col border-r border-border bg-bg-elevated"
    >
      {/* Logo row */}
      <div className={cn('flex items-center gap-2.5 px-4 py-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary shadow-lg shadow-primary/30">
          <span className="text-sm font-bold text-white">IF</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-tight"
            >
              InsightForge <span className="gradient-text">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="focus-ring ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/5 hover:text-text"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <LuPanelLeftOpen className="h-4 w-4" /> : <LuPanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-3">
        <button
          onClick={handleNewChat}
          className={cn(
            'focus-ring group flex w-full items-center gap-2 rounded-lg border border-border-light bg-card px-3 py-2.5 text-sm font-medium text-text transition-all hover:border-primary/50 hover:bg-card-hover',
            collapsed && 'justify-center px-0',
          )}
        >
          <LuPlus className="h-4 w-4 text-primary transition-transform group-hover:rotate-90" />
          {!collapsed && 'New Chat'}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-3 px-3">
          <div className="relative">
            <LuSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="focus-ring w-full rounded-lg border border-border bg-bg py-2 pl-8 pr-2 text-xs text-text placeholder:text-text-muted"
            />
          </div>
        </div>
      )}

      {/* Documents summary */}
      <div className="mt-4 px-3">
        <Link
          to="/documents"
          className={cn(
            'focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/5',
            location.pathname === '/documents' ? 'bg-white/[0.06] text-text' : 'text-text-light',
            collapsed && 'justify-center',
          )}
        >
          <LuFiles className="h-4 w-4 shrink-0 text-secondary" />
          {!collapsed && (
            <span className="flex flex-1 items-center justify-between">
              <span>Documents</span>
              <span className="text-xs text-text-muted">{documents.length}</span>
            </span>
          )}
        </Link>
        {!collapsed && (
          <div className="mt-1.5 px-2.5 text-[11px] text-text-muted">
            {formatBytes(totalStorage)} indexed across {documents.length} files
          </div>
        )}
      </div>

      <div className="mt-2 px-3">
        <Link
          to="/dashboard"
          className={cn(
            'focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/5',
            location.pathname === '/dashboard' ? 'bg-white/[0.06] text-text' : 'text-text-light',
            collapsed && 'justify-center',
          )}
        >
          <LuLayoutDashboard className="h-4 w-4 shrink-0 text-secondary" />
          {!collapsed && 'Dashboard'}
        </Link>
      </div>

      {/* Conversations */}
      {!collapsed && (
        <div className="mt-4 flex-1 overflow-y-auto px-3 pb-2">
          {pinned.length > 0 && (
            <ConversationGroup
              label="Pinned"
              items={pinned}
              activeId={activeConversationId}
              onSelect={(id) => {
                setActiveConversation(id)
                navigate('/')
              }}
              onPin={togglePin}
              onDelete={deleteConversation}
            />
          )}
          <ConversationGroup
            label="Recent"
            items={recent}
            activeId={activeConversationId}
            onSelect={(id) => {
              setActiveConversation(id)
              navigate('/')
            }}
            onPin={togglePin}
            onDelete={deleteConversation}
          />
        </div>
      )}
      {collapsed && <div className="flex-1" />}

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className={cn('flex items-center gap-1', collapsed && 'flex-col')}>
          <FooterIcon
            icon={<LuSettings className="h-4 w-4" />}
            label="Settings"
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
          />
          <FooterIcon
            icon={theme === 'dark' ? <LuMoon className="h-4 w-4" /> : <LuSun className="h-4 w-4" />}
            label="Theme"
            onClick={() => update({ theme: theme === 'dark' ? 'light' : 'dark' })}
          />
          <FooterIcon icon={<LuInfo className="h-4 w-4" />} label="About" onClick={() => navigate('/about')} />
        </div>
        {!collapsed && (
          <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-text-muted">
            <span>InsightForge AI</span>
            <span className="font-mono">v2.4.1</span>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

function FooterIcon({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'focus-ring flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/5 hover:text-text',
        active && 'bg-white/[0.06] text-text',
      )}
    >
      {icon}
    </button>
  )
}

function ConversationGroup({
  label,
  items,
  activeId,
  onSelect,
  onPin,
  onDelete,
}: {
  label: string
  items: { id: string; title: string; updatedAt: string; pinned?: boolean }[]
  activeId: string | null
  onSelect: (id: string) => void
  onPin: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-3">
      <div className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">{label}</div>
      <div className="space-y-0.5">
        {items.map((c) => (
          <div
            key={c.id}
            className={cn(
              'group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors',
              activeId === c.id ? 'bg-white/[0.07] text-text' : 'text-text-light hover:bg-white/5',
            )}
          >
            <LuMessageSquare className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            <button onClick={() => onSelect(c.id)} className="focus-ring flex-1 truncate text-left">
              {c.title}
            </button>
            <div className="hidden items-center gap-0.5 group-hover:flex">
              <button
                onClick={() => onPin(c.id)}
                className="focus-ring flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-warning"
                aria-label="Pin conversation"
              >
                <LuPin className={cn('h-3 w-3', c.pinned && 'fill-current text-warning')} />
              </button>
              <button
                onClick={() => onDelete(c.id)}
                className="focus-ring flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-danger"
                aria-label="Delete conversation"
              >
                <LuTrash2 className="h-3 w-3" />
              </button>
            </div>
            <span className="shrink-0 text-[10px] text-text-muted group-hover:hidden">
              {formatRelativeTime(c.updatedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
