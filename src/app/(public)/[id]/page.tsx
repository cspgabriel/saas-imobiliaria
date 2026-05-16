import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BedDouble, Bath, Square, MapPin } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAgency } from "../../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

export function PropertyDetail({ id }: { id: string }) {
  const { agency, loading } = useAgency();
  const [property, setProperty] = useState<Property | null>(null);
  const [propLoading, setPropLoading] = useState(true);
  
  // Lead Form
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "agencies", agency.id, "leads"), {
        name,
        email,
        phone,
        propertyId: id,
        status: "NOVO",
        notes: "Lead recebido via página do imóvel.",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "leads");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || propLoading) return <div className="min-h-screen flex items-center justify-center p-8">Carregando imóvel...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center p-8">Imóvel não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Público */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Voltar para imóveis
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Coluna Esquerda: Detalhes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-[16/9] bg-slate-200 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            {property.imageUrl ? (
              <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                Sem Galeria de Imagens
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider text-white",
                property.type === "VENDA" ? "bg-blue-600" : "bg-emerald-600"
              )}>
                {property.type === "VENDA" ? "Venda" : "Locação"}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-slate-100 text-slate-600">
                Pronto para morar
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
              <MapPin className="w-5 h-5" />
              {property.neighborhood}, {property.city}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-200">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <BedDouble className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold text-slate-900">{property.bedrooms}</span>
              <span className="text-sm font-medium text-slate-500">Quartos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Bath className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold text-slate-900">{property.bathrooms}</span>
              <span className="text-sm font-medium text-slate-500">Banheiros</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Square className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold text-slate-900">{property.area}</span>
              <span className="text-sm font-medium text-slate-500">Metros (m²)</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sobre o Imóvel</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>

        {/* Coluna Direita: Sticky CTA & Lead Form */}
        <div>
          <div className="sticky top-24 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <p className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Valor do investimento</p>
            <p className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
            </p>

            <div className="bg-slate-50 -mx-8 px-8 py-8 border-t border-slate-100">
              <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Tem interesse?
              </h4>

              {submitted ? (
                <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 text-center font-medium">
                  Informações enviadas com sucesso! Um corretor entrará em contato em breve.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input autoFocus required type="text" placeholder="Seu nome completo" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <input required type="email" placeholder="Seu melhor e-mail" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <input required type="tel" placeholder="Telefone / WhatsApp" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
                    {isSubmitting ? "Enviando..." : "Falar com Corretor"}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-4">
                    Ao enviar, você concorda com nossos termos de privacidade.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
