import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LuX, LuSearch, LuZoomIn, LuZoomOut, LuMaximize2, LuDownload } from 'react-icons/lu'
import type { SourceCitation } from '@/types'
import { FileTypeIcon } from '@/components/common/FileTypeIcon'
import { cn } from '@/utils/cn'

const filler = [
  'Introduction and executive summary outlining the scope of this document and its intended audience.',
  'This section covers methodology, data sources, and the assumptions used throughout the analysis.',
  'Key findings are summarized below, followed by a detailed breakdown across each relevant dimension.',
  'Recommendations and next steps are provided for stakeholders to review before the next planning cycle.',
]

export function DocumentPreviewModal({ source, onClose }: { source: SourceCitation | null; onClose: () => void }) {
  const [zoom, setZoom] = useState(100)
  const [search, setSearch] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <AnimatePresence>
      {source && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'flex w-full flex-col overflow-hidden rounded-2xl border border-border-light bg-card shadow-2xl',
              fullscreen ? 'h-full max-w-full' : 'h-[85vh] max-w-2xl',
            )}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <FileTypeIcon type={source.fileType} className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{source.filename}</p>
                <p className="text-[11px] text-text-muted">
                  {source.page ? `Page ${source.page} · ` : ''}Chunk #{source.chunkIndex} · {Math.round(source.similarity * 100)}% match
                </p>
              </div>
              <button onClick={() => setZoom((z) => Math.max(60, z - 10))} className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text">
                <LuZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="w-9 text-center text-[11px] text-text-muted">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(180, z + 10))} className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text">
                <LuZoomIn className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setFullscreen((f) => !f)} className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text">
                <LuMaximize2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={onClose} className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-white/5 hover:text-text">
                <LuX className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-border px-4 py-2">
              <div className="relative">
                <LuSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search within document..."
                  className="focus-ring w-full rounded-lg border border-border bg-bg py-1.5 pl-8 pr-2 text-xs text-text placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-bg p-6" style={{ fontSize: `${zoom}%` }}>
              <div className="mx-auto max-w-lg space-y-4 text-[13px] leading-relaxed text-text-light">
                {filler.map((p, i) => (
                  <p key={i} className={i === 1 ? 'rounded-md bg-primary/15 p-3 ring-1 ring-primary/40' : ''}>
                    {highlight(i === 1 ? source.preview : p, search)}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
              <span className="text-[11px] text-text-muted">Highlighted section is the retrieved chunk used in this answer.</span>
              <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] text-text-light hover:border-border-light hover:text-text">
                <LuDownload className="h-3 w-3" />
                Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function highlight(text: string, term: string) {
  if (!term.trim()) return text
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={i} className="rounded bg-warning/40 px-0.5 text-text">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
