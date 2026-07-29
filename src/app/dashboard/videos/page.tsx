import { Video, BarChart, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export default async function VideosPage() {
  const session = await auth()
  const userId = session?.user?.id || 'fallback-user-id'

  const videos = await prisma.video.findMany({
    where: { userId },
    include: { analysis: true },
    orderBy: { createdAt: 'desc' }
  })

  // Delete Action
  async function deleteVideo(formData: FormData) {
    'use server'
    const videoId = formData.get('videoId') as string
    if (!videoId) return
    
    // Deleta o video (Comentários e Análises são deletados em cascata pelo Prisma onDelete: Cascade)
    await prisma.video.delete({
      where: { id: videoId, userId }
    })
    
    revalidatePath('/dashboard/videos')
    revalidatePath('/dashboard')
  }

  // Analyze Action
  async function analyzeVideo(formData: FormData) {
    'use server'
    const youtubeId = formData.get('youtubeId') as string
    if (!youtubeId) return

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const headersList = await headers()

    await fetch(`${appUrl}/api/videos/${youtubeId}/analyze`, {
      method: 'POST',
      headers: {
        'Cookie': headersList.get('cookie') || ''
      }
    })
    
    revalidatePath('/dashboard/videos')
    revalidatePath('/dashboard')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Meus Vídeos</h1>
          <p className="text-slate-400">Gerencie todos os seus vídeos sincronizados.</p>
        </div>
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
                  Nenhum vídeo sincronizado ainda.
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
                  <div className="flex items-center justify-end gap-2">
                    {v.analysis?.status === 'COMPLETED' ? (
                      <Link href={`/dashboard/${v.youtubeId}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors">
                        <BarChart className="w-4 h-4" />
                        Relatório
                      </Link>
                    ) : (
                      <form action={analyzeVideo}>
                        <input type="hidden" name="youtubeId" value={v.youtubeId} />
                        <button disabled={v.analysis?.status === 'PENDING'} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 font-medium transition-colors disabled:opacity-50">
                          <RefreshCw className={`w-4 h-4 ${v.analysis?.status === 'PENDING' ? 'animate-spin' : ''}`} />
                          Analisar
                        </button>
                      </form>
                    )}
                    <form action={deleteVideo}>
                      <input type="hidden" name="videoId" value={v.id} />
                      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-medium transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
