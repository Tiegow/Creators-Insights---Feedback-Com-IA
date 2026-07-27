import { Client } from '@upstash/qstash'

const client = new Client({ 
  token: "eyJVc2VySUQiOiJmMWY4ZThlZC0xNzAzLTQ5NTItODRiZS0zNDJhMTQwNTdjY2UiLCJQYXNzd29yZCI6IjM3NmM3MzBkYTYzZjRhNWI5Y2U2MmUxMTEwZWVhODdlIn0=",
  baseUrl: "https://qstash-us-east-1.upstash.io"
})

async function test() {
  try {
    console.log("Publishing to QStash...")
    const res = await client.publishJSON({
      url: "https://creators-insights-feedback-com-ia.vercel.app/api/webhooks/analyze-video",
      body: {
        videoId: "test-id", 
        youtubeId: "test-youtube-id"
      },
    })
    console.log("Success:", res)
  } catch (error) {
    console.error("QStash Error:", error)
  }
}

test()
