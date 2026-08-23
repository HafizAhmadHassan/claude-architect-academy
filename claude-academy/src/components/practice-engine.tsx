"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DomainId, PracticeQuestion } from "@/lib/content/types";
import { domainMap, domains } from "@/lib/content/domains";
import { updateProgress, type RunRecord } from "@/lib/progress";
import { Badge } from "@/components/ui";

type Filter = "all" | DomainId;
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

interface AnswerState {
  selected: string[];
  checked: boolean;
}

export function PracticeEngine({ questions }: { questions: PracticeQuestion[] }) {
  const [domainFilter, setDomainFilter] = useState<Filter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [finished, setFinished] = useState(false);

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (domainFilter === "all" || q.domainId === domainFilter) &&
          (difficultyFilter === "all" || q.difficulty === difficultyFilter)
      ),
    [questions, domainFilter, difficultyFilter]
  );

  const question = filtered[index];

  if (finished) {
    return <Results questions={filtered} answers={answers} onRestart={() => {
      setAnswers({});
      setFinished(false);
      setIndex(0);
    }} />;
  }

  if (!question) {
    return (
      <p className="rounded-xl border border-line bg-panel p-8 text-center text-muted">
        No practice questions match these filters yet.
      </p>
    );
  }

  const state = answers[question.id] ?? { selected: [], checked: false };
  const isMulti = question.correctOptionIds.length > 1;

  function select(optionId: string) {
    if (state.checked) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...state,
        selected: isMulti
          ? state.selected.includes(optionId)
            ? state.selected.filter((o) => o !== optionId)
            : [...state.selected, optionId]
          : [optionId],
      },
    }));
  }

  function check() {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { ...state, checked: true },
    }));
  }

  function next() {
    if (index + 1 >= filtered.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const correct =
    state.checked &&
    question.correctOptionIds.length === state.selected.length &&
    question.correctOptionIds.every((id) => state.selected.includes(id));

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside aria-label="Question filters and progress" className="space-y-5">
        <div className="rounded-xl border border-line bg-panel p-4">
          <label htmlFor="f-domain" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Domain
          </label>
          <select
            id="f-domain"
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value as Filter);
              setIndex(0);
            }}
            className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
          >
            <option value="all">All domains</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number}. {d.name}
              </option>
            ))}
          </select>

          <label htmlFor="f-difficulty" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
            Difficulty
          </label>
          <select
            id="f-difficulty"
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value as DifficultyFilter);
              setIndex(0);
            }}
            className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
          >
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <ol className="flex flex-wrap gap-1.5" aria-label="Question progress">
          {filtered.map((q, i) => {
            const a = answers[q.id];
            const status = !a ? "untouched" : a.checked ? (q.correctOptionIds.every(id => a.selected.includes(id)) && q.correctOptionIds.length === a.selected.length ? "correct" : "wrong") : "seen";
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-7 w-7 rounded-md border text-xs font-medium ${
                    i === index
                      ? "border-accent bg-accent-soft text-accent"
                      : status === "correct"
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-500"
                        : status === "wrong"
                          ? "border-red-500/50 bg-red-500/15 text-red-500"
                          : "border-line bg-panel text-muted"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <article className="rounded-xl border border-line bg-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{domainMap[question.domainId].name}</Badge>
          <Badge>{question.difficulty}</Badge>
          <Badge>{formatType(question.type)}</Badge>
          {isMulti && <Badge tone="blue">Select {question.correctOptionIds.length}</Badge>}
        </div>

        {question.scenario && (
          <p className="mt-5 rounded-lg border-l-4 border-accent bg-panel-2 p-4 text-sm leading-relaxed text-muted">
            {question.scenario}
          </p>
        )}

        <h3 className="mt-5 text-lg font-semibold leading-snug">
          {index + 1}. {question.question}
        </h3>

        <fieldset className="mt-5 space-y-2.5">
          <legend className="sr-only">Answer options</legend>
          {question.options.map((opt) => {
            const selected = state.selected.includes(opt.id);
            const reveal = state.checked;
            const isCorrectOpt = question.correctOptionIds.includes(opt.id);
            const cls = reveal
              ? isCorrectOpt
                ? "border-emerald-500/60 bg-emerald-500/10"
                : selected
                  ? "border-red-500/60 bg-red-500/10"
                  : "border-line opacity-70"
              : selected
                ? "border-accent bg-accent-soft"
                : "border-line hover:border-muted";
            return (
              <button
                key={opt.id}
                type="button"
                role={isMulti ? "checkbox" : "radio"}
                aria-checked={selected}
                onClick={() => select(opt.id)}
                className={`block w-full rounded-lg border p-4 text-left text-sm transition-colors ${cls}`}
              >
                <span className="mr-2 font-mono font-semibold text-accent">
                  {opt.id.toUpperCase()}.
                </span>
                {opt.text}
              </button>
            );
          })}
        </fieldset>

        {state.checked && (
          <div className="mt-6 space-y-4" aria-live="polite">
            <p
              className={`rounded-lg border p-4 text-sm font-semibold ${
                correct
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-500"
                  : "border-red-500/60 bg-red-500/10 text-red-500"
              }`}
            >
              {correct ? "Correct." : "Not quite."}{" "}
              <span className="font-normal text-foreground">
                {question.explanation}
              </span>
            </p>
            {!correct && (
              <ul className="space-y-2 text-sm">
                {question.options.map((o) => (
                  <li key={o.id} className="text-muted">
                    <span className="font-mono font-semibold">{o.id.toUpperCase()}:</span>{" "}
                    {question.optionExplanations[o.id]}
                  </li>
                ))}
              </ul>
            )}
            <p className="rounded-lg border border-blue/30 bg-blue/10 p-4 text-sm">
              <strong>Architect’s principle.</strong> {question.principle}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Question {index + 1} of {filtered.length} · Practice question — not
            an official Anthropic exam question.
          </p>
          <div className="flex gap-2">
            {!state.checked && (
              <button
                type="button"
                onClick={check}
                disabled={state.selected.length === 0}
                className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              >
                Check answer
              </button>
            )}
            {state.checked && (
              <button
                type="button"
                onClick={next}
                className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white"
              >
                {index + 1 >= filtered.length ? "See results" : "Next question"}
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function Results({
  questions,
  answers,
  onRestart,
}: {
  questions: PracticeQuestion[];
  answers: Record<string, AnswerState>;
  onRestart: () => void;
}) {
  const answered = questions.filter((q) => answers[q.id]?.checked);
  const score = answered.filter(
    (q) =>
      q.correctOptionIds.length === (answers[q.id]?.selected.length ?? 0) &&
      q.correctOptionIds.every((id) => answers[q.id].selected.includes(id))
  );

  const recordedRef = useRef(false);
  useEffect(() => {
    if (recordedRef.current || answered.length === 0) return;
    recordedRef.current = true;
    const byDomain: RunRecord["byDomain"] = {};
    for (const q of answered) {
      const ok =
        q.correctOptionIds.length === answers[q.id].selected.length &&
        q.correctOptionIds.every((id) => answers[q.id].selected.includes(id));
      const entry = byDomain[q.domainId] ?? { correct: 0, total: 0 };
      byDomain[q.domainId] = {
        correct: entry.correct + (ok ? 1 : 0),
        total: entry.total + 1,
      };
    }
    updateProgress((s) => ({
      ...s,
      practiceRuns: [
        ...s.practiceRuns,
        {
          date: new Date().toISOString(),
          total: answered.length,
          correct: score.length,
          byDomain,
        },
      ],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byDomain = domains.map((d) => {
    const qs = answered.filter((q) => q.domainId === d.id);
    const right = qs.filter(
      (q) =>
        q.correctOptionIds.length === answers[q.id].selected.length &&
        q.correctOptionIds.every((id) => answers[q.id].selected.includes(id))
    );
    return {
      domain: d,
      total: qs.length,
      pct: qs.length ? Math.round((right.length / qs.length) * 100) : null,
    };
  }).filter((r) => r.total > 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl border border-line bg-panel p-8 text-center">
        <p className="text-sm uppercase tracking-widest text-muted">Your score</p>
        <p className="mt-2 text-5xl font-bold text-accent">
          {score.length}/{answered.length}
        </p>
        <p className="mt-2 text-sm text-muted">
          Practice only — this does not predict your real exam result.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 rounded-lg border border-line px-5 py-2.5 text-sm font-semibold hover:bg-panel-2"
        >
          Restart set
        </button>
      </div>

      <div className="rounded-xl border border-line bg-panel p-6">
        <h3 className="font-semibold">Domain breakdown</h3>
        <ul className="mt-4 space-y-3">
          {byDomain.map((r) => (
            <li key={r.domain.id} className="flex items-center gap-3 text-sm">
              <span className="w-44 shrink-0 truncate text-muted">
                {r.domain.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-2">
                <div
                  className={`h-full rounded-full ${r.domain.barClass}`}
                  style={{ width: `${(r.pct ?? 0)}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono">{r.pct ?? 0}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-lg bg-panel-2 p-4 text-sm text-muted">
          Recommended next step: revisit lessons in your weakest domain above,
          then run a fresh filtered set.
        </p>
      </div>
    </div>
  );
}

function formatType(t: PracticeQuestion["type"]) {
  return t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
