import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  DollarSign,
  FileText,
  Filter,
  Globe2,
  Home,
  KanbanSquare,
  LineChart,
  LockKeyhole,
  Megaphone,
  PanelTop,
  PlayCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    title: "Leads esfriam antes do retorno",
    desc: "Sem CRM, mensagens viram caos no WhatsApp e oportunidades quentes morrem sem follow-up.",
  },
  {
    icon: Globe2,
    title: "Site genérico que não converte",
    desc: "Templates lentos, sem busca inteligente nem CTA pro WhatsApp, espantam o comprador qualificado.",
  },
  {
    icon: FileText,
    title: "Planilhas que travam o crescimento",
    desc: "Carteira no Excel, equipe no escuro, gestor sem visão de funil e meta vira achismo.",
  },
  {
    icon: Megaphone,
    title: "Anúncios criados no improviso",
    desc: "Copy diferente em cada portal, sem padrão de marca e horas perdidas escrevendo a mesma descrição.",
  },
];

const showcaseFeatures = [
  {
    eyebrow: "CRM Imobiliário",
    title: "O fim do lead que some no WhatsApp",
    desc: "Funil visual com etapas claras, histórico de cada contato e tarefas comerciais centralizadas. O corretor sabe o que fazer agora; o gestor sabe quem precisa de empurrão.",
    bullets: [
      "Kanban com etapas configuráveis por imobiliária",
      "Histórico completo de mensagens, visitas e propostas",
      "Carteira separada por corretor com permissões",
      "Notificações pra não deixar lead frio",
    ],
    icon: KanbanSquare,
    align: "right" as const,
    mock: (
      <div className="rounded-2xl border border-[#bfdbfe] bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <strong className="text-sm text-[#0f2447]">Funil de vendas</strong>
          <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-bold text-[#1d4ed8]">184 leads ativos</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Novo", count: 42, color: "bg-[#dbeafe] text-[#1d4ed8]" },
            { label: "Contato", count: 28, color: "bg-[#fef3c7] text-[#92400e]" },
            { label: "Proposta", count: 12, color: "bg-[#dcfce7] text-[#166534]" },
          ].map((col) => (
            <div key={col.label} className="rounded-lg bg-[#f8fafc] p-2">
              <div className={`mb-2 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${col.color}`}>{col.label}</div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-md border border-[#e2e8f0] bg-white p-2">
                    <div className="text-[10px] font-bold text-[#0f2447]">Lead {col.label} {i}</div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[#dbeafe]">
                      <div className="h-1 w-3/4 rounded-full bg-[#2563eb]" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center text-xs font-bold text-[#0f2447]">{col.count}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Site Profissional",
    title: "Sua vitrine online, ranqueando e convertendo",
    desc: "Site moderno, rápido como PWA, com busca por perfil, página de imóvel otimizada e CTA direto pro WhatsApp. Domínio próprio e SEO pronto pra brigar com portais.",
    bullets: [
      "Busca por cidade, bairro, quartos, faixa de preço",
      "Página de imóvel com fotos, mapa e formulário",
      "Integração com WhatsApp e captura de lead",
      "PWA: abre rápido, funciona offline, instala no celular",
    ],
    icon: Globe2,
    align: "left" as const,
    mock: (
      <div className="overflow-hidden rounded-2xl border border-[#bfdbfe] bg-white shadow-xl">
        <div className="border-b border-[#dbeafe] bg-[#f8fafc] px-4 py-2 text-xs text-[#64748b]">imobi.suaimobiliaria.com</div>
        <div className="aspect-[16/10] bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
          <div className="h-full w-full bg-gradient-to-t from-[#0f2447]/80 via-[#0f2447]/20 to-transparent p-4 flex flex-col justify-end">
            <span className="mb-2 inline-flex w-fit rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-[#1d4ed8]">DESTAQUE</span>
            <strong className="text-white text-lg leading-tight">Apartamento Vista Mar - 3 suítes</strong>
            <span className="text-white/90 text-xs">R$ 1.250.000 · Boa Viagem, Recife</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-md bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center" />
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Marketing com IA",
    title: "Anúncios profissionais em segundos, sem bloqueio criativo",
    desc: "A IA lê os dados do imóvel e gera copy para Instagram, Facebook, Google e portais. Padrão de marca mantido, tempo da equipe devolvido.",
    bullets: [
      "Geração de copy para 4 canais de uma vez",
      "Tom ajustável: comercial, sofisticado, urgência",
      "Hashtags e CTA otimizados por canal",
      "Histórico de anúncios pra reaproveitar campanhas",
    ],
    icon: Sparkles,
    align: "right" as const,
    mock: (
      <div className="rounded-2xl border border-[#bfdbfe] bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <strong className="text-sm text-[#0f2447]">Copy gerada pela IA</strong>
          <span className="ml-auto rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold text-[#166534]">2,8s</span>
        </div>
        <div className="space-y-2 rounded-lg bg-[#f8fafc] p-3 text-xs leading-relaxed text-[#334155]">
          <p><strong className="text-[#0f2447]">Apartamento 3 suítes na Boa Viagem</strong> com vista mar deslumbrante.</p>
          <p>Lazer completo, 2 vagas, 142m². Pronto pra morar.</p>
          <p className="text-[#1d4ed8]">#imovelnobre #recife #vistamar</p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {["Instagram", "Facebook", "Google"].map((c) => (
            <span key={c} className="rounded-md bg-[#dbeafe] px-2 py-1 text-[10px] font-bold text-[#1d4ed8]">{c}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Imóveis & Catálogo",
    title: "Carteira organizada, equipe alinhada",
    desc: "Cadastro de imóveis com fotos, descrição, métricas e status. Filtros poderosos, busca instantânea e atualização em tempo real pra toda equipe.",
    bullets: [
      "Cadastro completo com upload de fotos",
      "Filtros por tipo, cidade, faixa de preço e status",
      "Status sincronizado com site e CRM",
      "Carteira segmentada por corretor",
    ],
    icon: Home,
    align: "left" as const,
    mock: (
      <div className="rounded-2xl border border-[#bfdbfe] bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#f8fafc] px-3 py-2 text-xs text-[#64748b]">
          <Search className="h-3.5 w-3.5" />
          Buscar imóveis...
        </div>
        <div className="space-y-2">
          {[
            { title: "Casa Jardim Oceano", price: "R$ 890.000", status: "Disponível", color: "bg-[#dcfce7] text-[#166534]" },
            { title: "Apto Vista Mar 3 Suítes", price: "R$ 1.250.000", status: "Em negociação", color: "bg-[#fef3c7] text-[#92400e]" },
            { title: "Cobertura Setor Bueno", price: "R$ 2.100.000", status: "Disponível", color: "bg-[#dcfce7] text-[#166534]" },
          ].map((p) => (
            <div key={p.title} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] p-2.5">
              <div>
                <div className="text-xs font-bold text-[#0f2447]">{p.title}</div>
                <div className="text-[10px] text-[#64748b]">{p.price}</div>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${p.color}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Relatórios em tempo real",
    title: "Decisões baseadas em dados, não em achismo",
    desc: "Dashboards de imóveis ativos, visualizações, leads por etapa, conversão por corretor e desempenho da equipe. Tudo atualizado ao vivo.",
    bullets: [
      "Visão executiva da operação em um clique",
      "Conversão de lead por etapa de funil",
      "Desempenho individual de cada corretor",
      "Exportação pra reuniões e diretoria",
    ],
    icon: LineChart,
    align: "right" as const,
    mock: (
      <div className="rounded-2xl border border-[#bfdbfe] bg-white p-5 shadow-xl">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Leads", value: "184", change: "+12%" },
            { label: "Visitas", value: "42", change: "+8%" },
            { label: "Vendas", value: "R$ 4.2M", change: "+24%" },
          ].map((k) => (
            <div key={k.label} className="rounded-lg bg-[#f8fafc] p-2">
              <div className="text-[10px] font-semibold text-[#64748b]">{k.label}</div>
              <div className="mt-0.5 text-base font-bold text-[#0f2447]">{k.value}</div>
              <div className="text-[10px] font-bold text-[#16a34a]">{k.change}</div>
            </div>
          ))}
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {[40, 65, 50, 78, 60, 88, 72, 95, 80, 92, 105, 120].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#1d4ed8] to-[#2563eb]" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-[#64748b]">
          <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Dez</span>
        </div>
      </div>
    ),
  },
];

const aiFeatures = [
  { icon: Sparkles, title: "Copy de anúncio em 4 canais", desc: "Instagram, Facebook, Google e portais em uma única geração." },
  { icon: Brain, title: "Descrição inteligente de imóveis", desc: "Transforma dados brutos em texto comercial pronto pra publicar." },
  { icon: Target, title: "Sugestão de perfil de comprador", desc: "A IA cruza dados do lead com a carteira disponível." },
  { icon: Bot, title: "Resposta automática qualificada", desc: "Pré-atendimento que filtra perfil e prioriza lead quente." },
];

const moreFeatures = [
  { icon: ShieldCheck, title: "Multi-tenant seguro" },
  { icon: UsersRound, title: "Multi-usuário com permissões" },
  { icon: Smartphone, title: "PWA mobile" },
  { icon: LockKeyhole, title: "Backup Firebase" },
  { icon: Calendar, title: "Agenda de visitas" },
  { icon: Wallet, title: "Controle financeiro" },
  { icon: Filter, title: "Filtros avançados" },
  { icon: Clock, title: "Histórico completo" },
];

const testimonials = [
  {
    name: "Marina Albuquerque",
    role: "Diretora · Albuquerque Imóveis",
    text: "Saímos da planilha e do WhatsApp solto pra um funil sério. Em 60 dias, dobramos a taxa de retorno em lead quente.",
    rating: 5,
  },
  {
    name: "Rodrigo Tavares",
    role: "Corretor autônomo · Recife",
    text: "Como autônomo, preciso de ferramenta enxuta e que entregue. Site, CRM e IA pra anúncio resolveram 90% da minha rotina.",
    rating: 5,
  },
  {
    name: "Camila Souza",
    role: "Gerente comercial · Imobiliária Litoral",
    text: "A IA pra escrever anúncio economiza horas da equipe. E os relatórios deixam minha reunião de segunda em 15 minutos.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Corretor",
    price: "R$ 97",
    desc: "Pra profissional autônomo que quer profissionalizar a operação.",
    items: ["1 usuário", "Até 100 imóveis", "Site público próprio", "CRM essencial", "Suporte por e-mail"],
    cta: "Começar agora",
  },
  {
    name: "Imobiliária Pro",
    price: "R$ 297",
    desc: "Pra equipes que querem vender com processo e dados.",
    items: ["Até 5 usuários", "Imóveis ilimitados", "CRM completo + Kanban", "Relatórios em tempo real", "Marketing com IA", "Suporte prioritário"],
    cta: "Testar 14 dias grátis",
    featured: true,
  },
  {
    name: "Rede",
    price: "R$ 897",
    desc: "Pra operação com filial, gestor e volume alto.",
    items: ["Usuários ilimitados", "Multi-filiais", "BI e API sob demanda", "Suporte dedicado", "Onboarding com consultor", "SLA contratual"],
    cta: "Falar com consultor",
  },
];

const stats = [
  { value: "+3.500", label: "Imóveis cadastrados" },
  { value: "180", label: "Imobiliárias ativas" },
  { value: "22 mil", label: "Leads gerenciados" },
  { value: "R$ 320M", label: "Em vendas processadas" },
  { value: "+95 mil", label: "Visitas agendadas" },
  { value: "+420 mil", label: "Mensagens roteadas" },
];

const faqs = [
  {
    q: "Quanto tempo leva pra colocar minha imobiliária no ar?",
    a: "Em até 5 minutos sua conta está pronta. Você cadastra os imóveis, ajusta o domínio e o site público fica disponível imediatamente. Não precisa de programador.",
  },
  {
    q: "Eu consigo migrar a base de imóveis e clientes que já tenho?",
    a: "Sim. O plano Imobiliária Pro inclui importação de planilha e o plano Rede tem onboarding com consultor que faz a migração pra você.",
  },
  {
    q: "Tem fidelidade ou multa pra cancelar?",
    a: "Não. É assinatura mensal sem contrato de permanência. Cancele quando quiser, sem multa e sem perder seus dados nos próximos 60 dias.",
  },
  {
    q: "A plataforma funciona no celular?",
    a: "Funciona. É um PWA, então instala como app no celular, abre rápido e roda offline. Toda a equipe pode operar do campo, sem perder agilidade.",
  },
  {
    q: "Os dados ficam separados de outras imobiliárias?",
    a: "Totalmente. A arquitetura é multi-tenant, com isolamento por imobiliária no Firebase. Cada operação tem sua base, seus usuários e suas permissões.",
  },
  {
    q: "A IA gera mesmo anúncio bom ou é genérico?",
    a: "A IA lê os dados específicos do imóvel cadastrado (área, quartos, diferenciais, localização) e gera copy contextualizada pra cada canal. Você revisa, ajusta o tom e publica.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#bfdbfe]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="focus-ring flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-[#0f2447]">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#1d4ed8] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 pr-8 leading-7 text-[#475569]">{a}</p>}
    </div>
  );
}

export function SaasLanding() {
  return (
    <div className="min-h-screen bg-[#f0f4ff] text-[#0f2447]">
      <a href="#conteudo" className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-3 focus:text-[#0f2447] focus:shadow-lg">
        Ir para conteúdo
      </a>

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#bfdbfe]/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/saas" className="focus-ring flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2447] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold text-[#0f2447]">Imobi SaaS</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-[#0f2447]/75 lg:flex">
            <a className="focus-ring hover:text-[#1d4ed8]" href="#recursos">Recursos</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#ia">IA</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#depoimentos">Depoimentos</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#planos">Planos</a>
            <a className="focus-ring hover:text-[#1d4ed8]" href="#faq">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="focus-ring hidden rounded-lg px-4 py-3 text-sm font-bold text-[#0f2447] hover:bg-[#dbeafe] sm:inline-flex">
              Ver demo
            </Link>
            <Link href="/admin" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1e40af]">
              Testar grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main id="conteudo" className="pt-20">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2447] via-[#1e3a8a] to-[#1d4ed8] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.4),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(15,36,71,0.6),transparent_50%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#facc15]" />
                Plataforma completa pra imobiliária digital
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                A plataforma que <span className="text-[#93c5fd]">transforma sua imobiliária</span> em máquina de vendas
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#dbeafe]">
                Site profissional, CRM inteligente, marketing com IA e relatórios em tempo real. Tudo integrado, multi-usuário, pronto pra escalar do corretor autônomo à rede com filial.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/admin" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-bold text-[#0f2447] shadow-lg hover:bg-[#dbeafe]">
                  Testar 14 dias grátis
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white backdrop-blur hover:bg-white/10">
                  <PlayCircle className="h-5 w-5" />
                  Ver demonstração
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#dbeafe]">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#93c5fd]" /> Sem cartão de crédito</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#93c5fd]" /> Sem fidelidade</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#93c5fd]" /> No ar em 5 minutos</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/20 bg-white/95 p-3 text-[#0f2447] shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-xl border border-[#bfdbfe] bg-[#f8fafc]">
                  <div className="flex items-center justify-between border-b border-[#dbeafe] bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
                      <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                      <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                    </div>
                    <span className="text-xs font-bold text-[#1d4ed8]">Imobi SaaS · Dashboard</span>
                  </div>
                  <div className="grid gap-3 p-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Leads hoje", value: "184", icon: Users, change: "+12%" },
                        { label: "Visitas", value: "42", icon: Calendar, change: "+8%" },
                        { label: "Vendas", value: "R$ 4.2M", icon: DollarSign, change: "+24%" },
                      ].map((k) => (
                        <div key={k.label} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                          <div className="flex items-center justify-between">
                            <k.icon className="h-4 w-4 text-[#1d4ed8]" />
                            <span className="text-[10px] font-bold text-[#16a34a]">{k.change}</span>
                          </div>
                          <strong className="mt-2 block text-lg text-[#0f2447]">{k.value}</strong>
                          <span className="text-[10px] font-semibold text-[#64748b]">{k.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <strong className="text-xs text-[#0f2447]">Performance · últimos 12 meses</strong>
                        <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] font-bold text-[#1d4ed8]">+24%</span>
                      </div>
                      <div className="flex h-24 items-end gap-1.5">
                        {[35, 55, 48, 70, 60, 82, 72, 90, 85, 95, 110, 125].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#1d4ed8] to-[#60a5fa]" style={{ height: `${h * 0.8}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-[#bfdbfe] bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dcfce7]">
                    <TrendingUp className="h-5 w-5 text-[#16a34a]" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#0f2447]">Conversão de lead</div>
                    <div className="text-xl font-bold text-[#16a34a]">+38%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">Diagnóstico</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447] sm:text-5xl">
              Você ainda perde vendas porque...
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((p) => (
              <div key={p.title} className="rounded-xl border border-[#bfdbfe] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#fee2e2] text-[#dc2626]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0f2447]">{p.title}</h3>
                <p className="mt-2 leading-7 text-[#475569]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SHOWCASE */}
        <section id="recursos" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">Solução</p>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447] sm:text-5xl">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#475569]">
                Um ecossistema integrado que substitui planilha, site genérico, CRM caro e agência de marketing. Tudo conversando.
              </p>
            </div>

            <div className="space-y-24">
              {showcaseFeatures.map((f) => (
                <div key={f.title} className={`grid items-center gap-10 lg:grid-cols-2 ${f.align === "left" ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dbeafe] px-3 py-1.5 text-xs font-bold text-[#1d4ed8]">
                      <f.icon className="h-3.5 w-3.5" />
                      {f.eyebrow}
                    </div>
                    <h3 className="font-display text-3xl font-bold leading-tight text-[#0f2447] sm:text-4xl">{f.title}</h3>
                    <p className="mt-4 text-lg leading-8 text-[#475569]">{f.desc}</p>
                    <ul className="mt-6 space-y-3">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d4ed8]" />
                          <span className="text-[#334155]">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/admin" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white hover:bg-[#1e40af]">
                      Quero usar agora
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div>{f.mock}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI SECTION */}
        <section id="ia" className="relative overflow-hidden bg-[#0f2447] py-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.3),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
                <Cpu className="h-3.5 w-3.5" />
                Inteligência Artificial nativa
              </div>
              <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                IA pra otimizar seu tempo, não pra substituir corretor
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#dbeafe]">
                Automação no que dá trabalho repetitivo. Sua equipe foca em fechar negócio; a IA escreve anúncio, qualifica lead e sugere ação.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {aiFeatures.map((a) => (
                <div key={a.title} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="mt-2 leading-7 text-[#cbd5e1]">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MORE FEATURES */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">E ainda tem mais</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447]">E muito mais pro seu negócio crescer</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreFeatures.map((m) => (
              <div key={m.title} className="flex items-center gap-3 rounded-xl border border-[#bfdbfe] bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbeafe] text-[#1d4ed8]">
                  <m.icon className="h-5 w-5" />
                </span>
                <strong className="text-[#0f2447]">{m.title}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="depoimentos" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">Quem usa, recomenda</p>
                <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447] sm:text-5xl">
                  Aprovada por quem entende do mercado
                </h2>
              </div>
              <div className="rounded-2xl bg-[#0f2447] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-6 w-6 fill-[#facc15] text-[#facc15]" />
                    ))}
                  </div>
                  <strong className="text-3xl">4,9</strong>
                </div>
                <p className="mt-2 text-sm text-[#dbeafe]">Média de avaliação de clientes ativos nos últimos 12 meses</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-xl border border-[#bfdbfe] bg-[#f8fafc] p-6 shadow-sm">
                  <div className="mb-3 flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#facc15] text-[#facc15]" />
                    ))}
                  </div>
                  <p className="leading-7 text-[#334155]">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-5 border-t border-[#dbeafe] pt-4">
                    <strong className="block text-[#0f2447]">{t.name}</strong>
                    <span className="text-sm text-[#64748b]">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANS */}
        <section id="planos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">Planos</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447] sm:text-5xl">
              Planos que acompanham sua jornada
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#475569]">
              Comece do tamanho que você é hoje. Cresça sem trocar de sistema, sem perder dado.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-7 shadow-sm ${
                  plan.featured ? "border-[#1d4ed8] shadow-xl ring-2 ring-[#1d4ed8]/20 lg:-translate-y-3" : "border-[#bfdbfe]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1d4ed8] px-4 py-1 text-xs font-bold text-white shadow-md">
                    MAIS ESCOLHIDO
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#0f2447]">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-[#475569]">{plan.desc}</p>
                <div className="my-6 border-y border-[#dbeafe] py-5">
                  <span className="text-5xl font-bold text-[#0f2447]">{plan.price}</span>
                  <span className="text-[#64748b]">/mês</span>
                </div>
                <ul className="space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#334155]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d4ed8]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/admin"
                  className={`focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 font-bold ${
                    plan.featured ? "bg-[#1d4ed8] text-white hover:bg-[#1e40af]" : "border border-[#bfdbfe] text-[#0f2447] hover:bg-[#dbeafe]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="bg-gradient-to-br from-[#0f2447] to-[#1e3a8a] py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[#93c5fd]">Em números</p>
              <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
                Imobi SaaS em números
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur">
                  <strong className="font-display block text-4xl font-bold text-white sm:text-5xl">{s.value}</strong>
                  <span className="mt-2 block text-sm text-[#dbeafe]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#1d4ed8]">Dúvidas frequentes</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#0f2447] sm:text-5xl">
              Perguntas e respostas
            </h2>
          </div>
          <div className="rounded-2xl border border-[#bfdbfe] bg-white px-6 shadow-sm">
            {faqs.map((f) => (
              <div key={f.q}>
                <FaqItem q={f.q} a={f.a} />
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f2447] p-10 text-center text-white shadow-2xl sm:p-16">
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Sua maior aliada no mercado imobiliário
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#dbeafe]">
              Comece hoje, sem cartão de crédito, sem contrato de permanência. Em 5 minutos sua imobiliária está online com tudo que precisa pra vender mais.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/admin" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-4 text-base font-bold text-[#0f2447] shadow-lg hover:bg-[#dbeafe]">
                Testar 14 dias grátis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-7 py-4 text-base font-bold text-white hover:bg-white/10">
                Ver site modelo
                <PanelTop className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#bfdbfe] bg-[#0f2447] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/saas" className="focus-ring inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold">Imobi SaaS</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-[#dbeafe]">
              Plataforma imobiliária multi-tenant: site, CRM, marketing com IA e relatórios em tempo real, em um lugar só.
            </p>
          </div>
          <div>
            <strong className="text-sm">Produto</strong>
            <ul className="mt-3 space-y-2 text-sm text-[#dbeafe]">
              <li><a href="#recursos" className="hover:text-white">Recursos</a></li>
              <li><a href="#ia" className="hover:text-white">IA</a></li>
              <li><a href="#planos" className="hover:text-white">Planos</a></li>
              <li><Link href="/" className="hover:text-white">Site modelo</Link></li>
            </ul>
          </div>
          <div>
            <strong className="text-sm">Empresa</strong>
            <ul className="mt-3 space-y-2 text-sm text-[#dbeafe]">
              <li><a href="#depoimentos" className="hover:text-white">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><Link href="/admin" className="hover:text-white">Sistema</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-[#93c5fd]">
          © {new Date().getFullYear()} Imobi SaaS · Plataforma imobiliária multi-tenant
        </div>
      </footer>
    </div>
  );
}
