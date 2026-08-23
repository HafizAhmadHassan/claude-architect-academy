"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PracticeQuestion } from "@/lib/content/types";
import { domainMap } from "@/lib/content/domains";
import { ExamResults } from "@/components/exam-results";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ExamEngine({
  questions,
  variant,
}: {
  questions: PracticeQuestion[];
  variant: "mock" | "diagnostic";
}) {
  const isMock = variant === "mock";
  const durationMinutes = isMock ? 60 : 30;

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(durationMinutes * 60);

  const byId = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const submit = useCallback(() => {
    setFinished(true);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          submit();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished, submit]);

  function start() {
    const picked = shuffle(questions);
    setOrder(picked.map((q) => q.id));
    setAnswers({});
    setFlags([]);
    setIndex(0);
    setRemaining(durationMinutes * 60);
    setStarted(true);
    setFinished(false);
  }

  if (!started) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-8 sm:p-10">
        <h2 className="text-xl font-bold">
          {isMock ? "Mock exam rules" : "How the diagnostic works"}
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
          {(isMock
            ? [
                `${questions.length} questions drawn from the full bank · ${durationMinutes} minutes`,
                "No explanations until you finish — just like test day",
                "Flag questions to revisit; navigate freely via the grid",
                "Scaled score estimate shown at the end (100–1000, pass ≈ 720)",
                "Domain breakdown tells you exactly what to restudy",
              ]
            : [
                `${questions.length} questions weighted across all five domains · untimed up to ${durationMinutes} minutes`,
                "Purpose: locate weak domains before you start lessons",
                "Full explanations after submission",
                "Results recommend your study starting point",
              ]
          ).map((rule) => (
            <li key={rule.slice(0, 24)} className="flex gap-3">
              <span aria-hidden className="text-accent">▸</span>
              {rule}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={start}
          className="mt-8 rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {isMock ? "Start mock exam" : "Start diagnostic"}
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <ExamResults
        variant={variant}
        order={order}
        answers={answers}
        byId={byId}
        onRestart={start}
      />
    );
  }

  const current = byId.get(order[index])!;
  const answeredCount = Object.keys(answers).length;
  const domain = domainMap[current.domainId];

  function select(optionId: string) {
    setAnswers((a) => ({ ...a, [current.id]: [optionId] }));
  }

  function toggleFlag() {
    setFlags((f) =>
      f.includes(current.id)
        ? f.filter((id) => id !== current.id)
        : [...f, current.id]
    );
  }

  const lowTime = remaining <= 300;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-5 py-4">
        <span className="font-mono text-lg font-bold">
          Q{index + 1} / {order.length}
        </span>
        <span
          className={`font-mono text-lg font-bold ${
            lowTime ? "text-red-500" : ""
          }`}
          aria-label={`Time remaining ${fmt(remaining)}`}
        >
          ⏱ {fmt(remaining)}
        </span>
        <button
          type="button"
          onClick={toggleFlag}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            flags.includes(current.id)
              ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "border-line text-muted hover:border-accent/50"
          }`}
        >
          {flags.includes(current.id) ? "⚑ Flagged" : "⚐ Flag for review"}
        </button>
      </div>

      <article className="mt-4 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        {"scenario" in current && current.scenario && (
          <p className="mb-4 border-l-2 border-accent/50 pl-4 text-sm italic leading-relaxed text-muted">
            {current.scenario}
          </p>
        )}
        <p className="text-lg font-semibold leading-relaxed">
          {current.question}
        </p>

        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Answer options</legend>
          {current.options.map((opt) => {
            const selected = answers[current.id]?.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-accent/40"
                }`}
              >
                <input
                  type="radio"
                  name={current.id}
                  checked={!!selected}
                  onChange={() => select(opt.id)}
                  className="mt-1 accent-current"
                />
                <span>
                  <strong className="mr-2 font-mono">{opt.id})</strong>
                  {opt.text}
                </span>
              </label>
            );
          })}
        </fieldset>

        <p className="mt-4 text-xs uppercase tracking-widest text-muted">
          Domain {domain.number} · {domain.name}
        </p>
      </article>

      <nav
        aria-label="Question navigation"
        className="mt-4 flex flex-wrap gap-1.5"
      >
        {order.map((qid, i) => {
          const answered = !!answers[qid];
          const flagged = flags.includes(qid);
          return (
            <button
              key={qid}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index}
              className={`h-9 w-9 rounded-lg border text-xs font-semibold transition-colors ${
                i === index
                  ? "border-accent bg-accent-soft text-accent"
                  : flagged
                    ? "border-amber-500/70 text-amber-600 dark:text-amber-400"
                    : answered
                      ? "border-emerald-500/60 text-emerald-600 dark:text-emerald-400"
                      : "border-line text-muted"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="text-sm text-muted">
          {answeredCount} of {order.length} answered
        </span>
        {index === order.length - 1 ? (
          <button
            type="button"
            onClick={submit}
            className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Submit exam
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold hover:border-accent/60"
          >
            Next →
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={submit}
        className="mt-6 w-full rounded-xl border border-red-500/50 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/5"
      >
        End early & grade now
      </button>
    </div>
  );
}
