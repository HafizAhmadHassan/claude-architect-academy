"use client";

import { useSyncExternalStore } from "react";
import { type Bookmark } from "@/lib/bookmarks";

function subscribe(callback: () => void) {
  window.addEventListener("caa-bookmarks", callback);
  return () => window.removeEventListener("caa-bookmarks", callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem("caa-bookmarks-v1") || "[]";
  } catch {
    return "[]";
  }
}

function useBookmarks(): Bookmark[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export { useBookmarks };
