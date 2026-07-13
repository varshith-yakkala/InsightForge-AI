import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { LuCloudUpload, LuCheck, LuX, LuFileText } from 'react-icons/lu'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { useDocumentsStore } from '@/store/documentsStore'
import { useSettingsStore } from '@/store/settingsStore'
import { formatBytes } from '@/utils/format'
import { cn } from '@/utils/cn'

interface UploadItem {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
}

export function UploadPage() {
  const { upload } = useDocumentsStore()
  const backendUrl = useSettingsStore((s) => s.backendUrl)
  const [items, setItems] = useState<UploadItem[]>([])

  const onDrop = useCallback(
    (accepted: File[], rejected: { file: File }[]) => {
      if (rejected.length > 0) {
        toast.error(`${rejected.length} file(s) rejected — unsupported type`)
      }
      if (accepted.length === 0) return

      const newItems: UploadItem[] = accepted.map((file) => ({ file, progress: 0, status: 'uploading' }))
      setItems((prev) => [...newItems, ...prev])

      accepted.forEach(async (file) => {
        try {
          await upload(backendUrl, [file])
          setItems((prev) =>
            prev.map((it) => (it.file === file ? { ...it, progress: 100, status: 'success' } : it)),
          )
          toast.success(`${file.name} indexed successfully`)
        } catch {
          setItems((prev) => prev.map((it) => (it.file === file ? { ...it, status: 'error' } : it)))
          toast.error(`Failed to process ${file.name}`)
        }
      })

      // Reflect live per-file progress from the store
      const poll = setInterval(() => {
        const uploading = useDocumentsStore.getState().uploading
        setItems((prev) =>
          prev.map((it) => {
            const match = uploading.find((u) => u.file === it.file)
            return match && it.status === 'uploading' ? { ...it, progress: match.progress } : it
          }),
        )
        if (uploading.length === 0) clearInterval(poll)
      }, 150)
    },
    [upload, backendUrl],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: true,
  })

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Navbar title="Upload Documents" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-text">Add to your knowledge base</h1>
            <p className="mt-1 text-xs text-text-muted">
              Upload PDF, TXT, or Markdown files. Documents are chunked, embedded, and indexed automatically.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              'focus-ring relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors',
              isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-border-light',
            )}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={isDragActive ? { y: [-4, 4, -4] } : { y: [0, -6, 0] }}
              transition={{ duration: isDragActive ? 0.8 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-xl shadow-primary/30"
            >
              <LuCloudUpload className="h-7 w-7 text-white" />
            </motion.div>
            <p className="text-sm font-medium text-text">
              {isDragActive ? 'Drop your files here' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="mt-1.5 text-xs text-text-muted">Supports PDF, TXT, and Markdown · multiple files at once</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-text-muted">
              <span className="rounded-full border border-border px-2 py-0.5">.pdf</span>
              <span className="rounded-full border border-border px-2 py-0.5">.txt</span>
              <span className="rounded-full border border-border px-2 py-0.5">.md</span>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                Processing ({items.length})
              </p>
              <AnimatePresence>
                {items.map((item, idx) => (
                  <UploadRow key={`${item.file.name}-${idx}`} item={item} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UploadRow({ item }: { item: UploadItem }) {
  const estSeconds = Math.max(1, Math.round(item.file.size / 500_000))
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <LuFileText className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-text">{item.file.name}</p>
          <span className="shrink-0 text-[10px] text-text-muted">{formatBytes(item.file.size)}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className={cn('h-full rounded-full', item.status === 'error' ? 'bg-danger' : 'gradient-primary')}
              animate={{ width: `${item.progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-[10px] text-text-muted">
            {item.status === 'uploading' ? `${item.progress}%` : ''}
          </span>
        </div>
        {item.status === 'uploading' && (
          <p className="mt-1 text-[10px] text-text-muted">Est. {estSeconds}s remaining</p>
        )}
      </div>
      <AnimatePresence mode="wait">
        {item.status === 'success' && (
          <motion.span
            key="ok"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
          >
            <LuCheck className="h-3.5 w-3.5" />
          </motion.span>
        )}
        {item.status === 'error' && (
          <motion.span
            key="err"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger"
          >
            <LuX className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
