"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ride_lanka_app_mode";

const AppModeContext = createContext(null);

export function AppModeProvider({ children }) {
  const [mode, setModeState] = useState("traveler");

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(STORAGE_KEY);
      if (s === "guide" || s === "traveler") setModeState(s);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = useCallback((m) => {
    const next = m === "guide" ? "guide" : "traveler";
    setModeState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = {
    mode,
    setMode,
    isGuideMode: mode === "guide",
  };

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>;
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    return { mode: "traveler", setMode: () => {}, isGuideMode: false };
  }
  return ctx;
}
