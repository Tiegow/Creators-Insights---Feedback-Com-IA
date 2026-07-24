import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { Client } from '@upstash/qstash'

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const videoId = params.videoId

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    // 1. Verificar se o vídeo existe e pertence ao usuário
    const video = await prisma.video.findUnique({
      where: { youtubeId: videoId }
    })

    if (!video) {
      return NextResponse.json({ error: 'Vídeo não encontrado no sistema. Sincronize os comentários primeiro.' }, { status: 404 })
    }

    // 2. Marcar a Análise como PENDENTE no banco
    const analysis = await prisma.analysis.upsert({
      where: { videoId: video.id },
      update: { status: 'PENDING' },
      create: {
        videoId: video.id,
        status: 'PENDING',
      }
    })

    // 3. Enviar a tarefa para a fila do QStash
    const qstashToken = process.env.QSTASH_TOKEN
    
    if (!qstashToken) {
       console.warn("QSTASH_TOKEN ausente. Configure no .env para funcionar em produção.")
    } else {
       const client = new Client({ token: qstashToken })
       
       const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
       const webhookUrl = `${appUrl}/api/webhooks/analyze-video`

       await client.publishJSON({
         url: webhookUrl,
         body: {
           videoId: video.id, 
           youtubeId: video.youtubeId
         },
       })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Análise iniciada! O motor de IA está processando em background.',
      analysis
    })
    
  } catch (error: any) {
    console.error('Erro ao despachar análise:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
