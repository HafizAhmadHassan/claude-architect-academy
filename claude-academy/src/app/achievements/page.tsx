"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useAchievedIds } from "@/lib/achievements-react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";

const categoryLabels: Record<Achievement["category"], string> = {
  learning: "Learning",
  practice: "Practice",
  streak: "Streaks",
  special: "Special",
};

const categoryColors: Record<Achievement["category"], string> = {
  learning: "text-accent",
  practice: "text-blue",
  streak: "text-amber-500",
  special: "text-emerald-500",
};

export default function AchievementsPage() {
  const earned = useAchievedIds();
  const categories = ["learning", "practice", "streak", "special"] as const;

  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="Your Achievements"
        intro={`${earned.size} of ${ACHIEVEMENTS.length} badges earned. Complete lessons, ace practice tests, and maintain study streaks to unlock them all.`}
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {categories.map((cat) => {
          const items = ACHIEVEMENTS.filter((a) => a.category === cat);
          return (
            <div key={cat} className="mb-10">
              <h2
                className={`text-sm font-bold uppercase tracking-widest ${categoryColors[cat]}`}
              >
                {categoryLabels[cat]}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => {
                  const isEarned = earned.has(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`relative rounded-xl border p-5 transition-colors ${
                        isEarned
                          ? "border-accent/40 bg-accent-soft"
                          : "border-line bg-panel opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                            isEarned
                              ? "bg-accent text-white"
                              : "bg-panel-2 text-muted"
                          }`}
                        >
                          {a.icon}
                        </div>
                        <div>
                          <p className="font-semibold">{a.title}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {a.description}
                          </p>
                        </div>
                      </div>
                      {isEarned && (
                        <span className="absolute right-3 top-3 text-xs font-bold text-accent">
                          ✓ Earned
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent-soft p-6 text-center">
          <p className="text-sm text-muted">
            Keep learning and practicing to unlock all achievements!{" "}
            <Link href="/progress" className="font-medium text-accent hover:underline">
              View your progress
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
