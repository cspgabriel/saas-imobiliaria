import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Square,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAgency } from "../../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string | null;
};

const fallbackImage = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80";

export function PropertyDetail({ id }: { id: string }) {
  const { agency, loading } = useAgency();
  const [property, setProperty] = useState<Property | null>(null);
  const [propLoading, setPropLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!agency) return;

    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "agencies", agency.id, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `properties/${id}`);
      } finally {
        setPropLoading(false);
      }
    };
    fetchProperty();
  }, [id, agency]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agency || !property) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "agencies", agency.id, "leads"), {
        name,
        email,
        phone,
        propertyId: id,
        propertyTitle: property.title,
        status: "NOVO",
        notes: "Lead recebido via pagina do imovel.",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "leads");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || propLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0fdfa] px-4 text-center text-lg font-bold text-[#0f766e]">
        Carregando imovel...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0fdfa] px-4 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#134e4a]">Imovel nao encontrado</h1>
          <Link href="/" className="focus-ring mt-5 inline-flex rounded-lg bg-[#0369a1] px-5 py-3 font-bold text-white hover:bg-[#075985]">
            Voltar para o site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] text-[#134e4a]">
      <header className="sticky top-0 z-50 border-b border-[#99f6e4]/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-[#134e4a] hover:bg-[#ccfbf1]">
            <ArrowLeft className="h-5 w-5" />
            Voltar para imoveis
          </Link>
          <a href="#contato" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#0369a1] px-4 py-3 text-sm font-bold text-white hover:bg-[#075985]">
            Agendar visita
            <CalendarCheck className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-lg border border-[#99f6e4] bg-white shadow-sm">
              <img
                src={property.imageUrl || fallbackImage}
                alt={property.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            <div className="rounded-lg border border-[#99f6e4] bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-bold text-white",
                    property.type === "VENDA" ? "bg-[#0369a1]" : "bg-[#0f766e]"
                  )}
                >
                  {property.type === "VENDA" ? "Venda" : "Locacao"}
                </span>
                <span className="rounded-lg bg-[#ccfbf1] px-3 py-2 text-xs font-bold text-[#0f766e]">
                  Atendimento consultivo
                </span>
              </div>

              <h1 className="font-display max-w-4xl text-4xl font-bold leading-tight text-[#134e4a] md:text-5xl">
                {property.title}
              </h1>
              <div className="mt-5 flex items-center gap-2 text-lg font-semibold text-[#475569]">
                <MapPin className="h-5 w-5 text-[#0f766e]" />
                {property.neighborhood}, {property.city}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: BedDouble, label: "Quartos", value: property.bedrooms },
                { icon: Bath, label: "Banheiros", value: property.bathrooms },
                { icon: Square, label: "Metros quadrados", value: `${property.area}m²` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[#99f6e4] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#0f766e]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <strong className="block text-3xl text-[#134e4a]">{item.value}</strong>
                  <span className="mt-1 block text-sm font-bold text-[#64748b]">{item.label}</span>
                </div>
              ))}
            </div>

            <section className="rounded-lg border border-[#99f6e4] bg-white p-6 shadow-sm">
              <h2 className="font-display text-3xl font-bold text-[#134e4a]">Sobre o imovel</h2>
              <p className="mt-4 text-lg leading-8 text-[#475569]">{property.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Documentacao acompanhada", "Visita com horario marcado", "Corretor especialista"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-[#f0fdfa] px-4 py-3 text-sm font-bold text-[#0f766e]">
                    <CheckCircle2 className="h-4 w-4" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside id="contato" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-[#99f6e4] bg-white shadow-xl shadow-[#0f766e]/10">
              <div className="border-b border-[#ccfbf1] p-6">
                <p className="text-sm font-bold text-[#64748b]">Investimento</p>
                <p className="mt-2 text-4xl font-bold text-[#134e4a]">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(property.price)}
                </p>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-[#134e4a]">Quero falar com um corretor</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
                  Envie seus dados para receber disponibilidade, agenda de visita e condicoes de negociacao.
                </p>

                {submitted ? (
                  <div className="mt-6 rounded-lg border border-[#6ee7b7] bg-[#ecfdf5] p-5 text-center font-bold text-[#047857]">
                    Informacoes enviadas. Um corretor entrara em contato em breve.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                    <label className="grid gap-2 text-sm font-bold text-[#134e4a]">
                      Nome completo
                      <input
                        autoFocus
                        required
                        type="text"
                        className="focus-ring rounded-lg border border-[#99f6e4] bg-[#f8fafc] px-4 py-3 text-[#134e4a]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#134e4a]">
                      E-mail
                      <input
                        required
                        type="email"
                        className="focus-ring rounded-lg border border-[#99f6e4] bg-[#f8fafc] px-4 py-3 text-[#134e4a]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#134e4a]">
                      Telefone ou WhatsApp
                      <input
                        required
                        type="tel"
                        className="focus-ring rounded-lg border border-[#99f6e4] bg-[#f8fafc] px-4 py-3 text-[#134e4a]"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0369a1] px-5 py-4 font-bold text-white shadow-sm hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Enviando..." : "Falar com corretor"}
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <p className="text-center text-xs leading-5 text-[#64748b]">
                      Seus dados serao usados apenas para atendimento deste interesse.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
