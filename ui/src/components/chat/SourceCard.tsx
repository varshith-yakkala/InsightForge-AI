import { motion } from 'framer-motion'
import type { SourceCitation } from '@/types'
import { FileTypeIcon } from '@/components/common/FileTypeIcon'
import { formatPercent } from '@/utils/format'

export function SourceCard({ source, index, onOpen }: { source: SourceCitation; index: number; onOpen: (s: SourceCitation) => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onOpen(source)}
      className="focus-ring group flex w-56 shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/40 hover:bg-card-hover"
    >
      <div className="flex items-center gap-2">
        <FileTypeIcon type={source.fileType} className="h-7 w-7" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-text">{source.filename}</p>
          <p className="text-[10px] text-text-muted">
            {source.page ? `Page ${source.page} · ` : ''}Chunk #{source.chunkIndex}
          </p>
        </div>
      </div>
      <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted">{source.preview}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-secondary">{formatPercent(source.similarity)} match</span>
        <span className="text-[10px] text-primary opacity-0 transition-opacity group-hover:opacity-100">Preview →</span>
      </div>
    </motion.button>
  )
}
