import React from "react";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight, BarChart3, Building2, Globe, ShieldCheck, Zap } from "lucide-react";

export function SaasLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-black tracking-tight text-white">Imobi SaaS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            <a href="#about" className="hover:text-white transition-colors">Como Funciona</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Ver Demo
            </Link>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
              Assinar Agora
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            O Futuro do Mercado Imobiliário
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
            Sua imobiliária digital <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
              em 5 minutos.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Tenha um site próprio, CRM inteligente e gestão completa de leads. Tudo pronto para usar. O melhor sistema para corretores e imobiliárias.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              Começar Teste Grátis <ChevronRight className="w-5 h-5" />
            </button>
            <Link href="/" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center">
              Ver Site Demonstrativo
            </Link>
          </div>
        </div>
        
        {/* Abstract App Preview */}
        <div className="max-w-5xl mx-auto mt-20 px-6 relative z-10">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-2 backdrop-blur-xl shadow-2xl shadow-blue-900/20">
            <div className="rounded-2xl border border-white/5 bg-slate-950 overflow-hidden aspect-[16/9] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-50"></div>
              {/* Mock Dashboard UI */}
              <div className="absolute top-0 w-full h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <div className="absolute top-12 bottom-0 w-48 border-r border-white/5 p-4 flex flex-col gap-4">
                <div className="w-full h-8 rounded bg-white/5"></div>
                <div className="w-full h-8 rounded bg-white/5"></div>
                <div className="w-full h-8 rounded bg-blue-500/20"></div>
                <div className="w-full h-8 rounded bg-white/5"></div>
              </div>
              <div className="absolute top-12 left-48 right-0 bottom-0 p-8 flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5"></div>
                  <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5"></div>
                  <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5"></div>
                </div>
                <div className="flex-1 rounded-xl bg-white/5 border border-white/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-slate-400">Esqueça a dor de cabeça de contratar site e CRM separados. Nosso SaaS integra tudo nativamente.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Site Público Otimizado", desc: "Site imobiliário moderno, focado em conversão, com SEO avançado e domínio próprio." },
              { icon: Zap, title: "CRM Imobiliário", desc: "Funil de vendas kanban, gestão de leads, histórico de atendimentos e tarefas." },
              { icon: BarChart3, title: "Métricas em Tempo Real", desc: "Acompanhe quantas visitas seus imóveis receberam e taxa de conversão da equipe." },
              { icon: ShieldCheck, title: "Controle de Acessos", desc: "Níveis de permissão para corretores, gerentes e administradores da imobiliária." },
              { icon: Globe, title: "Integração com Portais", desc: "Exporte seus imóveis para os principais portais (ZAP, VivaReal, etc) com um clique. (Em breve)" },
              { icon: Building2, title: "Multi-filiais", desc: "Gerencie várias unidades ou equipes diferentes no mesmo painel de controle." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Planos Transparentes</h2>
            <p className="text-slate-400">Sem taxas de setup. Comece a usar imediatamente.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/50 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Autônomo</h3>
              <p className="text-slate-400 mb-6">Para corretores independentes.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">R$ 97</span>
                <span className="text-slate-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["1 Usuário (Corretor)", "Até 100 Imóveis", "Site Público Padrão", "CRM Básico"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 font-bold transition-colors">
                Escolher Plano
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl border border-blue-500 bg-blue-900/10 flex flex-col relative scale-105 shadow-2xl shadow-blue-900/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Imobiliária Pro</h3>
              <p className="text-slate-400 mb-6">Para pequenas e médias equipes.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">R$ 297</span>
                <span className="text-slate-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Até 5 Usuários", "Imóveis Ilimitados", "Domínio Personalizado", "CRM Avançado", "Relatórios de Desempenho", "Exportação para Portais"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
                Testar 14 Dias Grátis
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/50 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-6">Para grandes operações multifiliais.</p>
              <div className="mb-8">
                <span className="text-4xl font-black">R$ 897</span>
                <span className="text-slate-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {["Usuários Ilimitados", "Gestão de Filiais", "API Aberta", "Suporte Dedicado", "Treinamento da Equipe", "BI e Analytics Customizados"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 font-bold transition-colors">
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Imobi SaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
