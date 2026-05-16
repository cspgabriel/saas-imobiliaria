import { useEffect, useState } from "react";
import { Building, Users, Target, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useAgency } from "../../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

type Stats = {
  totalProperties: number;
  availableProperties: number;
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  conversionRate: string;
};

export function AdminDashboard() {
  const { agency, loading } = useAgency();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!agency) return;

    const fetchStats = async () => {
      try {
        const propertiesSnap = await getDocs(collection(db, "agencies", agency.id, "properties"));
        const leadsSnap = await getDocs(collection(db, "agencies", agency.id, "leads"));
        
        let availableProperties = 0;
        propertiesSnap.forEach(doc => {
          if (doc.data().status === "DISPONIVEL") availableProperties++;
        });

        let activeLeads = 0;
        let wonLeads = 0;
        leadsSnap.forEach(doc => {
          const status = doc.data().status;
          if (status !== "GANHO" && status !== "PERDIDO") activeLeads++;
          if (status === "GANHO") wonLeads++;
        });

        const totalLeads = leadsSnap.size;
        const conversionRate = totalLeads ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

        setStats({
          totalProperties: propertiesSnap.size,
          availableProperties,
          totalLeads,
          activeLeads,
          wonLeads,
          conversionRate
        });

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `dashboard`);
      }
    };

    fetchStats();
  }, [agency]);

  if (loading || !stats) return <div className="p-8">Carregando métricas...</div>;

  const statCards = [
    { name: "Total de Imóveis", value: stats.totalProperties, desc: `${stats.availableProperties} disponíveis agora`, icon: Building, color: "bg-blue-500" },
    { name: "Leads Totais", value: stats.totalLeads, desc: `${stats.activeLeads} em negociação`, icon: Users, color: "bg-violet-500" },
    { name: "Negócios Fechados", value: stats.wonLeads, desc: "Imóveis vendidos ou alugados", icon: CheckCircle2, color: "bg-emerald-500" },
    { name: "Taxa de Conversão", value: `${stats.conversionRate}%`, desc: "Leads convertidos", icon: Target, color: "bg-amber-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Painel Resumo</h2>
        <p className="text-slate-500 font-medium">Bem-vindo de volta! Aqui está o panorama do seu negócio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-4 rounded-xl text-white ${stat.color} shadow-lg shadow-black/5`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-500 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Acesso rápido */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link href="/admin/properties" className="block p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors group">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Gerenciar Imóveis</h4>
                  <p className="text-sm text-slate-500">Adicionar, editar ou remover cadastros</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
            <Link href="/admin/crm" className="block p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50/50 transition-colors group">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">Ver Pipeline de Vendas (CRM)</h4>
                  <p className="text-sm text-slate-500">Acompanhar leads e mover cards do funil</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
