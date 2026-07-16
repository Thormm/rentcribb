import { createContext, useContext } from "react";

interface DashboardTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardTabContext = createContext<DashboardTabContextType | null>(null);

export const useDashboardTab = () => {
  const ctx = useContext(DashboardTabContext);
  if (!ctx) throw new Error("useDashboardTab must be used within DashboardTabContext.Provider");
  return ctx;
};
