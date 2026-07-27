import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId } = body

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID missing' }, { status: 400 })
    }

    // 1. Buscar os comentários que já estão salvos no banco para este vídeo
    const comments = await prisma.comment.findMany({
      where: { videoId }
    })

    if (comments.length === 0) {
      await prisma.analysis.update({
        where: { videoId },
        data: { status: 'ERROR' }
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    })

    const jsonText = response.text || ''
    if (!jsonText) throw new Error("A resposta do Gemini veio vazia")
    
    const result = JSON.parse(jsonText.replace(/```json\n|```/g, ''))

    // 3. Atualizar a análise no PostgreSQL com o status COMPLETED
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
