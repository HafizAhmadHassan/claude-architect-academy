"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { domains } from "@/lib/content/domains";
import { lessons, lessonCountByDomain } from "@/lib/content/lessons";
import { weeklyTasks } from "@/lib/content/weekly-tasks";
import { flashcards } from "@/lib/content/flashcards";
import {
  computeReadiness,
  computeStreak,
  loadProgress,
  type ProgressState,
} from "@/lib/progress";

const WEIGHTS: Record<string, number> = {
  "agentic-architecture": 0.27,
  "tool-design-mcp": 0.18,
  "claude-code-workflows": 0.2,
  "prompt-engineering": 0.2,
  "context-reliability": 0.15,
};

export function ProgressDashboard() {
  const [state, setState] = useState<ProgressState | null>(null);

  useEffect(() => {
    function sync() {
      setState(loadProgress());
    }
    sync();
    window.addEventListener("caa-progress", sync);
    return () => window.removeEventListener("caa-progress", sync);
  }, []);

  const data = useMemo(() => {
    if (!state) return null;
    const streak = computeStreak(state.activeDays);
    const readinessList = computeReadiness(
      state,
      domains.map((d) => d.id),
      lessonCountByDomain
    );
    const readiness: Record<string, number> = {};
    for (const r of readinessList) readiness[r.domainId] = r.pct ?? 0;
    const overall = Math.round(
      domains.reduce((sum, d) => sum + readiness[d.id] * (WEIGHTS[d.id] ?? 0.2), 0)
    );
    const lastMock = state.mockRuns[state.mockRuns.length - 1];
    return { streak, readiness, overall, lastMock };
  }, [state]);

  if (!state || !data) {
    return (
      <p className="rounded-2xl border border-line bg-panel p-8 text-center text-muted">
        Loading your progress…
      </p>
    );
  }

  const weakest = domains.reduce((a, b) =>
    data.readiness[a.id] <= data.readiness[b.id] ? a : b
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall readiness" value={`${data.overall}%`} />
        <StatCard
          label="Lessons completed"
          value={`${state.completedLessons.length} / ${lessons.length}`}
          href="/domains"
        />
        <StatCard
          label="Weekly tasks done"
          value={`${state.completedTasks.length} / ${weeklyTasks.length}`}
          href="/roadmap"
        />
        <StatCard label="Study streak" value={`${data.streak} day${data.streak === 1 ? "" : "s"}`} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Practice questions answered"
          value={String(
            state.practiceRuns.reduce((sum, r) => sum + r.total, 0)
          )}
          href="/practice"
        />
        <StatCard
          label="Mock exams taken"
          value={String(state.mockRuns.length)}
          href="/mock-exam"
        />
        <StatCard
          label="Flashcards known"
          value={`${Object.values(state.flashcards).filter((s) => s === "known").length} / ${flashcards.length}`}
          href="/flashcards"
        />
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 className="text-lg font-bold">Domain readiness</h2>
        <ul className="mt-5 space-y-4">
          {domains.map((d) => (
            <li key={d.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  D{d.number} · {d.name}
                  <span className="ml-2 text-xs text-muted">
                    ({Math.round((WEIGHTS[d.id] ?? 0.2) * 100)}% of exam)
                  </span>
                </span>
                <span className="font-mono">{Math.round(data.readiness[d.id])}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-panel-2">
                <div
                  className={`h-full rounded-full ${d.barClass}`}
                  style={{ width: `${data.readiness[d.id]}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Readiness blends lesson completion with your latest exam-engine scores,
          weighted by official domain weights.
        </p>
      </section>

      {data.lastMock && (
        <section className="mt-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-lg font-bold">Latest exam-engine run</h2>
          <p className="mt-3 text-sm text-muted">
            {new Date(data.lastMock.date).toLocaleDateString()} ·{" "}
            {data.lastMock.kind === "mock" ? "Mock exam" : "Diagnostic"} ·{" "}
            {data.lastMock.correct}/{data.lastMock.total} correct · estimated
            scaled score{" "}
            <strong className="font-mono text-foreground">
              {data.lastMock.scaledScore}
            </strong>{" "}
            / 1000 (pass ≈ 720)
          </p>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
        <h2 className="font-semibold">Recommended next step</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your weakest area right now is{" "}
          <strong>Domain {weakest.number}</strong>. Review its lessons, then take a
          filtered practice set.
        </p>
        <Link
          href={`/domains/${weakest.id}`}
          className="mt-4 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Open Domain {weakest.number} →
        </Link>
      </section>

      {state.practiceRuns.length > 0 && (
        <section className="mt-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-lg font-bold">Recent practice runs</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[...state.practiceRuns]
              .slice(-5)
              .reverse()
              .map((r, i) => (
                <li
                  key={`${r.date}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-panel-2 px-4 py-2.5"
                >
                  <span className="text-muted">
                    {new Date(r.date).toLocaleString()}
                  </span>
                  <span className="font-mono">
                    {r.correct}/{r.total}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("caa-progress-v1");
          window.dispatchEvent(new Event("caa-progress"));
        }}
        className="mt-10 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/5"
      >
        Reset all local progress
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </>
  );
  return href ? (
    <Link
      href={href}
      className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/50"
    >
      {body}
    </Link>
  ) : (
    <div className="rounded-2xl border border-line bg-panel p-6">{body}</div>
  );
}
