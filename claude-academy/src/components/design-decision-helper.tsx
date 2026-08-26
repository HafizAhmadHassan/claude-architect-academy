"use client";

import { useMemo, useState } from "react";

type Answer = "yes" | "no" | "unsure";

interface Question {
  id: string;
  text: string;
  help: string;
  options: { value: Answer; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Could one well-crafted LLM call with retrieval and examples solve this reliably?",
    help: "Anthropic's guidance: optimize single calls before adding agentic complexity.",
    options: [
      { value: "yes", label: "Yes, a single call gets it done" },
      { value: "no", label: "No — it needs multiple steps or tools" },
    ],
  },
  {
    id: "q2",
    text: "Can you enumerate the subtasks / steps in advance?",
    help: "If yes, a workflow with predefined code paths gives predictability and auditability.",
    options: [
      { value: "yes", label: "Yes, the steps are predictable" },
      { value: "no", label: "No — steps depend on what we find" },
    ],
  },
  {
    id: "q3",
    text: "Why do the subtasks need separate LLM calls?",
    help: "Different input types → routing. Independent aspects or voting → parallelization. Quality gates between stages → chaining.",
    options: [
      { value: "yes", label: "Inputs fall into categories needing different handling" },
      { value: "no", label: "Aspects are independent and can run concurrently" },
      { value: "unsure", label: "Each stage must pass a check before the next runs" },
    ],
  },
  {
    id: "q4",
    text: "Can your code verify progress programmatically at each step?",
    help: "Agents need ground truth from tool results to assess their own progress. Without verifiable signals, do not build an agent yet.",
    options: [
      { value: "yes", label: "Yes — tools/tests return checkable observations" },
      { value: "no", label: "Not reliably" },
    ],
  },
];

interface Recommendation {
  title: string;
  tone: string;
  rationale: string;
  examTip: string;
}

export function DesignDecisionHelper() {
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]).length;

  const rec: Recommendation | null = useMemo(() => {
    const { q1, q2, q3, q4 } = answers as Record<string, Answer | undefined>;
    if (!q1) return null;
    if (q1 === "yes") {
      return {
        title: "Single LLM call + retrieval",
        tone: "border-emerald-500/40 bg-emerald-500/5",
        rationale:
          "The simplest thing that works. Most applications don't need an agentic system — optimize prompts, add retrieval and few-shot examples, and measure. Complexity only earns its keep when it demonstrably improves outcomes.",
        examTip: "Exam scenarios reward choosing the least complex architecture that meets the requirement.",
      };
    }
    if (q2 === null || q2 === undefined) return null;
    if (q2 === "yes") {
      if (!q3) return null;
      const byQ3: Record<string, Recommendation> = {
        yes: {
          title: "Routing workflow",
          tone: "border-sky-500/40 bg-sky-500/5",
          rationale:
            "Classify the input once, then dispatch to specialized per-category prompts. Separation of concerns keeps each path tunable without degrading the others.",
          examTip: "Routing shines when one general prompt would be mediocre for every category.",
        },
        no: {
          title: "Parallelization workflow",
          tone: "border-amber-500/40 bg-amber-500/5",
          rationale:
            "Sectioning: split independent aspects across concurrent LLM calls and aggregate. Use voting instead when you need higher confidence on the same task.",
          examTip: "Parallelization trades cost for latency and confidence — subtasks must be genuinely independent.",
        },
        unsure: {
          title: "Prompt chaining workflow",
          tone: "border-violet-500/40 bg-violet-500/5",
          rationale:
            "A fixed pipeline where each call handles one subtask, with programmatic gates between steps to fail fast when intermediate output is off-track.",
          examTip: "Gates between chain steps are the classic answer for catching drift early.",
        },
      };
      return byQ3[q3] ?? null;
    }
    if (q2 === "no") {
      if (!q4) return null;
      if (q4 === "no") {
        return {
          title: "Don't build the agent yet",
          tone: "border-red-500/40 bg-red-500/5",
          rationale:
            "An agent needs ground truth at every step to steer itself. If progress can't be verified programmatically, first design observable tools/checks — otherwise you get confident looping, not autonomy.",
          examTip: "'Add verification before autonomy' is the intended answer when observability is missing.",
        };
      }
      return {
        title: "Autonomous agent loop",
        tone: "border-accent/40 bg-accent-soft",
        rationale:
          "Unpredictable path + verifiable per-step progress = the agent case. Let Claude direct its own tool use, feed every observation back, gate risky actions with human approval, and cap the exit with turn/token/time budgets.",
        examTip: "Always pair autonomy with stop conditions and budgets — unbounded loops are the trap answer.",
      };
    }
    return null;
  }, [answers]);

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <h3 className="font-bold">Workflow vs. agent decision helper</h3>
      <p className="text-sm text-muted">
        Four questions from Anthropic&apos;s &ldquo;Building Effective Agents&rdquo; decision flow.
      </p>

      <ol className="mt-5 space-y-4">
        {QUESTIONS.map((q, qi) => (
          <li
            key={q.id}
            className={`rounded-lg border p-4 transition-opacity ${
              isReachable(qi, answers) ? "border-line" : "border-line opacity-40"
            }`}
          >
            <p className="text-sm font-medium">
              <span className="mr-1.5 font-mono text-xs text-accent">{qi + 1}.</span>
              {q.text}
            </p>
            <p className="mt-1 text-xs text-muted">{q.help}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.value;
                return (
                  <button
                    key={o.value + o.label}
                    type="button"
                    disabled={!isReachable(qi, answers)}
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = { ...prev, [q.id]: prev[q.id] === o.value ? undefined : o.value };
                        if (prev[q.id] !== o.value && qi > 0) {
                          for (let j = qi + 1; j < QUESTIONS.length; j++) next[QUESTIONS[j].id] = undefined;
                        }
                        return next;
                      })
                    }
                    aria-pressed={selected}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line bg-background text-muted hover:border-accent/50 hover:text-foreground"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 min-h-[110px]" aria-live="polite">
        {rec ? (
          <div className={`animate-slide-up rounded-xl border p-5 ${rec.tone}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Recommendation</p>
            <p className="mt-1 text-lg font-bold">{rec.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{rec.rationale}</p>
            <p className="mt-3 rounded-lg bg-panel px-3 py-2 text-xs font-medium">
              Exam tip: {rec.examTip}
            </p>
          </div>
        ) : (
          <p className="flex h-full items-center justify-center rounded-lg border border-dashed border-line p-6 text-sm text-muted">
            Answer the highlighted questions ({answeredCount}/{QUESTIONS.length} answered) to see the recommended architecture.
          </p>
        )}
      </div>

      {answeredCount > 0 && (
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="mt-3 text-xs text-muted underline underline-offset-2 hover:text-foreground"
        >
          Reset
        </button>
      )}
    </div>
  );
}

function isReachable(index: number, answers: Record<string, string | undefined>): boolean {
  if (index === 0) return true;
  if (index === 1) return Boolean(answers.q1) && answers.q1 === "no";
  if (index === 2) return Boolean(answers.q2) && answers.q2 === "yes";
  if (index === 3) return Boolean(answers.q2) && answers.q2 === "no";
  return false;
}
