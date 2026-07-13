import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LuSearch, LuTrash2, LuStar, LuUpload, LuFilter } from 'react-icons/lu'
import { Navbar } from '@/components/layout/Navbar'
import { FileTypeIcon, fileTypeConfig } from '@/components/common/FileTypeIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useDocumentsStore } from '@/store/documentsStore'
import { formatBytes, formatRelativeTime } from '@/utils/format'
import type { FileKind, IndexStatus } from '@/types'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

const typeFilters: (FileKind | 'all')[] = ['all', 'pdf', 'txt', 'md']

const statusStyles: Record<IndexStatus, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  indexed: { variant: 'success', label: 'Indexed' },
  embedding: { variant: 'warning', label: 'Embedding' },
  chunking: { variant: 'warning', label: 'Chunking' },
  queued: { variant: 'default', label: 'Queued' },
  failed: { variant: 'danger', label: 'Failed' },
}

export function DocumentsPage() {
  const navigate = useNavigate()
  const { documents, removeDocument, toggleFavorite } = useDocumentsStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<FileKind | 'all'>('all')
  const [favOnly, setFavOnly] = useState(false)

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (typeFilter !== 'all' && d.fileType !== typeFilter) return false
      if (favOnly && !d.favorite) return false
      if (search && !d.filename.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [documents, search, typeFilter, favOnly])

  const totalStorage = documents.reduce((sum, d) => sum + d.sizeBytes, 0)
  const totalChunks = documents.reduce((sum, d) => sum + d.chunks, 0)

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Navbar title="Documents" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-text">Knowledge Base</h1>
              <p className="mt-0.5 text-xs text-text-muted">
                {documents.length} documents · {totalChunks} chunks · {formatBytes(totalStorage)} indexed
              </p>
            </div>
            <Button icon={<LuUpload className="h-3.5 w-3.5" />} onClick={() => navigate('/upload')}>
              Upload documents
            </Button>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="focus-ring w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-xs text-text placeholder:text-text-muted"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'focus-ring rounded-md px-2.5 py-1.5 text-[11px] font-medium uppercase transition-colors',
                    typeFilter === t ? 'gradient-primary text-white' : 'text-text-muted hover:text-text',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFavOnly((f) => !f)}
              className={cn(
                'focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px] transition-colors',
                favOnly ? 'text-warning' : 'text-text-muted hover:text-text',
              )}
            >
              <LuStar className={cn('h-3.5 w-3.5', favOnly && 'fill-current')} />
              Favorites
            </button>
            <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-text-muted hover:text-text">
              <LuFilter className="h-3.5 w-3.5" />
              More filters
            </button>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onUpload={() => navigate('/upload')} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filtered.map((doc) => {
                  const status = statusStyles[doc.embeddingStatus]
                  const typeConf = fileTypeConfig(doc.fileType)
                  return (
                    <motion.div
                      layout
                      key={doc.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -2 }}
                      className={cn(
                        'group relative overflow-hidden rounded-xl border bg-card p-4 transition-colors',
                        'border-border hover:border-border-light',
                      )}
                    >
                      <div className={cn('absolute inset-x-0 top-0 h-0.5', typeConf.bg.replace('/10', ''))} />
                      <div className="flex items-start gap-3">
                        <FileTypeIcon type={doc.fileType} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text" title={doc.filename}>
                            {doc.filename}
                          </p>
                          <p className="mt-0.5 text-[11px] text-text-muted">
                            {formatBytes(doc.sizeBytes)} · {formatRelativeTime(doc.uploadedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(doc.id)}
                          className="focus-ring flex h-6 w-6 items-center justify-center rounded text-text-muted opacity-0 transition-opacity hover:text-warning group-hover:opacity-100"
                        >
                          <LuStar className={cn('h-3.5 w-3.5', doc.favorite && 'fill-current text-warning opacity-100')} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Badge variant={status.variant} dot>
                          {status.label}
                        </Badge>
                        <Badge>{doc.chunks} chunks</Badge>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-[10px] text-text-muted">ID: {doc.id}</span>
                        <button
                          onClick={() => {
                            removeDocument(doc.id)
                            toast.success(`Deleted ${doc.filename}`)
                          }}
                          className="focus-ring flex h-6 w-6 items-center justify-center rounded text-text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                          aria-label="Delete document"
                        >
                          <LuTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <LuSearch className="h-8 w-8 text-text-muted" />
      <p className="mt-3 text-sm text-text-light">No documents match your filters</p>
      <p className="mt-1 text-xs text-text-muted">Try a different search term, or upload a new document.</p>
      <Button className="mt-4" size="sm" onClick={onUpload} icon={<LuUpload className="h-3.5 w-3.5" />}>
        Upload documents
      </Button>
    </div>
  )
}
