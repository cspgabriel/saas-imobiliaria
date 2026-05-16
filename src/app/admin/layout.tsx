import React from 'react';
import { LayoutDashboard, Users, Home, Settings, LogOut, FileBarChart, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { useAgency } from "../../lib/AgencyContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, profile, logout, login } = useAuth();
  const { agency } = useAgency();

  const menu = [
    { name: "Visão Geral", icon: LayoutDashboard, path: "/admin" },
    { name: "Imóveis", icon: Home, path: "/admin/properties" },
    { name: "CRM & Leads", icon: Users, path: "/admin/crm" },
    { name: "Marketing IA", icon: Sparkles, path: "/admin/marketing" },
    { name: "Relatórios", icon: FileBarChart, path: "/admin/reports" },
  ];

  const activeProfile = profile ?? { name: "Demo", email: "demo@imobiliaria.com", role: "ADMIN" };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl text-white font-black tracking-tight">{agency?.name || "Imobiliária SaaS"}</h1>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{activeProfile.role}</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
              location === item.path 
                ? "bg-blue-600/10 text-blue-400 font-bold" 
                : "hover:bg-slate-800 hover:text-white"
            )}>
              <item.icon className={cn("w-5 h-5", location === item.path ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white">
              {activeProfile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{activeProfile.name}</p>
              <p className="text-xs text-slate-500 truncate">{activeProfile.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5 text-slate-500" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-black text-slate-900">{agency?.name}</h1>
          <button onClick={logout} className="text-slate-500"><LogOut className="w-5 h-5" /></button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 shrink-0 pb-safe">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} className={cn(
              "flex flex-col items-center p-2 rounded-xl text-[10px] font-bold uppercase transition-all",
              location === item.path ? "text-blue-600" : "text-slate-400"
            )}>
              <item.icon className="w-5 h-5 mb-1" />
              {item.name}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
