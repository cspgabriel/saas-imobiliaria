import React, { useEffect, useMemo, useState } from "react";
import { Clock, FileText, Home, Mail, MessageCircle, Search, Trash2, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { useAdminAgency } from "../../../lib/useAdminAgency";
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

const STATUSES = ["NOVO", "CONTATO", "VISITA", "PROPOSTA", "GANHO", "PERDIDO"];

const STATUS_COLORS: Record<string, string> = {
  NOVO: "bg-[#dbeafe] text-[#0369a1]",
  CONTATO: "bg-[#dbeafe] text-[#1d4ed8]",
  VISITA: "bg-[#fef3c7] text-[#b45309]",
  PROPOSTA: "bg-[#ffedd5] text-[#c2410c]",
  GANHO: "bg-[#dcfce7] text-[#15803d]",
  PERDIDO: "bg-[#e2e8f0] text-[#475569]",
};

export function CRM() {
  const { agency, loading: agencyLoading } = useAdminAgency();
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (!agency) return;
    const q = query(collection(db, "agencies", agency.id, "leads"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLeads(
          snap.docs.map((item) => ({
            id: item.id,
            ...item.data(),
            createdAt: item.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          })) as Lead[]
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, `agencies/${agency.id}/leads`)
    );
    return unsub;
  }, [agency]);

  useEffect(() => {
    if (!agency || !selectedLead) return;
    const q = query(collection(db, "agencies", agency.id, "leads", selectedLead.id, "interactions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setInteractions(
          snap.docs.map((item) => ({
            id: item.id,
            ...item.data(),
            createdAt: item.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          })) as Interaction[]
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "interactions")
    );
    return unsub;
  }, [agency, selectedLead]);

  const logInteraction = async (type: string, content: string) => {
    if (!agency || !selectedLead || !profile) return;
    try {
      await addDoc(collection(db, "agencies", agency.id, "leads", selectedLead.id, "interactions"), {
        type,
        content,
        performedBy: profile.name || profile.email,
        createdAt: Timestamp.now(),
      });
      await updateDoc(doc(db, "agencies", agency.id, "leads", selectedLead.id), { updatedAt: Timestamp.now() });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "interactions");
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (!agency) return;
    try {
      await updateDoc(doc(db, "agencies", agency.id, "leads", leadId), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, "leads");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!agency) return;
    if (!confirm("Tem certeza que deseja excluir o lead?")) return;
    try {
      await deleteDoc(doc(db, "agencies", agency.id, "leads", id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, "leads");
    }
  };

  const handleWhatsAppClick = (lead: Lead) => {
    if (!lead.phone) return alert("Lead nao possui telefone cadastrado.");
    const wpUrl = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Ola ${lead.name}, vi seu interesse no imovel ${lead.propertyTitle || ""}. Como posso ajudar?`;
    window.open(wpUrl, "_blank");
    logInteraction("WHATSAPP", "Iniciou atendimento pelo WhatsApp.");
  };

  const handleEmailClick = (lead: Lead) => {
    if (!lead.email) return alert("Lead nao possui email cadastrado.");
    const subject = encodeURIComponent(`Contato sobre o imovel ${lead.propertyTitle || ""}`);
    const body = encodeURIComponent(`Ola ${lead.name},\n\nRecebemos seu contato atraves do nosso site referente ao imovel ${lead.propertyTitle || ""}.\n\n`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, "_blank");
    logInteraction("EMAIL", "Iniciou rascunho de email via mailto.");
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    logInteraction("NOTE", newNote.trim());
    setNewNote("");
  };

  const filteredLeads = useMemo(() => {
    const normalizedTerm = searchTerm.toLowerCase();
    return leads.filter((lead) =>
      [lead.name, lead.email, lead.phone, lead.propertyTitle].some((value) =>
        value?.toLowerCase().includes(normalizedTerm)
      )
    );
  }, [leads, searchTerm]);

  const pipelineCounts = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        count: leads.filter((lead) => lead.status === status).length,
      })),
    [leads]
  );

  if (agencyLoading) return <div className="p-6 text-lg font-bold text-[#1d4ed8]">Carregando...</div>;

  return (
    <div className="flex h-full min-h-[720px] bg-[#f0f4ff]">
      <section className={cn("flex min-w-0 flex-1 flex-col p-4 sm:p-6", selectedLead ? "hidden lg:flex lg:max-w-[470px]" : "w-full")}>
        <div className="mb-5 rounded-lg border border-[#bfdbfe] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#0369a1]">Pipeline comercial</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-[#0f2447]">CRM de vendas</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">Atenda novos contatos, registre interacoes e avance o lead no funil.</p>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {pipelineCounts.map((item) => (
            <div key={item.status} className="rounded-lg border border-[#dbeafe] bg-white p-3 text-center">
              <span className={cn("mx-auto mb-2 inline-flex rounded-lg px-2 py-1 text-[11px] font-bold", STATUS_COLORS[item.status])}>
                {item.status}
              </span>
              <strong className="block text-xl text-[#0f2447]">{item.count}</strong>
            </div>
          ))}
        </div>

        <label className="relative mb-4 block">
          <span className="sr-only">Buscar lead</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
          <input
            type="search"
            placeholder="Buscar lead, email, telefone ou imovel"
            className="focus-ring w-full rounded-lg border border-[#bfdbfe] bg-white py-4 pl-12 pr-4 text-[#0f2447] placeholder:text-[#64748b] shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-24">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedLead(lead)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setSelectedLead(lead);
              }}
              className={cn(
                "focus-ring w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-colors duration-200 hover:border-[#2563eb]",
                selectedLead?.id === lead.id ? "border-[#2563eb] bg-[#f0f4ff]" : "border-[#bfdbfe]"
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-[#0f2447]">{lead.name}</h2>
                  <p className="truncate text-sm text-[#64748b]">{lead.email}</p>
                </div>
                <span className={cn("shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold", STATUS_COLORS[lead.status] || STATUS_COLORS.PERDIDO)}>
                  {lead.status}
                </span>
              </div>
              {lead.propertyTitle && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#dbeafe] p-3 text-sm font-bold text-[#1d4ed8]">
                  <Home className="h-4 w-4 shrink-0" />
                  <span className="truncate">{lead.propertyTitle}</span>
                </div>
              )}
              <div className="flex items-center gap-3 border-t border-[#dbeafe] pt-3 text-xs font-semibold text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: ptBR })}
                </span>
                <span className="ml-auto rounded-lg bg-[#f8fafc] px-2 py-1">{lead.phone || "sem telefone"}</span>
                <button
                  type="button"
                  onClick={(event) => handleDelete(lead.id, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") handleDelete(lead.id, event);
                  }}
                  className="focus-ring rounded-lg p-2 text-[#dc2626] hover:bg-[#fee2e2]"
                  aria-label="Excluir lead"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="rounded-lg border border-[#bfdbfe] bg-white p-8 text-center text-sm font-bold text-[#64748b]">
              Nenhum lead encontrado
            </div>
          )}
        </div>
      </section>

      {selectedLead ? (
        <section className="absolute inset-0 z-20 flex flex-1 flex-col border-l border-[#bfdbfe] bg-white lg:relative lg:z-auto">
          <div className="shrink-0 border-b border-[#dbeafe] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <button className="focus-ring mb-4 rounded-lg border border-[#bfdbfe] px-3 py-2 text-sm font-bold text-[#1d4ed8] hover:bg-[#dbeafe] lg:hidden" onClick={() => setSelectedLead(null)}>
                  Voltar a lista
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1d4ed8] text-xl font-bold text-white">
                    {selectedLead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-bold text-[#0f2447]">{selectedLead.name}</h2>
                    <p className="text-sm text-[#64748b]">Cadastrado em {format(new Date(selectedLead.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="focus-ring hidden rounded-lg p-2 text-[#64748b] hover:bg-[#dbeafe] lg:inline-flex" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f0f4ff] p-4 sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1fr]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleWhatsAppClick(selectedLead)} className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-[#25D366] p-4 font-bold text-white shadow-sm hover:bg-[#1EBE5D]">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </button>
                  <button onClick={() => handleEmailClick(selectedLead)} className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-[#0369a1] p-4 font-bold text-white shadow-sm hover:bg-[#075985]">
                    <Mail className="h-5 w-5" />
                    E-mail
                  </button>
                </div>

                <div className="rounded-lg border border-[#bfdbfe] bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-[#0369a1]">Informacoes do lead</h3>
                  <div className="grid gap-4">
                    <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                      Status do funil
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                        className="focus-ring rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-[#f8fafc] p-3">
                        <span className="text-xs font-bold text-[#64748b]">Telefone</span>
                        <p className="mt-1 font-mono text-sm font-bold text-[#0f2447]">{selectedLead.phone || "-"}</p>
                      </div>
                      <div className="rounded-lg bg-[#f8fafc] p-3">
                        <span className="text-xs font-bold text-[#64748b]">Email</span>
                        <p className="mt-1 truncate text-sm font-bold text-[#0f2447]">{selectedLead.email || "-"}</p>
                      </div>
                    </div>
                    {selectedLead.propertyTitle && (
                      <div className="rounded-lg bg-[#dbeafe] p-3">
                        <span className="text-xs font-bold text-[#1d4ed8]">Imovel de interesse</span>
                        <p className="mt-1 font-bold text-[#0f2447]">{selectedLead.propertyTitle}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#bfdbfe] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-[#0369a1]">Historico e anotacoes</h3>
                <div className="max-h-[460px] space-y-4 overflow-y-auto pr-1">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="flex gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          interaction.type === "WHATSAPP"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : interaction.type === "EMAIL"
                              ? "bg-[#dbeafe] text-[#0369a1]"
                              : "bg-[#fef3c7] text-[#b45309]"
                        )}
                      >
                        {interaction.type === "WHATSAPP" ? <MessageCircle className="h-4 w-4" /> : interaction.type === "EMAIL" ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1 rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3">
                        <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-bold text-[#64748b]">
                          <span>{interaction.performedBy}</span>
                          <span>{format(new Date(interaction.createdAt), "dd/MM 'as' HH:mm")}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#475569]">{interaction.content}</p>
                      </div>
                    </div>
                  ))}
                  {interactions.length === 0 && <p className="py-8 text-center text-sm font-bold text-[#64748b]">Nenhuma interacao registrada.</p>}
                </div>

                <form onSubmit={submitNote} className="mt-4 grid gap-3">
                  <label className="grid gap-2 text-sm font-bold text-[#0f2447]">
                    Nova nota
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Registrar contexto do atendimento..."
                      className="focus-ring min-h-24 resize-none rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-3 text-[#0f2447] placeholder:text-[#64748b]"
                    />
                  </label>
                  <button type="submit" className="focus-ring justify-self-end rounded-lg bg-[#1d4ed8] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#115e59]">
                    Salvar nota
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="hidden flex-1 items-center justify-center border-l border-[#bfdbfe] bg-white p-8 text-center lg:flex">
          <div>
            <UsersFallback />
            <h2 className="mt-4 text-2xl font-bold text-[#0f2447]">Selecione um lead</h2>
            <p className="mt-2 max-w-md text-[#64748b]">Abra um contato para registrar status, WhatsApp, email e anotacoes do atendimento.</p>
          </div>
        </section>
      )}
    </div>
  );
}

function UsersFallback() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[#dbeafe] text-[#1d4ed8]">
      <Search className="h-7 w-7" />
    </div>
  );
}
