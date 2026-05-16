import { useEffect, useState } from "react";
import { useAgency } from "../../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Facebook, Instagram, Search, Sparkles, Copy, Check } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminMarketing() {
  const { agency, loading } = useAgency();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropId, setSelectedPropId] = useState<string>("");
  const [adPlatform, setAdPlatform] = useState<"FACEBOOK" | "INSTAGRAM" | "GOOGLE">("FACEBOOK");
  const [generatedAd, setGeneratedAd] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!agency) return;
    const fetchProps = async () => {
      try {
        const q = query(collection(db, "agencies", agency.id, "properties"));
        const snap = await getDocs(q);
        setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (!snap.empty) {
          setSelectedPropId(snap.docs[0].id);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "properties");
      }
    };
    fetchProps();
  }, [agency]);

  const generateAd = async () => {
    if (!selectedPropId) return;
    setIsGenerating(true);
    setGeneratedAd("");
    setCopied(false);

    const prop = properties.find(p => p.id === selectedPropId);
    
    try {
      const prompt = `Crie um anúncio de alta conversão para a plataforma ${adPlatform} para o seguinte imóvel:
      Título: ${prop.title}
      Descrição: ${prop.description}
      Tipo: ${prop.type}
      Cidade/Bairro: ${prop.city} - ${prop.neighborhood}
      Quartos: ${prop.bedrooms}, Banheiros: ${prop.bathrooms}, Área: ${prop.area}m²
      Preço: R$ ${prop.price}
      
      O tom deve ser persuasivo, focado em alto padrão, incluir emojis adequados e uma forte chamada para ação (CTA) convidando para chamar no WhatsApp ou acessar o site da imobiliária ${agency?.name}. Limite de 150 palavras.`;

      // Simulating an API call to server.ts, but we will call our new api route
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if(data.error) throw new Error(data.error);
      setGeneratedAd(data.ad);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar anúncio. Verifique se o backend está configurado com a API do Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  const getPlatformIcon = (plt: string) => {
    switch (plt) {
      case "FACEBOOK": return <Facebook className="w-5 h-5 text-blue-600" />;
      case "INSTAGRAM": return <Instagram className="w-5 h-5 text-pink-600" />;
      case "GOOGLE": return <Search className="w-5 h-5 text-green-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 pb-32 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Marketing & Anúncios (IA)</h2>
        <p className="text-slate-500 font-medium">Gere cópias de anúncios persuasivos automaticamente para seus imóveis usando Inteligência Artificial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Configuração do Anúncio</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Selecione o Imóvel</label>
              <select 
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title} - R$ {p.price}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Plataforma de Destino</label>
              <div className="grid grid-cols-3 gap-3">
                {["FACEBOOK", "INSTAGRAM", "GOOGLE"].map((plt) => (
                  <button
                    key={plt}
                    onClick={() => setAdPlatform(plt as any)}
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer font-bold text-xs",
                      adPlatform === plt ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {getPlatformIcon(plt)}
                    {plt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateAd} 
              disabled={isGenerating || !selectedPropId}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              {isGenerating ? "Criando magia..." : "Gerar Textos de Alta Conversão"}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Pré-visualização da Copy</h3>
            {generatedAd && (
              <button onClick={copyToClipboard} className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-200 transition-colors">
                {copied ? <><Check className="w-4 h-4"/> Copiado!</> : <><Copy className="w-4 h-4"/> Copiar</>}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-inner overflow-y-auto whitespace-pre-wrap font-medium text-slate-700 leading-relaxed text-sm">
            {generatedAd ? (
              generatedAd
            ) : (
              <span className="text-slate-400 italic">O texto gerado pela IA aparecerá aqui.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
