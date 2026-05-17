import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Globe2,
  KanbanSquare,
  LockKeyhole,
  MessageSquareText,
  PanelTop,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "Site de imobiliaria pronto para vender",
    desc: "Catalogo publico, busca por perfil, paginas de imovel e CTA direto para WhatsApp ou formulario.",
  },
  {
    icon: KanbanSquare,
    title: "CRM imobiliario no mesmo lugar",
    desc: "Leads, historico de atendimento, status do funil e tarefas comerciais sem planilha paralela.",
  },
  {
    icon: BarChart3,
    title: "Gestao orientada por metricas",
    desc: "Imoveis ativos, visualizacoes, leads por etapa, conversao e carteira da equipe em uma visao unica.",
  },
  {
    icon: MessageSquareText,
    title: "Marketing com IA",
    desc: "Gere copies de anuncios para Facebook, Instagram e Google a partir dos dados do imovel.",
  },
  {
    icon: ShieldCheck,
    title: "Operacao multiusuario",
    desc: "Acesso para administradores, gerentes e corretores com base de dados separada por imobiliaria.",
  },
  {
    icon: LockKeyhole,
    title: "Base preparada para escalar",
    desc: "Arquitetura multi-tenant, Firebase, PWA e backend Express para evoluir assinatura e automacoes.",
  },
];

const plans = [
  {
    name: "Corretor",
    price: "R$ 97",
    desc: "Para profissional autonomo com carteira enxuta.",
    items: ["1 usuario", "Ate 100 imoveis", "Site publico", "CRM essencial"],
    cta: "Comecar agora",
  },
  {
    name: "Imobiliaria Pro",
    price: "R$ 297",
    desc: "Para equipes que precisam vender com processo.",
    items: ["Ate 5 usuarios", "Imoveis ilimitados", "CRM completo", "Relatorios e marketing IA"],
    cta: "Testar 14 dias",
    featured: true,
  },
  {
    name: "Rede",
    price: "R$ 897",
    desc: "Para operacoes com filial, gestor e volume.",
    items: ["Usuarios ilimitados", "Multi-filiais", "Suporte dedicado", "BI e API sob demanda"],
    cta: "Falar com consultor",
  },
];

