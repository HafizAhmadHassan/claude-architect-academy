"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import type { User } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
});

function subscribeSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionSnapshot(): string {
  try {
    return localStorage.getItem("caa-session-v1") || "";
  } catch {
    return "";
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => "");
  const [, setTick] = useState(0);

  const user: User | null = raw ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : null;

  function refresh() {
    setTick((t) => t + 1);
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
