import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function testModel(modelName) {
  try {
    console.log(`\nTesting ${modelName} with JSON...`)
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Respond with exactly one word: OK',
      config: {
        responseMimeType: 'application/json'
      }
    })
    console.log(`✅ Success for ${modelName}:`, response.text)
  } catch (error) {
    console.log(`❌ Error for ${modelName}:`)
    console.error(error.message)
  }
}

async function run() {
  await testModel('gemini-flash-latest')
}

run()
