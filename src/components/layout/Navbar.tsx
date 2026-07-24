import { auth } from '@/auth'

export async function Navbar() {
  const session = await auth()
  
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 md:hidden">
        <span className="font-bold text-white tracking-tight">Insights</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">{session.user.name}</span>
            {session.user.image ? (
              <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
            )}
          </div>
        )}
      </div>
    </header>
  )
}
