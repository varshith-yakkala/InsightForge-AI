import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuBell, LuSettings, LuCpu, LuSparkles, LuPanelRightClose, LuPanelRightOpen } from 'react-icons/lu'
import { cn } from '@/utils/cn'
import { useSystemStore } from '@/store/systemStore'
import { useSettingsStore } from '@/store/settingsStore'

export function Navbar({
  title,
  rightPanelOpen,
  onToggleRightPanel,
}: {
  title: string
  rightPanelOpen?: boolean
  onToggleRightPanel?: () => void
}) {
  const navigate = useNavigate()
  const { backend, embeddingModel, llmModel, refresh } = useSystemStore()
  const backendUrl = useSettingsStore((s) => s.backendUrl)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    refresh(backendUrl)
    const interval = setInterval(() => refresh(backendUrl), 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl])

  const statusConfig = {
    online: { color: 'bg-success', label: 'Connected', text: 'text-success' },
    offline: { color: 'bg-warning', label: 'Demo mode', text: 'text-warning' },
    connecting: { color: 'bg-text-muted', label: 'Connecting...', text: 'text-text-muted' },
  }[backend]

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg-elevated/80 px-4 backdrop-blur-md">
      <h1 className="truncate text-sm font-semibold text-text">{title}</h1>

      <div className="ml-2 hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 md:flex">
        <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig.color, backend === 'connecting' && 'animate-pulse-soft')} />
        <span className={cn('text-[11px] font-medium', statusConfig.text)}>{statusConfig.label}</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 lg:flex">
          <div className="flex items-center gap-1.5 text-[11px] text-text-light">
            <LuCpu className="h-3 w-3 text-secondary" />
            <span className="font-mono">{embeddingModel}</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-[11px] text-text-light">
            <LuSparkles className="h-3 w-3 text-primary" />
            <span className="font-mono">{llmModel}</span>
          </div>
        </div>

        {onToggleRightPanel && (
          <button
            onClick={onToggleRightPanel}
            title="Toggle context panel"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text"
          >
            {rightPanelOpen ? <LuPanelRightClose className="h-4 w-4" /> : <LuPanelRightOpen className="h-4 w-4" />}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text"
            aria-label="Notifications"
          >
            <LuBell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 z-30 w-72 rounded-xl border border-border bg-card p-1 shadow-2xl shadow-black/40">
              <div className="px-3 py-2 text-xs font-semibold text-text">Notifications</div>
              <div className="space-y-0.5">
                <NotifItem text="security_compliance_policy.pdf finished embedding" time="12m ago" />
                <NotifItem text="engineering_postmortem_notes.txt failed to index" time="3h ago" danger />
                <NotifItem text="Weekly usage report is ready" time="1d ago" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-text"
          aria-label="Settings"
        >
          <LuSettings className="h-4 w-4" />
        </button>

        <button className="focus-ring ml-1 flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-white">
          RK
        </button>
      </div>
    </header>
  )
}

function NotifItem({ text, time, danger }: { text: string; time: string; danger?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs hover:bg-white/5">
      <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', danger ? 'bg-danger' : 'bg-secondary')} />
      <div>
        <p className="text-text-light">{text}</p>
        <p className="mt-0.5 text-[10px] text-text-muted">{time}</p>
      </div>
    </div>
  )
}
