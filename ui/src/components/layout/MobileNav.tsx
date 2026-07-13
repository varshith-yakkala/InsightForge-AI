import { NavLink } from 'react-router-dom'
import { LuMessageSquare, LuFiles, LuUpload, LuLayoutDashboard, LuSettings } from 'react-icons/lu'
import { cn } from '@/utils/cn'

const items = [
  { to: '/', icon: LuMessageSquare, label: 'Chat' },
  { to: '/documents', icon: LuFiles, label: 'Docs' },
  { to: '/upload', icon: LuUpload, label: 'Upload' },
  { to: '/dashboard', icon: LuLayoutDashboard, label: 'Stats' },
  { to: '/settings', icon: LuSettings, label: 'Settings' },
]

export function MobileNav() {
  return (
    <nav className="flex h-14 shrink-0 items-center justify-around border-t border-border bg-bg-elevated md:hidden">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'focus-ring flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] transition-colors',
              isActive ? 'text-primary' : 'text-text-muted',
            )
          }
        >
          <Icon className="h-[18px] w-[18px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
