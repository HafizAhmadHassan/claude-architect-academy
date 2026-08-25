"use client";

import { useSyncExternalStore } from "react";
import { type Note } from "@/lib/notes";

function subscribe(callback: () => void) {
  window.addEventListener("caa-notes", callback);
  return () => window.removeEventListener("caa-notes", callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem("caa-notes-v1") || "[]";
  } catch {
    return "[]";
  }
}

function useNotes(): Note[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export { useNotes };
