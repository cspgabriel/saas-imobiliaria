import { type FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Building2, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import {
  bindUserToAgency,
  createAgency,
  generateUniqueSlug,
  isSlugAvailable,
  slugify,
} from "../../lib/agency";

export function Onboarding() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/landing");
    }
    if (!authLoading && profile?.agencyId) {
      setLocation("/admin");
    }
  }, [authLoading, user, profile?.agencyId, setLocation]);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  useEffect(() => {
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const handle = setTimeout(async () => {
      const ok = await isSlugAvailable(slug);
      setSlugStatus(ok ? "ok" : "taken");
    }, 400);
    return () => clearTimeout(handle);
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      setError("Informe o nome da imobiliária.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      let finalSlug = slug.trim() || (await generateUniqueSlug(name));
      if (!(await isSlugAvailable(finalSlug))) {
        finalSlug = await generateUniqueSlug(name);
      }
      const agency = await createAgency({
        name: name.trim(),
        slug: finalSlug,
        ownerId: user.uid,
      });
      await bindUserToAgency(user.uid, agency.id);
      await refreshProfile();
      setLocation("/admin");
    } catch (err: any) {
      setError(err?.message || "Não foi possível criar a imobiliária. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1d4ed8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2447] via-[#1e3a8a] to-[#1d4ed8] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[#facc15]" />
          Bem-vindo, {profile?.name || user.email}
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
          Vamos configurar sua imobiliária
        </h1>
        <p className="mt-3 text-lg text-[#dbeafe]">
          Em menos de 1 minuto seu site fica no ar com endereço próprio e painel privado.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-white/15 bg-white p-6 shadow-2xl sm:p-8">
          <label className="block">
            <span className="text-sm font-bold text-[#0f2447]">Nome da imobiliária</span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#f8fafc] px-3 focus-within:border-[#1d4ed8]">
              <Building2 className="h-5 w-5 text-[#64748b]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Albuquerque Imóveis"
                autoFocus
                className="focus-ring w-full bg-transparent px-1 py-3 text-[#0f2447] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-[#0f2447]">Endereço do seu site</span>
            <div className="mt-2 flex items-stretch overflow-hidden rounded-lg border border-[#bfdbfe] bg-[#f8fafc] focus-within:border-[#1d4ed8]">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="albuquerque-imoveis"
                className="focus-ring w-full bg-transparent px-3 py-3 text-[#0f2447] outline-none placeholder:text-[#94a3b8]"
              />
              <span className="flex items-center bg-[#dbeafe] px-3 text-sm font-semibold text-[#1d4ed8]">
                .imobisaas.com.br
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              {slugStatus === "checking" && (
                <span className="flex items-center gap-1 text-[#64748b]">
                  <Loader2 className="h-3 w-3 animate-spin" /> Verificando disponibilidade...
                </span>
              )}
              {slugStatus === "ok" && (
                <span className="flex items-center gap-1 font-semibold text-[#16a34a]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Disponível
                </span>
              )}
              {slugStatus === "taken" && (
                <span className="font-semibold text-[#dc2626]">
                  Esse endereço já está em uso. Tente outro.
                </span>
              )}
            </div>
          </label>

          {error && (
            <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fee2e2] px-4 py-3 text-sm font-semibold text-[#dc2626]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || slugStatus === "taken" || slugStatus === "checking" || !name.trim()}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-4 font-bold text-white shadow-sm hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Criando sua conta...
              </>
            ) : (
              <>
                Criar imobiliária e entrar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-[#64748b]">
            Plano grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </form>
      </div>
    </div>
  );
}
