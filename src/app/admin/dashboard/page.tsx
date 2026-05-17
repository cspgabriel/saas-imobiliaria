import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Building2, CheckCircle2, Clock3, Target, Users } from "lucide-react";
import { Link } from "wouter";
import { useAdminAgency } from "../../../lib/useAdminAgency";
import { db, handleFirestoreError, OperationType } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Stats = {
  totalProperties: number;
  availableProperties: number;
  totalLeads: number;
  activeLeads: number;
  wonLeads: number;
  conversionRate: string;
};

export function AdminDashboard() {
  const { agency, loading } = useAdminAgency();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!agency) return;

    const fetchStats = async () => {
      try {
        const propertiesSnap = await getDocs(collection(db, "agencies", agency.id, "properties"));
        const leadsSnap = await getDocs(collection(db, "agencies", agency.id, "leads"));

        let availableProperties = 0;
        propertiesSnap.forEach((item) => {
          if (item.data().status === "DISPONIVEL") availableProperties++;
        });

        let activeLeads = 0;
        let wonLeads = 0;
        leadsSnap.forEach((item) => {
          const status = item.data().status;
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
          conversionRate,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "dashboard");
      }
    };

    fetchStats();
  }, [agency]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: "Carteira",
        value: stats.totalProperties,
        desc: `${stats.availableProperties} disponiveis`,
        icon: Building2,
        color: "bg-[#dbeafe] text-[#1d4ed8]",
      },
      {
        name: "Leads",
        value: stats.totalLeads,
        desc: `${stats.activeLeads} em negociacao`,
        icon: Users,
        color: "bg-[#dbeafe] text-[#0369a1]",
      },
      {
        name: "Fechados",
        value: stats.wonLeads,
        desc: "Ganhos no funil",
        icon: CheckCircle2,
        color: "bg-[#dcfce7] text-[#15803d]",
      },
      {
        name: "Conversao",
        value: `${stats.conversionRate}%`,
        desc: "Leads convertidos",
        icon: Target,
        color: "bg-[#fef3c7] text-[#b45309]",
      },
    ];
  }, [stats]);

  if (loading || !stats) {
    return <div className="p-6 text-lg font-bold text-[#1d4ed8]">Carregando metricas...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-8">
      <section className="mb-6 rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold text-[#0369a1]">Resumo operacional</p>
            <h1 className="font-display mt-2 text-4xl font-bold text-[#0f2447]">Panorama da imobiliaria</h1>
            <p className="mt-3 max-w-3xl text-[#475569]">
              Acompanhe estoque, demanda, conversao e proximas acoes comerciais em uma tela densa para uso diario.
            </p>
          </div>
          <div className="rounded-lg bg-[#f0f4ff] px-4 py-3 text-sm font-bold text-[#1d4ed8]">
            Atualizado em tempo real pelo Firestore
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="rounded-lg border border-[#bfdbfe] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#64748b]">{stat.name}</p>
                <h2 className="mt-2 text-4xl font-bold text-[#0f2447]">{stat.value}</h2>
                <p className="mt-1 text-sm font-semibold text-[#475569]">{stat.desc}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.75fr]">
        <section className="rounded-lg border border-[#bfdbfe] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0f2447]">Acoes rapidas</h2>
              <p className="text-sm text-[#64748b]">Atalhos para as rotinas que movimentam venda.</p>
            </div>
            <Clock3 className="h-6 w-6 text-[#1d4ed8]" />
          </div>

          <div className="grid gap-3">
            {[
              {
                href: "/admin/properties",
                title: "Cadastrar ou revisar imoveis",
                desc: "Atualize fotos, preco, status e pagina publica.",
              },
              {
                href: "/admin/crm",
                title: "Atender leads em aberto",
                desc: "Priorize novos contatos, visitas e propostas.",
              },
              {
                href: "/admin/marketing",
                title: "Criar anuncios com IA",
                desc: "Transforme um imovel em copy para campanha.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex items-center justify-between gap-4 rounded-lg border border-[#dbeafe] bg-[#f8fafc] p-4 transition-colors duration-200 hover:border-[#2563eb] hover:bg-[#f0f4ff]"
              >
                <div>
                  <h3 className="font-bold text-[#0f2447]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#64748b]">{item.desc}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[#1d4ed8]" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#bfdbfe] bg-[#0f2447] p-6 text-white shadow-sm">
          <h2 className="text-xl font-bold">Saude do funil</h2>
          <p className="mt-2 text-[#dbeafe]">Use como leitura rapida antes da reuniao comercial.</p>

          <div className="mt-6 space-y-4">
            {[
              ["Leads ativos", stats.activeLeads, Math.min(stats.activeLeads * 8, 100)],
              ["Imoveis disponiveis", stats.availableProperties, Math.min(stats.availableProperties * 6, 100)],
              ["Conversao", `${stats.conversionRate}%`, Math.min(Number(stats.conversionRate) * 8, 100)],
            ].map(([label, value, width]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/15">
                  <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
