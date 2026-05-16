import React, { createContext, useContext, useEffect, useState } from 'react';
import { Agency, getAgencyByHost } from './agency';

interface AgencyContextProps {
  agency: Agency | null;
  loading: boolean;
}

const AgencyContext = createContext<AgencyContextProps>({ agency: null, loading: true });

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgencyByHost(window.location.hostname).then((ag) => {
      setAgency(ag);
      setLoading(false);
    });
  }, []);

  return (
    <AgencyContext.Provider value={{ agency, loading }}>
      {children}
    </AgencyContext.Provider>
  );
}

export const useAgency = () => useContext(AgencyContext);
