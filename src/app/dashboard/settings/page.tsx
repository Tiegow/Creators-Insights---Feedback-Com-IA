import { auth, signOut } from '@/auth'
import { LogOut, Settings, User } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-400" />
            Configurações
          </h1>
          <p className="text-slate-400">Gerencie sua conta e preferências do sistema.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-fuchsia-400" />
          Dados da Conta
        </h2>

        <div className="space-y-4 mb-10">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome</label>
            <div className="text-slate-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">{session.user?.name || 'Não informado'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">E-mail</label>
            <div className="text-slate-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">{session.user?.email || 'Não informado'}</div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <h2 className="text-xl font-semibold mb-2 text-rose-400">Logout</h2>
          <p className="text-slate-400 text-sm mb-6">Encerrar sua sessão no dispositivo atual.</p>
          
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20">
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
