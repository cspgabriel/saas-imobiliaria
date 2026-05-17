import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Square,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAgency } from "../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

type Property = {
  id: string;
  title: string;
  price: number;
  type: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string | null;
  status: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Compra com seguranca",
    desc: "Imoveis revisados, documentacao acompanhada e negociacao orientada por especialistas.",
  },
  {
    icon: CalendarCheck,
    title: "Visita sem friccao",
    desc: "Atendimento rapido para filtrar perfil, agenda e prioridade antes de sair de casa.",
  },
  {
    icon: TrendingUp,
    title: "Curadoria de oportunidade",
    desc: "Carteira organizada por valor real, bairro, liquidez e momento de compra.",
  },
];

export function Home() {
  const { agency, loading } = useAgency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!agency) return;
    const fetchProps = async () => {
      try {
        const q = query(
          collection(db, "agencies", agency.id, "properties"),
          orderBy("createdAt", "desc"),
          limit(9)
        );
        const snap = await getDocs(q);
        const props = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Property);
        setProperties(props.filter((p) => p.status === "DISPONIVEL"));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "properties");
      }
    };
    fetchProps();
  }, [agency]);

  const filteredProperties = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return properties.filter((prop) => {
      const matchesType = typeFilter ? prop.type === typeFilter : true;
      const matchesSearch = normalizedTerm
        ? [prop.title, prop.city, prop.neighborhood].some((value) =>
            value?.toLowerCase().includes(normalizedTerm)
          )
        : true;
      return matchesType && matchesSearch;
    });
  }, [properties, searchTerm, typeFilter]);

  const agencyName = agency?.name || "Imobiliaria Prime";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0fdfa] px-4 text-center">
        <p className="text-lg font-bold text-[#0f766e]">Carregando {agencyName}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] text-[#134e4a]">
      <a href="#imoveis" className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-3 focus:text-[#134e4a] focus:shadow-lg">
        Ir para imoveis
      </a>

      <header className="sticky top-0 z-50 border-b border-[#99f6e4]/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f766e] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-[#134e4a] sm:text-xl">{agencyName}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#134e4a]/75 md:flex">
            <a className="focus-ring hover:text-[#0f766e]" href="#imoveis">Imoveis</a>
            <a className="focus-ring hover:text-[#0f766e]" href="#diferenciais">Diferenciais</a>
            <Link href="/admin" className="focus-ring hover:text-[#0f766e]">Area do corretor</Link>
            <Link href="/saas" className="focus-ring rounded-lg bg-[#0369a1] px-4 py-3 font-bold text-white shadow-sm hover:bg-[#075985]">
              Plataforma SaaS
            </Link>
          </nav>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[#99f6e4] px-4 py-3 text-sm font-bold text-[#0f766e] hover:bg-[#ccfbf1] md:hidden">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#134e4a] text-white">
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
            alt="Fachada de casa moderna"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-[#134e4a]/80" />
          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-[#ccfbf1]">
                Curadoria imobiliaria para comprar ou alugar melhor
              </p>
              <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
                Imoveis selecionados para uma decisao segura
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-[#ecfeff]">
                Encontre casas e apartamentos com atendimento consultivo, dados claros e um processo simples do primeiro contato ate a visita.
              </p>
            </div>

            <form className="rounded-lg border border-white/20 bg-white p-4 text-[#134e4a] shadow-2xl" onSubmit={(event) => event.preventDefault()}>
              <div className="mb-4 flex items-center gap-3 border-b border-[#ccfbf1] pb-4">
                <Search className="h-6 w-6 text-[#0f766e]" />
                <div>
                  <h2 className="text-xl font-bold">Buscar oportunidade</h2>
                  <p className="text-sm text-[#64748b]">Filtre por bairro, cidade ou tipo de negocio.</p>
                </div>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-[#134e4a]">
                  Tipo
                  <select
                    className="focus-ring rounded-lg border border-[#99f6e4] bg-[#f8fafc] px-4 py-4 text-[#134e4a]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">Compra ou locacao</option>
                    <option value="VENDA">Comprar</option>
                    <option value="LOCACAO">Alugar</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#134e4a]">
                  Localizacao
                  <input
                    type="search"
                    placeholder="Cidade, bairro ou nome do imovel"
                    className="focus-ring rounded-lg border border-[#99f6e4] bg-[#f8fafc] px-4 py-4 text-[#134e4a] placeholder:text-[#64748b]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>
                <a href="#imoveis" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#0369a1] px-5 py-4 font-bold text-white shadow-sm hover:bg-[#075985]">
                  Ver imoveis
                  <Search className="h-5 w-5" />
                </a>
              </div>
            </form>
          </div>
        </section>

        <section id="diferenciais" className="border-b border-[#99f6e4] bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4 rounded-lg border border-[#ccfbf1] bg-[#f8fafc] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#0f766e]">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#134e4a]">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#475569]">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="imoveis" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[#0369a1]">Carteira em destaque</p>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#134e4a]">Imoveis para visitar esta semana</h2>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-[#475569]">
                {filteredProperties.length} oportunidade{filteredProperties.length === 1 ? "" : "s"} disponivel{filteredProperties.length === 1 ? "" : "is"} conforme os filtros atuais.
              </p>
            </div>
            <div className="rounded-lg border border-[#99f6e4] bg-white px-4 py-3 text-sm font-bold text-[#0f766e]">
              Atendimento via WhatsApp em horario comercial
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="rounded-lg border border-[#99f6e4] bg-white p-10 text-center shadow-sm">
              <HomeIcon className="mx-auto mb-4 h-12 w-12 text-[#0f766e]" />
              <h3 className="text-2xl font-bold text-[#134e4a]">Nenhum imovel encontrado</h3>
              <p className="mx-auto mt-3 max-w-xl text-[#475569]">Ajuste os filtros ou fale com um corretor para receber opcoes fora do catalogo publico.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((prop) => (
                <Link
                  href={`/imovel/${prop.id}`}
                  key={prop.id}
                  className="focus-ring group flex min-h-full flex-col overflow-hidden rounded-lg border border-[#99f6e4] bg-white shadow-sm transition-colors duration-200 hover:border-[#14b8a6]"
                >
                  <div className="relative aspect-[4/3] bg-[#ccfbf1]">
                    <img
                      src={prop.imageUrl || fallbackImage}
                      alt={prop.title}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={cn(
                        "absolute left-4 top-4 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm",
                        prop.type === "VENDA" ? "bg-[#0369a1]" : "bg-[#0f766e]"
                      )}
                    >
                      {prop.type === "VENDA" ? "Venda" : "Locacao"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#64748b]">
                      <MapPin className="h-4 w-4 text-[#0f766e]" />
                      {prop.neighborhood}, {prop.city}
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold leading-7 text-[#134e4a] group-hover:text-[#0369a1]">
                      {prop.title}
                    </h3>
                    <div className="my-5 grid grid-cols-3 gap-2 border-y border-[#ccfbf1] py-4 text-sm font-bold text-[#475569]">
                      <span className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-[#0f766e]" />{prop.bedrooms}</span>
                      <span className="flex items-center gap-2"><Bath className="h-4 w-4 text-[#0f766e]" />{prop.bathrooms}</span>
                      <span className="flex items-center gap-2"><Square className="h-4 w-4 text-[#0f766e]" />{prop.area}m²</span>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#64748b]">Investimento</p>
                        <p className="text-2xl font-bold text-[#134e4a]">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prop.price)}
                        </p>
                      </div>
                      <span className="rounded-lg bg-[#ccfbf1] px-3 py-2 text-sm font-bold text-[#0f766e]">Detalhes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#99f6e4] bg-[#134e4a] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#0f766e]">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold">{agencyName}</span>
            </div>
            <p className="max-w-lg leading-7 text-[#ccfbf1]">
              Atendimento imobiliario com clareza, processo e tecnologia para transformar busca em decisao.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Navegacao</h4>
            <div className="grid gap-3 text-[#ccfbf1]">
              <a href="#imoveis">Imoveis</a>
              <Link href="/admin">Area do corretor</Link>
              <Link href="/saas">Plataforma SaaS</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Contato</h4>
            <div className="grid gap-3 text-[#ccfbf1]">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Brasil</span>
              <a href={`mailto:contato@${agency?.subdomain || "imobiliaria"}.com.br`}>contato@{agency?.subdomain || "imobiliaria"}.com.br</a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-colors duration-200 hover:bg-[#1EBE5D]"
        title="Fale conosco no WhatsApp"
        aria-label="Fale conosco no WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
