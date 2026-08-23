"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import type { DomainId, PracticeQuestion } from "@/lib/content/types";
import { domains } from "@/lib/content/domains";
import { updateProgress, type RunRecord } from "@/lib/progress";

function grade(
  order: string[],
  answers: Record<string, string[]>,
  byId: Map<string, PracticeQuestion>
) {
  let correct = 0;
  const perDomain = new Map<DomainId, { total: number; correct: number }>();
  const missed: string[] = [];
  for (const qid of order) {
    const q = byId.get(qid);
    if (!q) continue;
    const entry = perDomain.get(q.domainId) ?? { total: 0, correct: 0 };
    entry.total += 1;
    const ok =
      answers[qid] &&
      answers[qid].length === q.correctOptionIds.length &&
      [...answers[qid]].sort().join() ===
        [...q.correctOptionIds].sort().join();
    if (ok) {
      correct += 1;
      entry.correct += 1;
    } else {
      missed.push(qid);
    }
    perDomain.set(q.domainId, entry);
  }
  return { correct, total: order.length, perDomain, missed };
}

export function ExamResults({
  variant,
  order,
  answers,
  byId,
  onRestart,
}: {
  variant: "mock" | "diagnostic";
  order: string[];
  answers: Record<string, string[]>;
  byId: Map<string, PracticeQuestion>;
  onRestart: () => void;
}) {
  const isMock = variant === "mock";
  const recorded = useRef(false);

  const result = useMemo(() => grade(order, answers, byId), [order, answers, byId]);
  const scaled = Math.round(100 + (result.correct / result.total) * 900);
  const passedEstimate = scaled >= 720;

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    const byDomain: RunRecord["byDomain"] = {};
    for (const [domainId, e] of result.perDomain) {
      byDomain[domainId] = { correct: e.correct, total: e.total };
    }
    const run: RunRecord = {
      date: new Date().toISOString(),
      kind: variant,
      total: result.total,
      correct: result.correct,
      scaledScore: scaled,
      byDomain,
    };
    updateProgress((s) =>
      variant === "diagnostic"
        ? { ...s, diagnostic: run }
        : { ...s, mockRuns: [...s.mockRuns, run] }
    );
  }, [variant, result, scaled]);

  const weakest = useMemo(() => {
    let worst: DomainId | null = null;
    let worstRate = Infinity;
    for (const [domainId, e] of result.perDomain) {
      if (e.total >= 2) {
        const rate = e.correct / e.total;
        if (rate < worstRate) {
          worstRate = rate;
          worst = domainId;
        }
      }
    }
    return worst;
  }, [result]);

  return (
    <div>
      <section className="rounded-2xl border border-line bg-panel p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">
          {isMock ? "Mock exam result" : "Diagnostic result"}
        </p>
        <p className="mt-4 font-mono text-6xl font-bold">
          {result.correct}
          <span className="text-2xl text-muted">/{result.total}</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          {Math.round((result.correct / result.total) * 100)}% raw · estimated
          scaled score{" "}
          <strong className="font-mono">{scaled}</strong> / 1000
        </p>
        <p
          className={`mx-auto mt-5 inline-block rounded-full px-5 py-1.5 text-sm font-semibold ${
            passedEstimate
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isMock
            ? passedEstimate
              ? "Above the 720 pass line — exam-ready trajectory"
              : "Below 720 — targeted review recommended"
            : weakest
              ? "Focus area identified below"
              : "Balanced performance across domains"}
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="mt-8 rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Retake with a fresh shuffle
        </button>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 className="text-lg font-bold">Domain breakdown</h2>
        <ul className="mt-5 space-y-4">
          {domains.map((d) => {
            const e = result.perDomain.get(d.id as DomainId);
            if (!e) return null;
            const pct = Math.round((e.correct / e.total) * 100);
            return (
              <li key={d.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    D{d.number} · {d.name}
                  </span>
                  <span className="font-mono">
                    {e.correct}/{e.total} ({pct}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel-2">
                  <div
                    className={`h-full rounded-full ${d.barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {weakest && (
        <section className="mt-8 rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
          <h2 className="font-semibold">Recommended next step</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your weakest domain here was{" "}
            <strong>Domain {domains.find((d) => d.id === weakest)!.number}</strong>.
            Review its lessons and labs, then retake.
          </p>
          <Link
            href={`/domains/${weakest}`}
            className="mt-4 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Open Domain {domains.find((d) => d.id === weakest)!.number} →
          </Link>
        </section>
      )}

      <ReviewList
        order={order}
        answers={answers}
        byId={byId}
        showAll={!isMock}
      />
    </div>
  );
}

function ReviewList({
  order,
  answers,
  byId,
  showAll,
}: {
  order: string[];
  answers: Record<string, string[]>;
  byId: Map<string, PracticeQuestion>;
  showAll: boolean;
}) {
  const missed = order.filter((qid) => {
    const q = byId.get(qid);
    if (!q) return false;
    return !(
      answers[qid] &&
      answers[qid].length === q.correctOptionIds.length &&
      [...answers[qid]].sort().join() === [...q.correctOptionIds].sort().join()
    );
  });
  const ids = showAll ? order : missed;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">
        {showAll ? "Full review" : `Missed questions (${missed.length})`}
      </h2>
      {ids.length === 0 ? (
        <p className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5 text-sm text-emerald-700 dark:text-emerald-400">
          Perfect run — nothing to review.
        </p>
      ) : (
        <ol className="mt-4 space-y-4">
          {ids.map((qid) => {
            const q = byId.get(qid)!;
            const given = answers[qid];
            const ok =
              given &&
              given.length === q.correctOptionIds.length &&
              [...given].sort().join() ===
                [...q.correctOptionIds].sort().join();
            return (
              <li
                key={qid}
                className={`rounded-xl border p-5 ${
                  ok
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted">
                  {ok ? "✓ Correct" : "✗ Missed"} ·{" "}
                  {q.principle ? "" : ""}
                </p>
                {"scenario" in q && q.scenario && (
                  <p className="mt-2 text-sm italic leading-relaxed text-muted">
                    {q.scenario}
                  </p>
                )}
                <p className="mt-2 font-medium">{q.question}</p>
                <p className="mt-3 text-sm text-muted">
                  <strong className="text-foreground">Why:</strong>{" "}
                  {q.explanation}
                </p>
                {q.principle && (
                  <p className="mt-3 border-l-2 border-blue pl-3 text-sm italic">
                    Principle: {q.principle}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
