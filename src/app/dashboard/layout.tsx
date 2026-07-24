import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
