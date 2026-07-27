"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    // Configura o polling (intervalo) para atualizar a rota atual
    const interval = setInterval(() => {
      router.refresh() // Recarrega os dados do Server Component sem perder estado do Client
    }, intervalMs)

    return () => clearInterval(interval)
  }, [router, intervalMs])

  // Este componente não renderiza nada visualmente, ele apenas roda o script
  return null
}
