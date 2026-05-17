import { useEffect, useState } from "react";
import { Agency, getAgencyBySlug } from "./agency";
import { useAgency } from "./AgencyContext";

export function useResolvedAgency(slug?: string) {
  const hostnameResult = useAgency();
  const [slugAgency, setSlugAgency] = useState<Agency | null>(null);
  const [slugLoading, setSlugLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) return;
    setSlugLoading(true);
    getAgencyBySlug(slug).then((ag) => {
      setSlugAgency(ag);
      setSlugLoading(false);
    });
  }, [slug]);

  if (slug) {
    return { agency: slugAgency, loading: slugLoading };
  }
  return hostnameResult;
}
