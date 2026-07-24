import Link from 'next/link'
import { LayoutDashboard, Video, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/auth'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-md hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-bold text-lg text-white tracking-tight">Creators Insights</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-violet-500/10 text-violet-400 font-medium hover:bg-violet-500/20 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/dashboard/videos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium hover:bg-white/5 hover:text-slate-200 transition-colors">
          <Video className="w-5 h-5" />
          Meus Vídeos
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium hover:bg-white/5 hover:text-slate-200 transition-colors">
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}>
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 font-medium hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
