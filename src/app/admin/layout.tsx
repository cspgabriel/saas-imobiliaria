import type { ReactNode } from "react";
import {
  Building2,
  Copy,
  ExternalLink,
  FileBarChart,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { useAdminAgency } from "../../lib/useAdminAgency";

const PROD_DOMAIN = "imobisaas.com.br";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { profile, loading: authLoading, logout } = useAuth();
  const { agency, loading: agencyLoading } = useAdminAgency();

  const menu = [
    { name: "Visão geral", short: "Geral", icon: LayoutDashboard, path: "/admin" },
    { name: "Imóveis", short: "Imóveis", icon: Home, path: "/admin/properties" },
    { name: "CRM", short: "CRM", icon: Users, path: "/admin/crm" },
    { name: "Marketing IA", short: "IA", icon: Sparkles, path: "/admin/marketing" },
    { name: "Relatórios", short: "Dados", icon: FileBarChart, path: "/admin/reports" },
  ];

  useEffect(() => {
    if (authLoading) return;
    if (profile && !profile.agencyId) {
      navigate("/onboarding");
    }
  }, [authLoading, profile, navigate]);

  const sitePreviewUrl = agency
    ? `${window.location.protocol}//${window.location.hostname}/site/${agency.subdomain}`
    : null;
  const siteProdUrl = agency ? `https://${agency.subdomain}.${PROD_DOMAIN}` : null;

  const copySlug = () => {
    if (siteProdUrl) navigator.clipboard.writeText(siteProdUrl);
  };

  const activeProfile = profile ?? { name: "—", email: "—", role: "ADMIN" };
  const currentMenu = menu.find((item) => item.path === location) || menu[0];

  if (authLoading || agencyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1d4ed8]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4ff] text-[#0f2447]">
      <aside className="hidden w-72 shrink-0 border-r border-[#bfdbfe] bg-[#0f2447] text-[#dbeafe] md:flex md:flex-col">
        <div className="border-b border-white/10 p-5">
          <Link href="/admin" className="focus-ring flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#1d4ed8]">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold text-white">{agency?.name || "Minha imobiliária"}</h1>
              <p className="text-xs font-bold text-[#bfdbfe]">{activeProfile.role}</p>
            </div>
          </Link>
        </div>

        {agency && (
          <div className="border-b border-white/10 px-4 py-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#93c5fd]">Seu site</p>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white/10 px-3 py-2">
              <span className="truncate text-xs font-semibold text-white">
                {agency.subdomain}.{PROD_DOMAIN}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={copySlug}
                  title="Copiar URL"
                  className="focus-ring rounded p-1 hover:bg-white/10"
                >
                  <Copy className="h-3.5 w-3.5 text-[#bfdbfe]" />
                </button>
                <a
                  href={sitePreviewUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir prévia do site"
                  className="focus-ring rounded p-1 hover:bg-white/10"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#bfdbfe]" />
                </a>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {menu.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-4 py-3 font-bold transition-colors duration-200",
                  isActive ? "bg-white text-[#0f2447]" : "text-[#dbeafe] hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-[#1d4ed8]" : "text-[#bfdbfe]")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1d4ed8] font-bold text-white">
                {activeProfile.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{activeProfile.name}</p>
                <p className="truncate text-xs text-[#bfdbfe]">{activeProfile.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-sm font-bold hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[#bfdbfe] bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1d4ed8]">{agency?.name || "Sistema imobiliário"}</p>
              <h2 className="truncate font-display text-xl font-bold text-[#0f2447] md:text-2xl">{currentMenu.name}</h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              {sitePreviewUrl && (
                <a
                  href={sitePreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[#bfdbfe] px-4 py-3 text-sm font-bold text-[#1d4ed8] hover:bg-[#dbeafe]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver meu site
                </a>
              )}
              <button
                onClick={logout}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#0f2447] px-4 py-3 text-sm font-bold text-white hover:bg-[#1e3a8a]"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
            <button
              onClick={logout}
              className="focus-ring inline-flex rounded-lg p-3 text-[#64748b] hover:bg-[#dbeafe] md:hidden"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <nav className="grid shrink-0 grid-cols-5 border-t border-[#bfdbfe] bg-white p-1 md:hidden">
          {menu.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "focus-ring flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-2 text-[11px] font-bold",
                  isActive ? "bg-[#dbeafe] text-[#1d4ed8]" : "text-[#64748b]"
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
