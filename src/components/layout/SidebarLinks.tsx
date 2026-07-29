'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Video, Settings } from 'lucide-react'

export function SidebarLinks() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meus Vídeos', href: '/dashboard/videos', icon: Video },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <nav className="flex-1 p-4 space-y-2">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.href === '/dashboard' 
          ? pathname === '/dashboard'
          : pathname?.startsWith(link.href)

        return (
          <Link 
            key={link.name}
            href={link.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
