"use client";

import { useState } from "react";
import type { ArchitectureScenario } from "@/lib/content/types";

export function ScenarioPlayer({ scenario }: { scenario: ArchitectureScenario }) {
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const chosen = scenario.choices.find((c) => c.id === choiceId);
  const isCorrect = choiceId === scenario.correctChoiceId;

  return (
    <article className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2" aria-label="Scenario briefing">
        <div className="rounded-xl border border-line bg-panel p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
            Business requirement
          </h3>
          <p className="mt-2 text-sm leading-relaxed">
            {scenario.businessRequirement}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-panel p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-blue">
            Technical constraints
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
            {scenario.technicalConstraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <h3 className="text-xl font-semibold">{scenario.question}</h3>

      <fieldset className="space-y-3" aria-label="Architecture choices">
        <legend className="sr-only">Choose an architecture</legend>
        {scenario.choices.map((c) => {
          const picked = choiceId === c.id;
          const revealCorrect = choiceId !== null && c.id === scenario.correctChoiceId;
          const cls =
            choiceId === null
              ? "border-line hover:border-muted hover:bg-panel-2"
              : revealCorrect
                ? "border-emerald-500/70 bg-emerald-500/10"
                : picked
                  ? "border-red-500/70 bg-red-500/10"
                  : "border-line opacity-60";
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={choiceId !== null}
              onClick={() => setChoiceId(c.id)}
              className={`block w-full rounded-xl border p-5 text-left text-sm leading-relaxed transition-colors ${cls}`}
            >
              <span className="mr-3 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current font-mono text-xs font-bold">
                {c.id.toUpperCase()}
              </span>
              {c.text}
            </button>
          );
        })}
      </fieldset>

      {choiceId !== null && (
        <section aria-live="polite" className="space-y-5">
          <p
            className={`rounded-xl border p-5 font-semibold ${
              isCorrect
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-500"
                : "border-red-500/60 bg-red-500/10 text-red-500"
            }`}
          >
            {isCorrect
              ? `Correct — option ${chosen?.id.toUpperCase()}.`
              : `Option ${chosen?.id.toUpperCase()} is not the strongest architecture.`}
          </p>

          <div className="rounded-xl border border-line bg-panel p-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Why every option lands where it does
            </h4>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {scenario.choices.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                      c.id === scenario.correctChoiceId
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-panel-2 text-muted"
                    }`}
                  >
                    {c.id.toUpperCase()}
                  </span>
                  <span className="text-muted">{scenario.choiceExplanations[c.id]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-l-4 border-accent bg-accent-soft p-5">
            <p className="text-sm leading-relaxed text-foreground/90">
              {scenario.explanation}
            </p>
          </div>

          <p className="rounded-xl border border-blue/40 bg-blue/10 p-5 text-sm">
            <strong>Architectural principle.</strong> {scenario.architecturalPrinciple}
          </p>
        </section>
      )}
    </article>
  );
}
