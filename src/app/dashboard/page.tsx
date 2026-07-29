import { Video, Play, BarChart, RefreshCw, Loader2 } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { AutoRefresh } from '@/components/dashboard/AutoRefresh'
import { SyncForm } from '@/components/dashboard/SyncForm'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id || 'fallback-user-id'

  const videos = await prisma.video.findMany({
    where: { userId },
    include: { analysis: true },
    orderBy: { createdAt: 'desc' },
    take: 6
  })

  // Checa se há alguma análise rodando no background. Se houver, a página será auto-recarregada (Polling)
  const hasPendingAnalysis = videos.some((v: any) => v.analysis?.status === 'PENDING')

  const totalVideos = videos.length
  const totalComments = await prisma.comment.count({
    where: { video: { userId } }
  })

  // Analyze action (Server Action)
  async function analyzeVideo(formData: FormData) {
    'use server'
    const videoId = formData.get('youtubeId') as string
    if (!videoId) return

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const headersList = await headers()

    await fetch(`${appUrl}/api/videos/${videoId}/analyze`, {
      method: 'POST',
      headers: {
        'Cookie': headersList.get('cookie') || ''
      }
    })
    
    revalidatePath('/dashboard')
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Se houver análises pendentes, ativa o Polling a cada 3 segundos */}
      {hasPendingAnalysis && <AutoRefresh intervalMs={3000} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Visão Geral</h1>
          <p className="text-slate-400">Gerencie seus vídeos e analise os comentários.</p>
        </div>
        
        <SyncForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Total de Vídeos</div>
          <div className="text-4xl font-bold">{totalVideos}</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Comentários Sincronizados</div>
          <div className="text-4xl font-bold">{totalComments}</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-slate-400 text-sm mb-1">Inteligência</div>
          <div className="text-4xl font-bold text-emerald-400">Ativa</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Video className="w-5 h-5 text-violet-400" />
          Vídeos Recentes
        </h2>
        <Link href="/dashboard/videos" className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
          Ver todos os vídeos
        </Link>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Vídeo</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium">Status da IA</th>
              <th className="px-6 py-4 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {videos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  Nenhum vídeo sincronizado ainda. Cole um ID do YouTube acima!
                </td>
              </tr>
            )}
            {videos.map((v: any) => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                  {v.thumbnail && <img src={v.thumbnail} alt="thumb" className="w-12 h-8 object-cover rounded" />}
                  <span className="truncate max-w-[200px] md:max-w-xs">{v.title}</span>
                </td>
                <td className="px-6 py-4 text-slate-400">{v.createdAt.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {!v.analysis && <span className="text-slate-500">Aguardando</span>}
                  {v.analysis?.status === 'PENDING' && (
                    <span className="text-yellow-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Analisando...</span>
                  )}
                  {v.analysis?.status === 'ERROR' && <span className="text-red-400">Erro na Análise</span>}
                  {v.analysis?.status === 'COMPLETED' && <span className="text-emerald-400">Concluído</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  {v.analysis?.status === 'COMPLETED' ? (
                    <Link href={`/dashboard/${v.youtubeId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors">
                      <BarChart className="w-4 h-4" />
                      Relatório
                    </Link>
                  ) : (
                    <form action={analyzeVideo} className="inline">
                      <input type="hidden" name="youtubeId" value={v.youtubeId} />
                      <button disabled={v.analysis?.status === 'PENDING'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 font-medium transition-colors disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${v.analysis?.status === 'PENDING' ? 'animate-spin' : ''}`} />
                        Analisar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
