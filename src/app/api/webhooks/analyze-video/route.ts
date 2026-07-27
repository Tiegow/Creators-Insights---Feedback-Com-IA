import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { GoogleGenAI } from '@google/genai'

export const maxDuration = 60 // Permite até 60 segundos na Vercel 

export async function POST(request: Request) {
  let videoIdToUpdate = null
  try {
    const { videoId } = await request.json()
    videoIdToUpdate = videoId

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    // 1. Buscar os comentários do vídeo no banco
    const comments = await prisma.comment.findMany({
      where: { videoId }
    })

    if (!comments || comments.length === 0) {
      // Se não tem comentários, marca como completo mas sem dados
      await prisma.analysis.update({
        where: { videoId },
        data: { status: 'COMPLETED' }
      })
      return NextResponse.json({ error: 'No comments found to analyze' }, { status: 400 })
    }

    const commentsText = comments.map((c: any) => `- ${c.text}`).join('\n')

    // 2. Inicializar a SDK do Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Configure no .env")
    }

    const ai = new GoogleGenAI({ apiKey })

    // 3. Montar o Prompt para estruturar o JSON
    const prompt = `Você é um analista de dados experiente. Analise a seguinte lista de comentários de um vídeo do YouTube.
    
    Comentários:
    ${commentsText}
    
    Sua tarefa é contar e classificar. Retorne ESTRITAMENTE um objeto JSON válido (sem formatação markdown extra, só o JSON) com esta estrutura exata:
    {
      "sentimentPositive": número total de comentários positivos,
      "sentimentNeutral": número total de comentários neutros,
      "sentimentNegative": número total de comentários negativos,
      "suggestionCount": número total de comentários sugerindo conteúdos ou ideias,
      "questionCount": número total de dúvidas,
      "problemCount": número total de críticas ou problemas
    }`

    // 4. Chamar o Gemini
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
    })

    const text = response.text || ''
    
    // Limpar markdown de JSON (```json ... ```) se houver
    let jsonText = text
    const match = text.match(/```json\n([\s\S]*?)\n```/)
    if (match) {
      jsonText = match[1]
    } else {
      jsonText = jsonText.replace(/```json\n|```/g, '')
    }
    
    let result
    try {
      result = JSON.parse(jsonText.trim())
    } catch (parseError) {
      console.error("Falha ao fazer parse do JSON:", jsonText)
      throw new Error("Gemini não retornou um JSON válido")
    }

    // 5. Salvar o resultado no banco
    await prisma.analysis.update({
      where: { videoId },
      data: {
        status: 'COMPLETED',
        sentimentPositive: result.sentimentPositive || 0,
        sentimentNeutral: result.sentimentNeutral || 0,
        sentimentNegative: result.sentimentNegative || 0,
        suggestionCount: result.suggestionCount || 0,
        questionCount: result.questionCount || 0,
        problemCount: result.problemCount || 0,
      }
    })

    return NextResponse.json({ success: true, result })

  } catch (error: any) {
    console.error('Webhook Error:', error)
    
    // Atualiza o banco para ERROR caso o processamento falhe
    if (videoIdToUpdate) {
      try {
        await prisma.analysis.update({
          where: { videoId: videoIdToUpdate },
          data: { status: 'ERROR' }
        })
      } catch (dbError) {
        console.error('Failed to update status to ERROR', dbError)
      }
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
