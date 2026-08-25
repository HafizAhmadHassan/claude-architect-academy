"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("caa-achievements", callback);
  return () => window.removeEventListener("caa-achievements", callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem("caa-achievements-v1") || "[]";
  } catch {
    return "[]";
  }
}

function useAchievedIds(): Set<string> {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export { useAchievedIds };
