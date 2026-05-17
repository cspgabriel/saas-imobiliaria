import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  FileBarChart,
  Home,
  LayoutDashboard,
  LogOut,
  PanelTop,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { useAgency } from "../../lib/AgencyContext";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { profile, logout } = useAuth();
  const { agency } = useAgency();

  const menu = [
    { name: "Visao geral", short: "Geral", icon: LayoutDashboard, path: "/admin" },
    { name: "Imoveis", short: "Imoveis", icon: Home, path: "/admin/properties" },
    { name: "CRM", short: "CRM", icon: Users, path: "/admin/crm" },
    { name: "Marketing IA", short: "IA", icon: Sparkles, path: "/admin/marketing" },
    { name: "Relatorios", short: "Dados", icon: FileBarChart, path: "/admin/reports" },
  ];

  const activeProfile = profile ?? { name: "Demo", email: "demo@imobiliaria.com", role: "ADMIN" };
  const currentMenu = menu.find((item) => item.path === location) || menu[0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0fdfa] text-[#134e4a]">
      <aside className="hidden w-72 shrink-0 border-r border-[#99f6e4] bg-[#134e4a] text-[#ccfbf1] md:flex md:flex-col">
        <div className="border-b border-white/10 p-5">
          <Link href="/admin" className="focus-ring flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#0f766e]">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold text-white">{agency?.name || "Imobiliaria SaaS"}</h1>
              <p className="text-xs font-bold text-[#99f6e4]">{activeProfile.role}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {menu.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-4 py-3 font-bold transition-colors duration-200",
                  isActive ? "bg-white text-[#134e4a]" : "text-[#ccfbf1] hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-[#0f766e]" : "text-[#99f6e4]")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0f766e] font-bold text-white">
                {activeProfile.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{activeProfile.name}</p>
                <p className="truncate text-xs text-[#99f6e4]">{activeProfile.email}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-sm font-bold hover:bg-white/10">
              <PanelTop className="h-4 w-4" />
              Site
            </Link>
            <button onClick={logout} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-sm font-bold hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[#99f6e4] bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0f766e]">Sistema imobiliario</p>
              <h2 className="truncate font-display text-xl font-bold text-[#134e4a] md:text-2xl">{currentMenu.name}</h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/saas" className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[#99f6e4] px-4 py-3 text-sm font-bold text-[#0f766e] hover:bg-[#ccfbf1]">
                <BarChart3 className="h-4 w-4" />
                Landing SaaS
              </Link>
              <button onClick={logout} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#0369a1] px-4 py-3 text-sm font-bold text-white hover:bg-[#075985]">
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
            <button onClick={logout} className="focus-ring inline-flex rounded-lg p-3 text-[#64748b] hover:bg-[#ccfbf1] md:hidden" aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        <nav className="grid shrink-0 grid-cols-5 border-t border-[#99f6e4] bg-white p-1 md:hidden">
          {menu.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "focus-ring flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-2 text-[11px] font-bold",
                  isActive ? "bg-[#ccfbf1] text-[#0f766e]" : "text-[#64748b]"
                )}
              >
                <item.icon className="mb-1 h-5 w-5 shrink-0" />
                <span className="max-w-full truncate">{item.short}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
