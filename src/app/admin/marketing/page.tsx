import { useEffect, useMemo, useState } from "react";
import { useAdminAgency } from "../../../lib/useAdminAgency";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Check, Copy, Facebook, Instagram, Search, Sparkles } from "lucide-react";
import { cn } from "../../../lib/utils";

type Platform = "FACEBOOK" | "INSTAGRAM" | "GOOGLE";

export function AdminMarketing() {
  const { agency, loading } = useAdminAgency();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropId, setSelectedPropId] = useState<string>("");
  const [adPlatform, setAdPlatform] = useState<Platform>("FACEBOOK");
  const [generatedAd, setGeneratedAd] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!agency) return;
    const fetchProps = async () => {
      try {
        const q = query(collection(db, "agencies", agency.id, "properties"));
        const snap = await getDocs(q);
        setProperties(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
        if (!snap.empty) {
          setSelectedPropId(snap.docs[0].id);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "properties");
      }
    };
    fetchProps();
  }, [agency]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropId),
    [properties, selectedPropId]
  );

  const generateAd = async () => {
    if (!selectedPropId || !selectedProperty) return;
    setIsGenerating(true);
    setGeneratedAd("");
    setCopied(false);

    try {
      const prompt = `Crie um anuncio de alta conversao para a plataforma ${adPlatform} para o seguinte imovel:
      Titulo: ${selectedProperty.title}
      Descricao: ${selectedProperty.description}
      Tipo: ${selectedProperty.type}
      Cidade/Bairro: ${selectedProperty.city} - ${selectedProperty.neighborhood}
      Quartos: ${selectedProperty.bedrooms}, Banheiros: ${selectedProperty.bathrooms}, Area: ${selectedProperty.area}m²
      Preco: R$ ${selectedProperty.price}

      O tom deve ser persuasivo, focado em alto padrao, com CTA forte para WhatsApp ou site da imobiliaria ${agency?.name}. Limite de 150 palavras.`;

      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedAd(data.ad);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar anuncio. Verifique se o backend esta configurado com a API do Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-6 text-lg font-bold text-[#1d4ed8]">Carregando...</div>;

  const platforms = [
    { key: "FACEBOOK" as const, label: "Facebook", icon: Facebook, color: "text-[#1877f2]" },
    { key: "INSTAGRAM" as const, label: "Instagram", icon: Instagram, color: "text-[#c13584]" },
    { key: "GOOGLE" as const, label: "Google", icon: Search, color: "text-[#1d4ed8]" },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-8">
      <section className="mb-6 rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-[#0369a1]">Marketing com IA</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#0f2447]">Gerador de anuncios imobiliarios</h1>
        <p className="mt-3 max-w-3xl text-[#475569]">
          Transforme dados do imovel em copy pronta para campanha, mantendo contexto comercial e chamada clara para atendimento.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1fr]">
        <section className="rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f2447]">Configurar anuncio</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">Escolha o imovel, canal e gere uma copy com base no cadastro.</p>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
              Imovel
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-4 text-[#0f2447]"
              >
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - R$ {property.price}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="mb-3 text-sm font-bold text-[#0f2447]">Canal</p>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.key}
                    type="button"
                    onClick={() => setAdPlatform(platform.key)}
                    className={cn(
                      "focus-ring flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg px-2 py-3 text-xs font-bold transition-colors duration-200",
                      adPlatform === platform.key ? "bg-white text-[#0f2447] shadow-sm" : "text-[#64748b] hover:bg-white/70"
                    )}
                  >
                    <platform.icon className={cn("h-5 w-5", platform.color)} />
                    {platform.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedProperty && (
              <div className="rounded-lg border border-[#dbeafe] bg-[#f0f4ff] p-4">
                <p className="text-sm font-bold text-[#1d4ed8]">Resumo usado pela IA</p>
                <h3 className="mt-2 font-bold text-[#0f2447]">{selectedProperty.title}</h3>
                <p className="mt-1 text-sm text-[#64748b]">
                  {selectedProperty.city} - {selectedProperty.neighborhood} | {selectedProperty.bedrooms} quartos | {selectedProperty.area}m²
                </p>
              </div>
            )}

            <button
              onClick={generateAd}
              disabled={isGenerating || !selectedPropId}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f2447] p-4 font-bold text-white shadow-sm hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-5 w-5 text-[#facc15]" />
              {isGenerating ? "Gerando..." : "Gerar copy de alta conversao"}
            </button>
          </div>
        </section>

        <section className="flex min-h-[560px] flex-col rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#0f2447]">Preview da copy</h2>
              <p className="mt-1 text-sm text-[#64748b]">Texto pronto para revisar, ajustar e publicar.</p>
            </div>
            {generatedAd && (
              <button onClick={copyToClipboard} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-[#bfdbfe] px-4 py-3 text-sm font-bold text-[#1d4ed8] hover:bg-[#dbeafe]">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            )}
          </div>

          <div className="flex-1 rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-5 text-sm font-semibold leading-7 text-[#475569] shadow-inner">
            {generatedAd ? (
              <pre className="whitespace-pre-wrap font-sans">{generatedAd}</pre>
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center text-center text-[#64748b]">
                <div>
                  <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#1d4ed8]" />
                  <p className="font-bold">A copy gerada aparecera aqui.</p>
                  <p className="mt-2 max-w-md text-sm">Use o cadastro do imovel para criar uma primeira versao comercial mais rapido.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
