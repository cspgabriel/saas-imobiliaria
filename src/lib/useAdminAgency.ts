import { useEffect, useState } from "react";
import { Agency, getAgencyById } from "./agency";
import { useAuth } from "./AuthContext";

export function useAdminAgency() {
  const { profile, loading: authLoading } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const hasProfile = Boolean(profile);
  const agencyId = profile?.agencyId;

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    const loadAgency = async () => {
      try {
        if (!hasProfile) {
          const demoAgency = await getAgencyById("demo");
          if (!demoAgency) {
            console.warn('Agência demo "demo" não encontrada para acesso admin sem autenticação.');
          }
          if (!cancelled) {
            setAgency(demoAgency);
            setLoading(false);
          }
          return;
        }

        if (!agencyId) {
          setAgency(null);
          setLoading(false);
          return;
        }

        const ag = await getAgencyById(agencyId);
        if (!cancelled) {
          setAgency(ag);
          setLoading(false);
        }
      } catch (err) {
        console.error("Falha ao carregar agência admin.", err);
        if (!cancelled) {
          setAgency(null);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadAgency();

    return () => {
      cancelled = true;
    };
  }, [hasProfile, agencyId, authLoading]);

  return { agency, loading };
}
