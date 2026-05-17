import { useEffect, useState } from "react";
import { useAdminAgency } from "../../../lib/useAdminAgency";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Eye, Home, TrendingUp, Users } from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";

export function AdminReports() {
  const { agency, loading } = useAdminAgency();
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProperties: 0,
    totalViews: 0,
  });
  const [leadsByStatus, setLeadsByStatus] = useState<any[]>([]);

  useEffect(() => {
    if (!agency) return;

    const fetchStats = async () => {
      try {
        const propertiesSnap = await getDocs(collection(db, "agencies", agency.id, "properties"));
        const leadsSnap = await getDocs(collection(db, "agencies", agency.id, "leads"));

        let views = 0;
        propertiesSnap.forEach((item) => {
          views += item.data().views || 0;
        });

        const statusCounts: Record<string, number> = {};
        leadsSnap.forEach((item) => {
          const status = item.data().status || "NOVO";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        setStats({
          totalLeads: leadsSnap.size,
          totalProperties: propertiesSnap.size,
          totalViews: views,
        });

        setLeadsByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "reports");
      }
    };

    fetchStats();
  }, [agency]);

  if (loading) return <div className="p-6 text-lg font-bold text-[#1d4ed8]">Carregando...</div>;

  const cards = [
    { label: "Leads captados", value: stats.totalLeads, icon: Users, color: "bg-[#dbeafe] text-[#0369a1]" },
    { label: "Imoveis ativos", value: stats.totalProperties, icon: Home, color: "bg-[#dbeafe] text-[#1d4ed8]" },
    { label: "Visualizacoes", value: stats.totalViews, icon: Eye, color: "bg-[#fef3c7] text-[#b45309]" },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-8">
      <section className="mb-6 rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-[#0369a1]">Business intelligence</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#0f2447]">Relatorios e estatisticas</h1>
        <p className="mt-3 max-w-3xl text-[#475569]">
          Visao compacta para entender origem de demanda, volume de carteira e gargalos do funil.
        </p>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-[#bfdbfe] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#64748b]">{card.label}</p>
                <p className="mt-2 text-4xl font-bold text-[#0f2447]">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.72fr]">
        <section className="rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#0f2447]">Leads por status de funil</h2>
              <p className="mt-1 text-sm text-[#64748b]">Distribuicao atual para ajustar foco do time.</p>
            </div>
            <TrendingUp className="h-6 w-6 text-[#1d4ed8]" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStatus} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#475569", fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#475569", fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: "#f0f4ff" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #bfdbfe",
                    boxShadow: "0 12px 24px rgba(15, 36, 71, 0.12)",
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="value" fill="#1d4ed8" radius={[8, 8, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {profile?.role === "ADMIN" && (
          <section className="rounded-lg border border-[#bfdbfe] bg-[#0f2447] p-6 text-white shadow-sm">
            <p className="text-sm font-bold text-[#bfdbfe]">Assinatura</p>
            <h2 className="mt-2 text-2xl font-bold">Faturamento SaaS</h2>
            <p className="mt-3 leading-7 text-[#dbeafe]">Resumo administrativo para controlar plano, vencimento e upgrade da imobiliaria.</p>

            <div className="mt-6 rounded-lg border border-white/15 bg-white/10 p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-[#dbeafe]">Plano atual</span>
                <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#1d4ed8]">{agency?.plan || "PRO"}</span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="text-4xl font-bold">R$ 299</span>
                  <span className="text-[#dbeafe]">/mes</span>
                </div>
                <button className="focus-ring rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#0f2447] hover:bg-[#dbeafe]">
                  Gerenciar
                </button>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#dbeafe]">
              Vencimento atual: 05/06/2026. Historico financeiro pode ser conectado ao checkout na proxima etapa.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
