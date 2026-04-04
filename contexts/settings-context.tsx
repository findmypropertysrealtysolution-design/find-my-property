"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, type Settings } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface SettingsContextType {
  settings: Settings | undefined;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["global-settings"],
    queryFn: api.getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Apply theme to document
  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
      // You can also add logic here to inject specific CSS variables if needed
    }
  }, [settings?.theme]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
