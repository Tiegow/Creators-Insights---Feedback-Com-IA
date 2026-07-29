'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SyncForm() {
  const [loading, setLoading] = useState(false)
  const [videoId, setVideoId] = useState('')
  const router = useRouter()

  async function handleSync(e: React.FormEvent) {
    e.preventDefault()
    if (!videoId) return

    setLoading(true)
    
    try {
      await fetch(`/api/youtube/comments`, {
        method: 'POST',
        body: JSON.stringify({ videoId }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      // Limpa o campo
      setVideoId('')
      
      // Força o Next.js a revalidar os dados da página
      router.refresh()
    } catch (error) {
      console.error('Falha ao sincronizar:', error)
      alert('Erro ao sincronizar vídeo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSync} className="flex gap-2">
      <input 
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Cole o ID do YouTube..." 
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors"
        disabled={loading}
      />
      <button 
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all shadow-[0_0_20px_4px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_6px_rgba(139,92,246,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {loading ? 'Sincronizando...' : 'Sincronizar'}
      </button>
    </form>
  )
}
