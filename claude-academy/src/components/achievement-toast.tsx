"use client";

import { useEffect, useRef } from "react";
import { checkNewAchievements, type Achievement } from "@/lib/achievements";
import { loadProgress } from "@/lib/progress";

export function AchievementToast() {
  const toastRef = useRef<Achievement | null>(null);
  const queueRef = useRef<Achievement[]>([]);
  const elRef = useRef<HTMLDivElement>(null);

  function showNext() {
    if (toastRef.current || queueRef.current.length === 0) return;
    const next = queueRef.current.shift()!;
    toastRef.current = next;
    if (elRef.current) {
      elRef.current.innerHTML = `
        <div class="flex items-center gap-3 rounded-2xl border border-accent/40 bg-panel p-4 shadow-lg">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-white">${next.icon}</div>
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-accent">Achievement Unlocked!</p>
            <p class="mt-0.5 font-semibold">${next.title}</p>
            <p class="text-xs text-muted">${next.description}</p>
          </div>
        </div>
      `;
      elRef.current.style.display = "block";
    }
    setTimeout(() => {
      toastRef.current = null;
      if (elRef.current) elRef.current.style.display = "none";
      showNext();
    }, 4000);
  }

  useEffect(() => {
    function check() {
      const progress = loadProgress();
      const newOnes = checkNewAchievements(progress);
      if (newOnes.length > 0) {
        queueRef.current = [...queueRef.current, ...newOnes];
        showNext();
      }
    }

    check();
    window.addEventListener("caa-progress", check);
    return () => {
      window.removeEventListener("caa-progress", check);
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="fixed bottom-6 right-6 z-50 animate-slide-up"
      style={{ display: "none" }}
    />
  );
}
