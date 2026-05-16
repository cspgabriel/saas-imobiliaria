import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Building, MapPin, BedDouble, Bath, Square, Search, ShieldCheck, Clock, TrendingUp, MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAgency } from "../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";

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

export function Home() {
  const { agency, loading } = useAgency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (!agency) return;
    const fetchProps = async () => {
      try {
        const q = query(
          collection(db, "agencies", agency.id, "properties"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const snap = await getDocs(q);
        const props = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Property);
        if (typeFilter) {
          setProperties(props.filter(p => p.type === typeFilter && p.status === "DISPONIVEL"));
        } else {
          setProperties(props.filter(p => p.status === "DISPONIVEL"));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, `properties`);
      }
    };
    fetchProps();
  }, [agency, typeFilter]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-xl font-bold text-slate-400 animate-pulse">Carregando {agency?.name}...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header Público */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span>{agency?.name || 'Imobiliária'}</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center font-bold text-sm tracking-wide text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Início</Link>
            <Link href="/imoveis" className="hover:text-blue-600 transition-colors">Imóveis</Link>
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Área do Corretor</Link>
            <Link href="/saas" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-md">Descubra o Imobi SaaS</Link>
          </nav>
        </div>
      </header>

      {/* Hero / Busca Avançada */}
      <section className="bg-blue-600 py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-500/50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-700/50 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            O imóvel certo para a sua nova <span className="text-blue-200">história.</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Bem-vindo ao portal da {agency?.name}. Encontre casas e apartamentos de alto padrão com curadoria especializada.
          </p>

          <div className="bg-white p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-3 mt-12 w-full max-w-3xl mx-auto">
            <select
              className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none text-slate-700 font-bold transition-all"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Qualquer Negócio</option>
              <option value="VENDA">Comprar</option>
              <option value="LOCACAO">Alugar</option>
            </select>
            <input
              type="text"
              placeholder="Digite cidade ou bairro..."
              className="flex-[2] px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none text-slate-700 font-medium transition-all"
            />
            <Link href="/imoveis" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 w-full md:w-auto h-full">
              <Search className="w-5 h-5" /> Buscar
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Features (Por que nós?) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">O que nos torna diferentes</h2>
            <p className="text-slate-500 text-lg font-medium">Nosso compromisso é com a transparência e agilidade na sua jornada de compra ou locação.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Segurança Total</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Documentação verificada e assessoria completa da proposta até a entrega das chaves.</p>
            </div>
            
            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Melhores Taxas</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Condições exclusivas de financiamento e negociação direta com as construtoras.</p>
            </div>

            <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Consultoria 360º</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Uma equipe de corretores especializados sempre a postos para entender seu momento de vida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Imóveis */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex-1">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Lançamentos & Destaques</h2>
            <p className="text-slate-500 font-medium text-lg">As melhores oportunidades do mercado imobiliário separadas para você.</p>
          </div>
          <Link href="/imoveis" className="hidden md:flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Explorar Todos &rarr;
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-lg font-medium">Nenhum imóvel encontrado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <Link href={`/imovel/${prop.id}`} key={prop.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 outline-none">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {prop.imageUrl ? (
                      <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Sem Imagem</div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={cn(
                        "px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-wider text-white shadow-md",
                        prop.type === "VENDA" ? "bg-blue-600" : "bg-emerald-600"
                      )}>
                        {prop.type === "VENDA" ? "Venda" : "Locação"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3 font-bold uppercase tracking-wide">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {prop.neighborhood}, {prop.city}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {prop.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-slate-600 text-sm mb-6 pb-6 border-b border-slate-100 font-bold">
                      <div className="flex flex-col items-center flex-1">
                        <BedDouble className="w-5 h-5 text-slate-400 mb-1" /> {prop.bedrooms}
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="flex flex-col items-center flex-1">
                        <Bath className="w-5 h-5 text-slate-400 mb-1" /> {prop.bathrooms}
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="flex flex-col items-center flex-1">
                        <Square className="w-5 h-5 text-slate-400 mb-1" /> {prop.area}m²
                      </div>
                    </div>

                    <div className="mt-auto">
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                      </p>
                    </div>
                  </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer Profissional SaaS Multi-tenant */}
      <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-black text-2xl mb-6 tracking-tighter">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <span>{agency?.name}</span>
            </div>
            <p className="mb-6 max-w-sm leading-relaxed font-medium">
              Ajudamos você a encontrar o imóvel ideal com segurança e transparência. Imobiliária focada no melhor atendimento para os nossos clientes.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Links Rápidos</h4>
            <ul className="space-y-4 font-medium">
              <li><Link href="/imoveis" className="hover:text-blue-400 transition-colors">Comprar Imóvel</Link></li>
              <li><Link href="/imoveis" className="hover:text-blue-400 transition-colors">Alugar Imóvel</Link></li>
              <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Acesso Restrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contato</h4>
            <ul className="space-y-4 font-medium">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Brasil</li>
              <li><a href={`mailto:contato@${agency?.subdomain}.com.br`} className="hover:text-white transition-colors">contato@{agency?.subdomain}.com.br</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} {agency?.name}. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-slate-500">
            Powered by PropTech SaaS Solution
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        href={`https://wa.me/5511999999999`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 animate-bounce"
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
