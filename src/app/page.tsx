import { signIn } from "@/auth"
import { Sparkles, BarChart3, Clock, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      {/* Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Creators Insights
          </div>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all font-medium text-sm">
              Sign In
            </button>
          </form>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
          AI-Powered Feedback Intelligence
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Entenda sua audiência <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
            em segundos, não horas.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Conecte seu canal e deixe nossa Inteligência Artificial ler, analisar e categorizar 
          milhares de comentários. Descubra o que seu público realmente quer.
        </p>

        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 font-medium text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(139,92,246,0.3)]">
            <span className="mr-2 text-lg">Começar Gratuitamente</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Análise de Sentimentos</h3>
            <p className="text-slate-400">Saiba exatamente a proporção de comentários positivos, neutros e negativos em seus vídeos.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-4 text-fuchsia-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Categorização Automática</h3>
            <p className="text-slate-400">A IA separa sugestões de conteúdo, dúvidas frequentes e críticas de forma automática.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tempo Real</h3>
            <p className="text-slate-400">Enquanto você foca na criação, nós processamos grandes volumes de dados no background.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
