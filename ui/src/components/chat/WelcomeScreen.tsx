import { motion } from 'framer-motion'
import { LuSparkles, LuFileText, LuSearch, LuLayoutDashboard, LuUpload } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { suggestedPrompts } from '@/data/mockData'
import { useDocumentsStore } from '@/store/documentsStore'
import { formatRelativeTime } from '@/utils/format'
import { FileTypeIcon } from '@/components/common/FileTypeIcon'

export function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  const navigate = useNavigate()
  const recentDocs = useDocumentsStore((s) => s.documents).slice(0, 3)

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-2xl shadow-primary/30"
      >
        <motion.div
          className="absolute inset-0 rounded-2xl gradient-primary"
          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <LuSparkles className="h-7 w-7 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center text-2xl font-semibold tracking-tight text-text"
      >
        Ask InsightForge <span className="gradient-text">AI</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 text-center text-sm text-text-muted"
      >
        Grounded answers from your indexed documents, with full source citations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPrompt(prompt)}
            className="focus-ring group rounded-xl border border-border bg-card px-4 py-3 text-left text-[13px] text-text-light transition-all hover:border-primary/40 hover:bg-card-hover"
          >
            {prompt}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="mt-8 w-full"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Recent documents</span>
          <button onClick={() => navigate('/documents')} className="focus-ring text-[11px] text-primary hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-1.5">
          {recentDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2">
              <FileTypeIcon type={doc.fileType} className="h-7 w-7" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-text-light">{doc.filename}</p>
                <p className="text-[10px] text-text-muted">{formatRelativeTime(doc.uploadedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 flex items-center gap-2"
      >
        <QuickAction icon={<LuUpload className="h-3.5 w-3.5" />} label="Upload" onClick={() => navigate('/upload')} />
        <QuickAction icon={<LuFileText className="h-3.5 w-3.5" />} label="Documents" onClick={() => navigate('/documents')} />
        <QuickAction icon={<LuLayoutDashboard className="h-3.5 w-3.5" />} label="Dashboard" onClick={() => navigate('/dashboard')} />
        <QuickAction icon={<LuSearch className="h-3.5 w-3.5" />} label="Search" onClick={() => navigate('/documents')} />
      </motion.div>
    </div>
  )
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="focus-ring flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-text-light transition-colors hover:border-border-light hover:text-text"
    >
      {icon}
      {label}
    </button>
  )
}
