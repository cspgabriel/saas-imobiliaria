import { useEffect, useState } from "react";
import { useAgency } from "../../../lib/AgencyContext";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Users, Home, Eye } from "lucide-react";
import { useAuth } from "../../../lib/AuthContext";

export function AdminReports() {
  const { agency, loading } = useAgency();
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
        propertiesSnap.forEach(doc => {
          views += doc.data().views || 0;
        });

        const statusCounts: Record<string, number> = {};
        leadsSnap.forEach(doc => {
          const status = doc.data().status || "NOVO";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        setStats({
          totalLeads: leadsSnap.size,
          totalProperties: propertiesSnap.size,
          totalViews: views,
        });

        setLeadsByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `reports`);
      }
    };

    fetchStats();
  }, [agency]);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Relatórios & Estatísticas</h2>
        <p className="text-slate-500 font-medium">Acompanhe o desempenho da sua imobiliária.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total de Leads</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalLeads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Home className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Imóveis Ativos</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalProperties}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Eye className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Visualizações</p>
            <p className="text-3xl font-black text-slate-900">{stats.totalViews}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Leads por Status de Funil
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B", fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B", fontWeight: 600 }} />
                <Tooltip cursor={{ fill: "#F1F5F9" }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {profile?.role === "ADMIN" && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg text-white">
            <h3 className="text-xl font-black mb-2">Informações de Faturamento SaaS</h3>
            <p className="text-slate-400 font-medium text-sm mb-8">Gerencie a assinatura da sua imobiliária.</p>
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Plano Atual</span>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{agency?.plan}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-black">R$ 299<span className="text-lg text-slate-500 font-medium">/mês</span></span>
                </div>
                <button className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2 rounded-lg font-bold transition-colors">
                  Gerenciar
                </button>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-500 text-center">
              A fatura atual vence em 05/06/2026. <a href="#" className="text-blue-400 hover:underline">Ver histórico</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
