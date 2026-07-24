import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key is missing. Add it to .env' }, { status: 500 })
    }

    // 1. Buscar detalhes do vídeo para salvar no banco
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    )
    const videoData = await videoRes.json()

    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: 'Video not found on YouTube' }, { status: 404 })
    }

    const snippet = videoData.items[0].snippet

    // Usuário de fallback caso esteja testando sem logar
    const userId = session?.user?.id || 'fallback-user-id'

    // 2. Salvar (ou atualizar) o vídeo no PostgreSQL
    const video = await prisma.video.upsert({
      where: { youtubeId: videoId },
      update: {
        title: snippet.title,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
      },
      create: {
        youtubeId: videoId,
        title: snippet.title,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        user: {
          // Conecta ou cria um usuário genérico para testes
          connectOrCreate: {
            where: { id: userId },
            create: { id: userId, email: 'teste@example.com', name: 'Usuário Teste' }
          }
        }
      }
    })

    // 3. Buscar comentários do vídeo (máx 100 na primeira página)
    const commentsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${apiKey}`
    )
    const commentsData = await commentsRes.json()

    if (!commentsData.items) {
      return NextResponse.json({ success: true, message: 'No comments found', count: 0, video })
    }

    // 4. Salvar comentários no banco
    let savedCount = 0
    for (const item of commentsData.items) {
      const topLevelComment = item.snippet.topLevelComment.snippet
      
      try {
        await prisma.comment.upsert({
          where: { youtubeCommentId: item.id },
          update: {}, 
          create: {
            youtubeCommentId: item.id,
            videoId: video.id,
            text: topLevelComment.textDisplay,
            authorName: topLevelComment.authorDisplayName,
            authorProfileImageUrl: topLevelComment.authorProfileImageUrl,
            publishedAt: new Date(topLevelComment.publishedAt)
          }
        })
        savedCount++
      } catch (err) {
        // Ignora erros individuais de insert
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Comentários sincronizados com sucesso!',
      count: savedCount,
      video 
    })
    
  } catch (error: any) {
    console.error('YouTube API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
