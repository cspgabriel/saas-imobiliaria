import React, { useEffect, useMemo, useState } from "react";
import { Building2, Edit, Link as LinkIcon, Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, Timestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { useAdminAgency } from "../../../lib/useAdminAgency";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  createdAt: string;
};

export function AdminProperties() {
  const { agency, loading: agencyLoading } = useAdminAgency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("VENDA");
  const [status, setStatus] = useState("DISPONIVEL");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bedrooms, setBedrooms] = useState("0");
  const [bathrooms, setBathrooms] = useState("0");
  const [area, setArea] = useState("0");
  const [imageUrl, setImageUrl] = useState("");

  const fetchProperties = async () => {
    if (!agency) return;
    try {
      const res = await fetch(`/api/properties?agencyId=${agency.id}`);
      if (res.ok) {
        setProperties(await res.json());
      }
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [agency]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setType("VENDA");
    setStatus("DISPONIVEL");
    setCity("");
    setNeighborhood("");
    setBedrooms("0");
    setBathrooms("0");
    setArea("0");
    setImageUrl("");
  };

  const handleEditClick = (prop: Property) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setDescription(prop.description);
    setPrice(prop.price.toString());
    setType(prop.type);
    setStatus(prop.status);
    setCity(prop.city);
    setNeighborhood(prop.neighborhood);
    setBedrooms(prop.bedrooms.toString());
    setBathrooms(prop.bathrooms.toString());
    setArea(prop.area.toString());
    setImageUrl(prop.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    const payload = {
      id: editingId || undefined,
      title,
      description,
      price: Number(price),
      type,
      status,
      city,
      neighborhood,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      imageUrl,
      agencyId: agency.id,
    };

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchProperties();
      }
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!agency) return;
    if (!confirm("Tem certeza que deseja excluir este imovel?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProperties();
      }
    } catch (err) {
      console.error("Erro ao excluir imóvel:", err);
    }
  };

  const filteredProperties = useMemo(() => {
    const normalizedTerm = searchTerm.toLowerCase();
    return properties.filter((prop) => {
      const matchesSearch =
        prop.title?.toLowerCase().includes(normalizedTerm) ||
        prop.city?.toLowerCase().includes(normalizedTerm) ||
        prop.neighborhood?.toLowerCase().includes(normalizedTerm);
      const matchesStatus = statusFilter ? prop.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, statusFilter]);

  if (agencyLoading) return <div className="p-6 text-lg font-bold text-[#1d4ed8]">Carregando...</div>;

  const statusClass: Record<string, string> = {
    DISPONIVEL: "bg-[#dcfce7] text-[#15803d]",
    RESERVADO: "bg-[#fef3c7] text-[#b45309]",
    VENDIDO: "bg-[#e2e8f0] text-[#475569]",
  };

  return (
    <div className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-8">
      <section className="mb-6 rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold text-[#0369a1]">Carteira</p>
            <h1 className="font-display mt-2 text-4xl font-bold text-[#0f2447]">Imoveis</h1>
            <p className="mt-3 max-w-3xl text-[#475569]">Cadastre, revise e publique oportunidades da {agency?.name}.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#0369a1] px-5 py-4 font-bold text-white shadow-sm hover:bg-[#075985]"
          >
            <Plus className="h-5 w-5" />
            Novo imovel
          </button>
        </div>
      </section>

      <section className="mb-5 grid gap-3 rounded-lg border border-[#bfdbfe] bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <span className="sr-only">Buscar imoveis</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
          <input
            type="search"
            placeholder="Buscar por titulo, cidade ou bairro"
            className="focus-ring w-full rounded-lg border border-[#dbeafe] bg-[#f8fafc] py-4 pl-12 pr-4 text-[#0f2447] placeholder:text-[#64748b]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">Filtrar por status</span>
          <select
            className="focus-ring w-full rounded-lg border border-[#dbeafe] bg-[#f8fafc] px-4 py-4 font-bold text-[#0f2447]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="DISPONIVEL">Disponivel</option>
            <option value="RESERVADO">Reservado</option>
            <option value="VENDIDO">Vendido / Alugado</option>
          </select>
        </label>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#bfdbfe] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#dbeafe] bg-[#f0f4ff] text-sm font-bold text-[#475569]">
                <th className="p-4">Imovel</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Localizacao</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbeafe]">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="transition-colors duration-200 hover:bg-[#f8fafc]">
                  <td className="p-4">
                    <div className="font-bold text-[#0f2447]">{prop.title}</div>
                    <div className="mt-1 font-mono text-xs text-[#64748b]">{prop.id.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-lg bg-[#dbeafe] px-3 py-2 text-xs font-bold text-[#1d4ed8]">{prop.type}</span>
                  </td>
                  <td className="p-4 text-sm font-semibold text-[#475569]">
                    {prop.city}
                    <br />
                    <span className="text-[#64748b]">{prop.neighborhood}</span>
                  </td>
                  <td className="p-4 font-bold text-[#0f2447]">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prop.price)}
                  </td>
                  <td className="p-4">
                    <span className={cn("inline-block rounded-lg px-3 py-2 text-xs font-bold", statusClass[prop.status] || "bg-[#e2e8f0] text-[#475569]")}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/imovel/${prop.id}`} target="_blank" rel="noopener noreferrer" className="focus-ring rounded-lg p-2 text-[#64748b] hover:bg-[#dbeafe] hover:text-[#1d4ed8]" title="Ver no site" aria-label="Ver no site">
                        <LinkIcon className="h-5 w-5" />
                      </a>
                      <button onClick={() => handleEditClick(prop)} className="focus-ring rounded-lg p-2 text-[#64748b] hover:bg-[#dbeafe] hover:text-[#1d4ed8]" title="Editar" aria-label="Editar">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(prop.id)} className="focus-ring rounded-lg p-2 text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626]" title="Excluir" aria-label="Excluir">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#64748b]">
                    <Building2 className="mx-auto mb-3 h-12 w-12 text-[#1d4ed8]" />
                    <p className="font-bold">Nenhum imovel encontrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f2447]/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#bfdbfe] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dbeafe] bg-white p-5">
              <div>
                <h2 className="text-2xl font-bold text-[#0f2447]">{editingId ? "Editar imovel" : "Cadastrar imovel"}</h2>
                <p className="text-sm text-[#64748b]">Campos usados no site publico e no CRM.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="focus-ring rounded-lg p-2 text-[#64748b] hover:bg-[#dbeafe]" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="grid gap-5 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-bold text-[#0f2447] md:col-span-3">
                  Titulo do anuncio
                  <input required type="text" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447] md:col-span-3">
                  Descricao
                  <textarea required rows={4} className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Tipo
                  <select className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="VENDA">Venda</option>
                    <option value="LOCACAO">Locacao</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Status
                  <select className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="DISPONIVEL">Disponivel</option>
                    <option value="RESERVADO">Reservado</option>
                    <option value="VENDIDO">Vendido / Alugado</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Valor (R$)
                  <input required type="number" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Quartos
                  <input required type="number" min="0" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Banheiros
                  <input required type="number" min="0" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Area (m²)
                  <input required type="number" min="0" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={area} onChange={(e) => setArea(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                  Cidade
                  <input required type="text" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={city} onChange={(e) => setCity(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447] md:col-span-2">
                  Bairro
                  <input required type="text" className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#0f2447] md:col-span-3">
                  URL da imagem principal
                  <input type="url" placeholder="https://..." className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3 font-mono text-sm" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </label>
              </div>

              <div className="flex flex-col justify-end gap-3 border-t border-[#dbeafe] pt-5 sm:flex-row">
                <button type="button" onClick={() => setIsModalOpen(false)} className="focus-ring rounded-lg border border-[#bfdbfe] px-6 py-3 font-bold text-[#0f2447] hover:bg-[#dbeafe]">
                  Cancelar
                </button>
                <button type="submit" className="focus-ring rounded-lg bg-[#0369a1] px-8 py-3 font-bold text-white shadow-sm hover:bg-[#075985]">
                  {editingId ? "Atualizar imovel" : "Salvar imovel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
