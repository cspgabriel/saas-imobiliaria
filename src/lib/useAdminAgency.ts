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
    if (!profile?.agencyId) {
      setAgency(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getAgencyById(profile.agencyId).then((ag) => {
      if (!cancelled) {
        setAgency(ag);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [profile?.agencyId, authLoading]);

  return { agency, loading };
}
