"use client";

import { useEffect, useState } from "react";
import { loadProgress, updateProgress } from "@/lib/progress";

export function useCompleted(key: string, list: "completedLessons" | "completedTasks") {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sync = () =>
      setDone(loadProgress()[list].includes(key));
    sync();
    window.addEventListener("caa-progress", sync);
    return () => window.removeEventListener("caa-progress", sync);
  }, [key, list]);

  function toggle() {
    updateProgress((s) => {
      const current = s[list];
      return {
        ...s,
        [list]: done
          ? current.filter((k) => k !== key)
          : [...current, key],
      } as typeof s;
    });
  }

  return { done, toggle };
}

export function MarkCompleteButton({ storageKey }: { storageKey: string }) {
  const { done, toggle } = useCompleted(storageKey, "completedLessons");
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
        done
          ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-500"
          : "border-line hover:border-accent/60 hover:text-accent"
      }`}
    >
      {done ? "✓ Completed" : "Mark lesson complete"}
    </button>
  );
}
