import { motion, AnimatePresence } from 'framer-motion'
import { LuLayers, LuGauge, LuClock, LuHash, LuActivity, LuInfo } from 'react-icons/lu'
import type { ChatMessage } from '@/types'
import { formatMs, formatPercent, formatNumber } from '@/utils/format'
import { useSystemStore } from '@/store/systemStore'

export function RightPanel({ message }: { message: ChatMessage | null }) {
  const { embeddingModel, llmModel } = useSystemStore()

  return (
    <aside className="hidden h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-border bg-bg-elevated xl:flex">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <LuLayers className="h-4 w-4 text-secondary" />
        <h2 className="text-sm font-semibold text-text">Retrieval Context</h2>
      </div>

      <AnimatePresence mode="wait">
        {!message ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <LuInfo className="h-6 w-6 text-text-muted" />
            <p className="text-xs text-text-muted">
              Ask a question to see retrieved chunks, similarity scores, and execution details here.
            </p>
          </motion.div>
        ) : (
          <motion.div key={message.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col gap-5 p-4">
            {/* Confidence + timing */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard icon={<LuGauge className="h-3.5 w-3.5 text-success" />} label="Confidence" value={message.confidence ? formatPercent(message.confidence) : '—'} />
              <MetricCard icon={<LuClock className="h-3.5 w-3.5 text-secondary" />} label="Gen. Time" value={message.generationTimeMs ? formatMs(message.generationTimeMs) : '—'} />
            </div>

            {/* Retrieved chunks */}
            <section>
              <SectionLabel>Retrieved Chunks ({message.retrievedChunks?.length ?? 0})</SectionLabel>
              <div className="mt-2 space-y-2">
                {message.retrievedChunks?.map((chunk) => (
                  <div key={chunk.id} className="rounded-lg border border-border bg-card p-2.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-text-light">
                        Chunk #{chunk.chunkIndex}
                        {chunk.page && <span className="text-text-muted"> · p.{chunk.page}</span>}
                      </span>
                      {chunk.similarity !== undefined && <SimilarityBar value={chunk.similarity} />}
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted">{chunk.text}</p>
                  </div>
                ))}
                {!message.retrievedChunks?.length && <EmptyRow />}
              </div>
            </section>

            {/* Token usage */}
            <section>
              <SectionLabel>Token Usage</SectionLabel>
              <div className="mt-2 rounded-lg border border-border bg-card p-3">
                <TokenBar prompt={message.tokenUsage?.prompt ?? 0} completion={message.tokenUsage?.completion ?? 0} />
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Prompt: {formatNumber(message.tokenUsage?.prompt ?? 0)}</span>
                  <span>Completion: {formatNumber(message.tokenUsage?.completion ?? 0)}</span>
                </div>
              </div>
            </section>

            {/* LLM info */}
            <section>
              <SectionLabel>Model Info</SectionLabel>
              <div className="mt-2 space-y-1.5 rounded-lg border border-border bg-card p-3 text-[11px]">
                <InfoRow label="LLM" value={llmModel} />
                <InfoRow label="Embedding model" value={embeddingModel} />
                <InfoRow label="Sources cited" value={String(message.sources?.length ?? 0)} />
              </div>
            </section>

            {/* Execution timeline */}
            <section>
              <SectionLabel>Execution Timeline</SectionLabel>
              <div className="mt-2 space-y-3 rounded-lg border border-border bg-card p-3">
                <TimelineStep icon={<LuHash className="h-3 w-3" />} label="Query embedded" ms={42} />
                <TimelineStep icon={<LuLayers className="h-3 w-3" />} label="Vector search (top-k)" ms={186} />
                <TimelineStep
                  icon={<LuActivity className="h-3 w-3" />}
                  label="LLM generation"
                  ms={message.generationTimeMs ? message.generationTimeMs - 228 : 900}
                  last
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1 flex items-center gap-1.5 text-text-muted">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-lg font-semibold text-text">{value}</span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{children}</h3>
}

function SimilarityBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full gradient-primary"
        />
      </div>
      <span className="text-[10px] font-medium text-text-muted">{formatPercent(value)}</span>
    </div>
  )
}

function TokenBar({ prompt, completion }: { prompt: number; completion: number }) {
  const total = prompt + completion || 1
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
      <div className="h-full bg-primary" style={{ width: `${(prompt / total) * 100}%` }} />
      <div className="h-full bg-secondary" style={{ width: `${(completion / total) * 100}%` }} />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className="font-mono text-text-light">{value}</span>
    </div>
  )
}

function TimelineStep({ icon, label, ms, last }: { icon: React.ReactNode; label: string; ms: number; last?: boolean }) {
  return (
    <div className="relative flex items-start gap-2.5">
      {!last && <span className="absolute left-[9px] top-5 h-full w-px bg-border" />}
      <span className="z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </span>
      <div className="flex flex-1 items-center justify-between pb-1">
        <span className="text-[11px] text-text-light">{label}</span>
        <span className="text-[11px] font-mono text-text-muted">{formatMs(ms)}</span>
      </div>
    </div>
  )
}

function EmptyRow() {
  return <p className="text-[11px] text-text-muted">No chunks retrieved for this message.</p>
}
