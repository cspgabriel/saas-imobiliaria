import { useAgency } from "../lib/AgencyContext";
import { Landing } from "./landing/page";
import { Home } from "./(public)/page";

const MARKETING_HOSTS = ["localhost", "127.0.0.1"];

function isMarketingHost(hostname: string): boolean {
  if (MARKETING_HOSTS.includes(hostname)) return true;
  if (hostname.endsWith(".vercel.app")) return true;
  if (hostname.endsWith(".run.app")) return true;
  if (hostname.endsWith(".github.io")) return true;
  // Apex domain (no customer subdomain) — e.g. "imobisaas.com.br" or "www.imobisaas.com.br"
  const parts = hostname.split(".");
  if (parts[0] === "www") return true;
  if (parts.length <= 2) return true;
  return false;
}

export function RootRoute() {
  const { agency, loading } = useAgency();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  if (isMarketingHost(hostname)) {
    return <Landing />;
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] text-sm font-semibold text-[#1d4ed8]">Carregando...</div>;
  }

  if (agency) {
    return <Home />;
  }

  return <Landing />;
}
