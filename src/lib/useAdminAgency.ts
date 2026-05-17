import { useEffect, useState } from "react";
import { Agency, getAgencyById } from "./agency";
import { useAuth } from "./AuthContext";

export function useAdminAgency() {
  const { profile, loading: authLoading } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    const loadAgency = async () => {
      if (!profile) {
        const demoAgency = await getAgencyById("demo");
        if (!cancelled) {
          setAgency(demoAgency);
          setLoading(false);
        }
        return;
      }

      if (!profile.agencyId) {
        setAgency(null);
        setLoading(false);
        return;
      }

      const ag = await getAgencyById(profile.agencyId);
      if (!cancelled) {
        setAgency(ag);
        setLoading(false);
      }
    };

    setLoading(true);
    loadAgency();

    return () => {
      cancelled = true;
    };
  }, [profile, authLoading]);

  return { agency, loading };
}
