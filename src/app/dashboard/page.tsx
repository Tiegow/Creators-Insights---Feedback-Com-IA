import { Video, Play, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  // Futuramente, esses dados virão do banco de dados (Prisma)
  const videos = [
    { id: '1', title: 'Como aprender React em 2026', views: '15.4K', date: '2 dias atrás' },
    { id: '2', title: 'O que ninguem te conta sobre Inteligência Artificial', views: '42.1K', date: '1 semana atrás' },
    { id: '3', title: 'Setup completo do meu Home Office', views: '102K', date: '1 mês atrás' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Visão Geral</h1>
          <p className="text-slate-400">Gerencie seus vídeos e analise os comentários.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all shadow-[0_0_20px_4px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_6px_rgba(139,92,246,0.3)] hover:scale-105">
          <Play className="w-5 h-5" />
          Sincronizar Canal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Total de Vídeos</div>
          <div className="text-4xl font-bold">24</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Comentários Analisados</div>
          <div className="text-4xl font-bold">12.5K</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Sentimento Geral</div>
          <div className="text-4xl font-bold text-emerald-400">Positivo</div>
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
        <Video className="w-5 h-5 text-violet-400" />
        Vídeos Recentes
      </h2>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Vídeo</th>
              <th className="px-6 py-4 font-medium">Visualizações</th>
              <th className="px-6 py-4 font-medium">Publicado em</th>
              <th className="px-6 py-4 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {videos.map(v => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">{v.title}</td>
                <td className="px-6 py-4 text-slate-400">{v.views}</td>
                <td className="px-6 py-4 text-slate-400">{v.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 font-medium transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
