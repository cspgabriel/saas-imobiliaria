import React, { useEffect, useState } from "react";
import { User, Mail, MessageCircle, Phone, Clock, Plus, Trash2, X, Search, FileText } from "lucide-react";
import { cn } from "../../../lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { collection, query, onSnapshot, deleteDoc, doc, setDoc, Timestamp, orderBy, addDoc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { useAgency } from "../../../lib/AgencyContext";
import { useAuth } from "../../../lib/AuthContext";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  propertyTitle?: string;
  createdAt: string;
};

type Interaction = {
  id: string;
  type: string;
  content: string;
  performedBy: string;
  createdAt: string;
};

export function CRM() {
  const { agency, loading: agencyLoading } = useAgency();
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (!agency) return;
    const q = query(collection(db, "agencies", agency.id, "leads"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Lead[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `agencies/${agency.id}/leads`));
    return unsub;
  }, [agency]);

  useEffect(() => {
    if (!agency || !selectedLead) return;
    const q = query(
      collection(db, "agencies", agency.id, "leads", selectedLead.id, "interactions"), 
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setInteractions(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Interaction[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `interactions`));
    return unsub;
  }, [agency, selectedLead]);

  const logInteraction = async (type: string, content: string) => {
    if (!agency || !selectedLead || !profile) return;
    try {
      await addDoc(collection(db, "agencies", agency.id, "leads", selectedLead.id, "interactions"), {
        type,
        content,
        performedBy: profile.name || profile.email,
        createdAt: Timestamp.now()
      });
      await updateDoc(doc(db, "agencies", agency.id, "leads", selectedLead.id), { updatedAt: Timestamp.now() });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `interactions`);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (!agency) return;
    try {
      await updateDoc(doc(db, "agencies", agency.id, "leads", leadId), { 
        status: newStatus,
        updatedAt: Timestamp.now() 
      });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `leads`);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!agency) return;
    if (!confirm("Tem certeza que deseja excluir o lead?")) return;
    try {
      await deleteDoc(doc(db, "agencies", agency.id, "leads", id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch(err) {
      handleFirestoreError(err, OperationType.DELETE, `leads`);
    }
  };

  const handleWhatsAppClick = (lead: Lead) => {
    if(!lead.phone) return alert("Lead não possui telefone cadastrado.");
    const wpUrl = `https://wa.me/${lead.phone.replace(/\D/g,'')}?text=Olá ${lead.name}, vi seu interesse no imóvel ${lead.propertyTitle || ''}. Como posso ajudar?`;
    window.open(wpUrl, '_blank');
    logInteraction('WHATSAPP', `Enviou mensagem no WhatsApp inicializando atendimento.`);
  };

  const handleEmailClick = (lead: Lead) => {
    if(!lead.email) return alert("Lead não possui email cadastrado.");
    const subject = encodeURIComponent(`Contato sobre o imóvel ${lead.propertyTitle || ''}`);
    const body = encodeURIComponent(`Olá ${lead.name},\n\nRecebemos seu contato através do nosso site referente ao imóvel ${lead.propertyTitle || ''}.\n\n`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
    logInteraction('EMAIL', `Iniciou rascunho de E-mail via Mailto.`);
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    logInteraction('NOTE', newNote.trim());
    setNewNote("");
  };

  if (agencyLoading) return <div className="p-8">Carregando...</div>;

  const STATUSES = ["NOVO", "CONTATO", "VISITA", "PROPOSTA", "GANHO", "PERDIDO"];
  const STATUS_COLORS: Record<string, string> = {
    NOVO: "bg-blue-100 text-blue-800",
    CONTATO: "bg-purple-100 text-purple-800",
    VISITA: "bg-amber-100 text-amber-800",
    PROPOSTA: "bg-orange-100 text-orange-800",
    GANHO: "bg-emerald-100 text-emerald-800",
    PERDIDO: "bg-slate-100 text-slate-800"
  };

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex bg-slate-50 relative h-full">
      {/* List Column */}
      <div className={cn("flex-1 p-6 transition-all", selectedLead ? "hidden md:block md:w-1/2 lg:w-1/3" : "w-full")}>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">CRM de Vendas</h2>
          <p className="text-slate-500 font-medium text-sm">Gerencie os contatos e interessados nos imóveis.</p>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar lead..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3 pb-32">
          {filteredLeads.map(lead => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all hover:border-blue-300 hover:shadow-md",
                selectedLead?.id === lead.id ? "bg-blue-50 border-blue-400 shadow-sm" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{lead.name}</h3>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide", STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-600")}>
                  {lead.status}
                </span>
              </div>
              {lead.propertyTitle && (
                <div className="text-sm font-medium text-blue-600 mb-2 line-clamp-1 bg-blue-100/50 p-2 rounded-lg break-all">
                  🏡 {lead.propertyTitle}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: ptBR })}</span>
                <button onClick={(e) => handleDelete(lead.id, e)} className="ml-auto text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && <div className="text-center p-8 text-slate-500 text-sm font-medium">Nenhum lead encontrado</div>}
        </div>
      </div>

      {/* Detail Column */}
      {selectedLead && (
        <div className="flex-1 bg-white border-l border-slate-200 h-[calc(100vh-64px)] overflow-y-auto sticky top-0 flex flex-col z-20 absolute inset-0 md:relative w-full">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-start justify-between">
            <div>
              <button className="md:hidden mb-4 text-slate-500 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1" onClick={() => setSelectedLead(null)}>
                Voltar à lista
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xl">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedLead.name}</h2>
                  <p className="text-slate-500 text-sm font-medium">Cadastrado em {format(new Date(selectedLead.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedLead(null)} className="hidden md:flex p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-6 bg-slate-50">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleWhatsAppClick(selectedLead)} className="flex flex-col items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-transform active:scale-95">
                <MessageCircle className="w-6 h-6" />
                WhatsApp
              </button>
              <button onClick={() => handleEmailClick(selectedLead)} className="flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95">
                <Mail className="w-6 h-6" />
                E-mail
              </button>
            </div>

            {/* Status & Info */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Informações do Lead</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Status do Funil</label>
                  <select 
                    value={selectedLead.status} 
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Telefone</label>
                    <div className="font-mono text-sm font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{selectedLead.phone || '-'}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Email</label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 overflow-hidden text-ellipsis">{selectedLead.email || '-'}</div>
                  </div>
                </div>

                {selectedLead.propertyTitle && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Imóvel de Interesse</label>
                    <div className="text-sm font-bold text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100">{selectedLead.propertyTitle}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Interaction History */}
            <div className="bg-white flex-1 p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Histórico & Anotações</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {interactions.map(interaction => (
                  <div key={interaction.id} className="flex gap-3 relative">
                    <div className="absolute left-[15px] top-6 bottom-[-20px] w-0.5 bg-slate-100 last:hidden"></div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm",
                      interaction.type === 'WHATSAPP' ? "bg-green-100 text-green-600" :
                      interaction.type === 'EMAIL' ? "bg-blue-100 text-blue-600" :
                      "bg-amber-100 text-amber-600"
                    )}>
                      {interaction.type === 'WHATSAPP' ? <MessageCircle className="w-4 h-4" /> :
                       interaction.type === 'EMAIL' ? <Mail className="w-4 h-4" /> :
                       <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">{interaction.performedBy}</span>
                        <span className="text-[10px] font-medium text-slate-400">{format(new Date(interaction.createdAt), "dd/MM 'às' HH:mm")}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{interaction.content}</p>
                    </div>
                  </div>
                ))}
                {interactions.length === 0 && <p className="text-sm text-slate-400 font-medium text-center py-4">Nenhuma interação registrada ainda.</p>}
              </div>

              <form onSubmit={submitNote} className="mt-auto relative">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Adicionar nota ao histórico..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800 resize-none"
                  rows={2}
                />
                <button type="submit" className="absolute right-2 bottom-2 bg-amber-500 hover:bg-amber-600 text-white p-2 text-xs font-bold rounded-lg transition-colors">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