export function SaasLanding() {
  return (
    <div className="min-h-screen bg-[#f0f4ff] text-[#0f2447]">
      <a href="#conteudo" className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-3 focus:text-[#0f2447] focus:shadow-lg">
        Ir para conteudo
      </a>

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#bfdbfe]/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/saas" className="focus-ring flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1d4ed8] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold text-[#0f2447]">Imobi SaaS</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-[#0f2447]/75 md:flex">
            <a className="focus-ring hover:text-[#1d4ed8]" href="#produto">Produto</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#recursos">Recursos</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#planos">Planos</a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="focus-ring hidden rounded-lg px-4 py-3 text-sm font-bold text-[#0f2447] hover:bg-[#dbeafe] sm:inline-flex">
              Ver demo
            </Link>
            <Link href="/admin" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#0369a1] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#075985]">
              Abrir painel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main id="conteudo" className="pt-20">
        <section className="relative overflow-hidden bg-[#1d4ed8] text-white">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80"
            alt="Sala moderna em imovel de alto padrao"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#1d4ed8]/80" />
          <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold">
                <Star className="h-4 w-4 fill-[#facc15] text-[#facc15]" />
                Plataforma completa para imobiliarias digitais
              </div>
              <h1 className="font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
                Imobi SaaS
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-[#ecfeff]">
                Landing, site de imobiliaria, CRM, relatorios e marketing IA em uma unica operacao para captar, atender e converter leads de imoveis.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/admin" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-bold text-[#0f2447] shadow-sm hover:bg-[#dbeafe]">
                  Entrar no sistema
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-4 text-base font-bold text-white hover:bg-white/10">
                  Ver site modelo
                  <PanelTop className="h-5 w-5" />
                </Link>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-6 text-sm text-[#dbeafe]">
                <div>
                  <strong className="block text-2xl text-white">5 min</strong>
                  para publicar
                </div>
                <div>
                  <strong className="block text-2xl text-white">360</strong>
                  gestao comercial
                </div>
                <div>
                  <strong className="block text-2xl text-white">PWA</strong>
                  pronto para mobile
                </div>
              </div>
            </div>

            <div id="produto" className="w-full rounded-lg border border-white/20 bg-white p-3 text-[#0f2447] shadow-2xl">
              <div className="overflow-hidden rounded-lg border border-[#bfdbfe] bg-[#f8fafc]">
                <div className="flex items-center justify-between border-b border-[#dbeafe] bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#2563eb]" />
                    <span className="h-3 w-3 rounded-full bg-[#0369a1]" />
                    <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                  </div>
                  <span className="text-xs font-bold text-[#1d4ed8]">Painel Imobiliaria Pro</span>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-[0.7fr_1fr]">
                  <div className="space-y-3">
                    {["Dashboard", "Imoveis", "CRM", "Marketing"].map((item, index) => (
                      <div key={item} className={`rounded-lg border px-3 py-3 text-sm font-bold ${index === 1 ? "border-[#2563eb] bg-[#dbeafe] text-[#1d4ed8]" : "border-[#e2e8f0] bg-white text-[#475569]"}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {["184 leads", "42 visitas", "18 propostas"].map((item) => (
                        <div key={item} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                          <span className="text-xs font-semibold text-[#64748b]">Hoje</span>
                          <strong className="mt-1 block text-lg text-[#0f2447]">{item}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                        alt="Casa moderna em destaque no painel"
                        className="aspect-[16/9] w-full rounded-lg object-cover"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold">Casa Jardim Oceano</p>
                          <p className="text-sm text-[#64748b]">Lead quente - visita agendada</p>
                        </div>
                        <span className="rounded-lg bg-[#0369a1] px-3 py-2 text-xs font-bold text-white">CRM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold text-[#0369a1]">Produto completo</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447]">Tudo que uma imobiliaria precisa para operar online</h2>
            <p className="mt-4 text-lg leading-8 text-[#475569]">
              O layout foi pensado para leitura rapida, operacao diaria e conversao: menos enfeite, mais contexto comercial.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm transition-colors duration-200 hover:border-[#2563eb]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#dbeafe] text-[#1d4ed8]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[#0f2447]">{feature.title}</h3>
                <p className="mt-3 leading-7 text-[#475569]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[#bfdbfe] bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3">
            {[
              ["Landing SaaS", "Explica a oferta e leva para teste ou demo."],
              ["Site modelo", "Mostra a experiencia final da imobiliaria."],
              ["Sistema interno", "Centraliza imoveis, leads, relatorios e anuncios."],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#1d4ed8]" />
                <div>
                  <h3 className="text-lg font-bold text-[#0f2447]">{title}</h3>
                  <p className="mt-2 text-[#475569]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="planos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[#0369a1]">Planos</p>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447]">Preco simples para vender melhor</h2>
            </div>
            <p className="max-w-xl text-[#475569]">Comece pequeno, mantenha a base organizada e evolua para equipe, filial e automacoes.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-lg border bg-white p-6 shadow-sm ${plan.featured ? "border-[#0369a1]" : "border-[#bfdbfe]"}`}>
                {plan.featured && (
                  <div className="mb-4 inline-flex rounded-lg bg-[#0369a1] px-3 py-2 text-xs font-bold text-white">Mais usado</div>
                )}
                <h3 className="text-2xl font-bold text-[#0f2447]">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-[#475569]">{plan.desc}</p>
                <div className="my-6">
                  <span className="text-4xl font-bold text-[#0f2447]">{plan.price}</span>
                  <span className="text-[#64748b]">/mes</span>
                </div>
                <ul className="space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#475569]">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1d4ed8]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/admin" className={`focus-ring mt-8 inline-flex w-full items-center justify-center rounded-lg px-5 py-4 font-bold ${plan.featured ? "bg-[#0369a1] text-white hover:bg-[#075985]" : "border border-[#bfdbfe] text-[#0f2447] hover:bg-[#dbeafe]"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#bfdbfe] bg-[#0f2447] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-semibold md:flex-row md:items-center md:justify-between">
          <span>Imobi SaaS - plataforma imobiliaria multi-tenant</span>
          <div className="flex gap-4 text-[#dbeafe]">
            <Link href="/">Site modelo</Link>
            <Link href="/admin">Sistema</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
