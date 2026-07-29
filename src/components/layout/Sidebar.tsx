import { LogOut } from 'lucide-react'
import { signOut } from '@/auth'
import { SidebarLinks } from './SidebarLinks'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-md hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-bold text-lg text-white tracking-tight">Creators Insights</span>
      </div>
      <SidebarLinks />
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
