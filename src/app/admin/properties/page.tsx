import React, { useEffect, useState } from "react";
import { Plus, Link as LinkIcon, Building, Trash2, Edit, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { collection, query, onSnapshot, deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { useAgency } from "../../../lib/AgencyContext";

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
  const { agency, loading: agencyLoading } = useAgency();
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

  useEffect(() => {
    if (!agency) return;
    const q = query(collection(db, "agencies", agency.id, "properties"));
    const unsub = onSnapshot(q, (snap) => {
      setProperties(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Property;
      }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `agencies/${agency.id}/properties`));
    return unsub;
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
      title, description, price: Number(price), type, status, city, neighborhood, 
      bedrooms: Number(bedrooms), bathrooms: Number(bathrooms), area: Number(area), imageUrl,
      updatedAt: Timestamp.now()
    };
    
    try {
      if (editingId) {
        await setDoc(doc(db, "agencies", agency.id, "properties", editingId), payload, { merge: true });
      } else {
        const newDocRef = doc(collection(db, "agencies", agency.id, "properties"));
        await setDoc(newDocRef, { ...payload, createdAt: Timestamp.now(), views: 0 });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `agencies/${agency.id}/properties`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!agency) return;
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;
    try {
      await deleteDoc(doc(db, "agencies", agency.id, "properties", id));
    } catch(err) {
      handleFirestoreError(err, OperationType.DELETE, `agencies/${agency.id}/properties`);
    }
  };

  if (agencyLoading) return <div className="p-8">Carregando...</div>;

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Imóveis</h2>
          <p className="text-slate-500 font-medium">Cadastre e gerencie a carteira de imóveis da {agency?.name}.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5" /> Novo Imóvel
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar imóveis..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-medium"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="RESERVADO">Reservado</option>
          <option value="VENDIDO">Vendido / Alugado</option>
        </select>
      </div>

      <div className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
              <th className="p-4">ID / Título</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Cidade / Bairro</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProperties.map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-slate-900 line-clamp-1">{prop.title}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{prop.id.substring(0,8)}...</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                    {prop.type}
                  </span>
                </td>
                <td className="p-4 text-slate-600 font-medium text-sm">
                  {prop.city} <br/><span className="text-slate-400">{prop.neighborhood}</span>
                </td>
                <td className="p-4 font-bold text-slate-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                </td>
                <td className="p-4">
                  <span className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-md inline-block",
                    prop.status === "DISPONIVEL" ? "bg-emerald-100 text-emerald-800" : 
                    prop.status === "RESERVADO" ? "bg-amber-100 text-amber-800" : 
                    "bg-slate-100 text-slate-600"
                  )}>
                    {prop.status}
                  </span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  <a href={`/imovel/${prop.id}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="Ver no site">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                  <button onClick={() => handleEditClick(prop)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Editar">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(prop.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Excluir">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProperties.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                  <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  Nenhum imóvel encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              {editingId ? "Editar Imóvel" : "Cadastrar Novo Imóvel"}
            </h3>
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título do Anúncio</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descrição</label>
                  <textarea required rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Negócio</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="VENDA">Venda</option>
                    <option value="LOCACAO">Locação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                    <option value="VENDIDO">Vendido / Alugado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Valor (R$)</label>
                  <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quartos</label>
                  <input required type="number" min="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Banheiros</label>
                  <input required type="number" min="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Área (m²)</label>
                  <input required type="number" min="0" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cidade</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bairro</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                </div>

                <div className="col-span-2 md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL da Imagem Padrão</label>
                  <input type="text" placeholder="https://..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono text-sm" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all">
                  {editingId ? "Atualizar Imóvel" : "Salvar Imóvel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
