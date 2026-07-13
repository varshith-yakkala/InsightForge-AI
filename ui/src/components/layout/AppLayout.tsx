import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { CommandPalette } from '@/components/common/CommandPalette'

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <Outlet />
        </div>
        <MobileNav />
      </div>
      <CommandPalette />
    </div>
  )
}
