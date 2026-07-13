import { FiFileText } from 'react-icons/fi'
import { LuFileText, LuFile } from 'react-icons/lu'
import type { FileKind } from '@/types'
import { cn } from '@/utils/cn'

const config: Record<FileKind, { label: string; color: string; bg: string; icon: typeof LuFile }> = {
  pdf: { label: 'PDF', color: 'text-danger', bg: 'bg-danger/10', icon: LuFile },
  txt: { label: 'TXT', color: 'text-secondary', bg: 'bg-secondary/10', icon: FiFileText },
  md: { label: 'MD', color: 'text-primary', bg: 'bg-primary/10', icon: LuFileText },
}

export function fileTypeConfig(type: FileKind) {
  return config[type]
}

export function FileTypeIcon({ type, className }: { type: FileKind; className?: string }) {
  const { color, bg, icon: Icon } = config[type]
  return (
    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', bg, className)}>
      <Icon className={cn('h-4 w-4', color)} />
    </div>
  )
}
