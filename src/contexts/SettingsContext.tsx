
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSettings, AppearanceSettings } from "@/utils/settingsUtils";

type SettingsContextType = {
  appearanceSettings: AppearanceSettings | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      if (settings && settings.appearance) {
        setAppearanceSettings(settings.appearance);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError(err instanceof Error ? err : new Error("Failed to load settings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Listen for settings update events
    const handleSettingsUpdated = () => {
      console.log("Settings update detected, refreshing settings");
      fetchSettings();
    };
    
    window.addEventListener('settings-updated', handleSettingsUpdated);
    
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdated);
    };
  }, []);

  return (
    <SettingsContext.Provider 
      value={{ 
        appearanceSettings, 
        loading, 
        error, 
        refetch: fetchSettings 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
