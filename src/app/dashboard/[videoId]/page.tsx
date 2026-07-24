import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { SentimentChart, CategoriesChart } from '@/components/dashboard/Charts'

export default async function VideoReportPage({ params }: { params: Promise<{ videoId: string }> }) {
  const session = await auth()
  // if (!session) redirect('/')

  const { videoId } = await params

  const video = await prisma.video.findUnique({
    where: { youtubeId: videoId },
    include: { analysis: true, comments: { take: 30 } }
  })

  if (!video || !video.analysis) {
    redirect('/dashboard')
  }

  const { sentimentPositive, sentimentNeutral, sentimentNegative, suggestionCount, questionCount, problemCount } = video.analysis

  const sentimentData = [
    { name: 'Positivo', value: sentimentPositive },
    { name: 'Neutro', value: sentimentNeutral },
    { name: 'Negativo', value: sentimentNegative },
  ]

  const categoriesData = [
    { name: 'Sugestões', value: suggestionCount },
    { name: 'Dúvidas', value: questionCount },
    { name: 'Problemas', value: problemCount },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Visão Geral
      </Link>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
        {video.thumbnail && <img src={video.thumbnail} alt={video.title} className="w-full md:w-64 rounded-xl shadow-lg border border-white/10" />}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{video.title}</h1>
          <p className="text-slate-400 mb-4">Relatório de Inteligência extraído dos comentários.</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Análise Concluída
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold mb-6 text-slate-200">Distribuição de Sentimento</h3>
          <SentimentChart data={sentimentData} />
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Positivo</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div>Neutro</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>Negativo</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold mb-6 text-slate-200">Categorização de Intenção</h3>
          <CategoriesChart data={categoriesData} />
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-violet-400" />
        Destaques (Comentários Brutos)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {video.comments.map(c => (
          <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {c.authorProfileImageUrl && <img src={c.authorProfileImageUrl} alt="autor" className="w-8 h-8 rounded-full" />}
              <span className="font-medium text-sm text-slate-300">{c.authorName}</span>
            </div>
            <p className="text-slate-200 text-sm">{c.text}</p>
          </div>
        ))}
        {video.comments.length === 0 && (
          <p className="text-slate-400">Nenhum comentário registrado.</p>
        )}
      </div>
    </div>
  )
}
