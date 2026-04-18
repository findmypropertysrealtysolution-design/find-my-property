"use client";

import React, { createContext, useContext, useEffect } from "react";
import { api, type Settings } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { SITE_NAME } from "@/lib/branding";

interface SettingsContextType {
  settings: Settings | undefined;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Replace (or create) the `<link rel="icon">` tag so the browser tab updates
 * live when admins upload a new favicon. We prefer mutating an existing link
 * element over appending duplicates to keep the head tidy.
 */
function applyFavicon(url: string | null | undefined) {
  if (typeof document === "undefined") return;
  const head = document.head;
  const existing = head.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (!url) {
    // Nothing to apply — leave whatever the framework rendered as default.
    return;
  }
  if (existing) {
    existing.setAttribute("href", url);
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url;
    head.appendChild(link);
  }
}

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["global-settings"],
    queryFn: api.getSettings,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  }, [settings?.theme]);

  useEffect(() => {
    applyFavicon(settings?.faviconUrl);
  }, [settings?.faviconUrl]);

  // Keep the browser tab label in sync with the admin-provided site name.
  // We only override when a siteName is configured — otherwise leave whatever
  // the page's `<title>` from Next metadata set.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const name = settings?.siteName?.trim();
    if (!name) return;
    // Preserve any per-page prefix from Next's title template (`Something | Site`).
    const current = document.title;
    const separatorIdx = current.lastIndexOf(" | ");
    if (separatorIdx > 0) {
      document.title = `${current.slice(0, separatorIdx)} | ${name}`;
    } else if (current === SITE_NAME || current.trim() === "") {
      document.title = name;
    }
  }, [settings?.siteName]);

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
