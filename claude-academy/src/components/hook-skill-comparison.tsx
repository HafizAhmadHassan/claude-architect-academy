"use client";

import { useState } from "react";

const MECHANISMS = [
  {
    id: "claudemd",
    name: "CLAUDE.md",
    scope: "Project-level memory",
    deterministic: false,
    loaded: "Every session (auto-read)",
    modifiable: "By developer, committed to repo",
    when: [
      "Coding conventions and style preferences",
      "File structure conventions",
      "Project-specific gotchas and warnings",
      "Common commands (build, test, lint)",
    ],
    strengths: [
      "Always present — no opt-in required",
      "Shared across team via git",
      "Good for behavioral defaults",
    ],
    limits: [
      "Non-deterministic: model interprets each time",
      "Can be overridden by stronger user instructions",
      "Grows stale without maintenance",
    ],
    example: "## Project\nUse TypeScript strict. Never use `any`. Tests with vitest.",
    color: "sky",
  },
  {
    id: "hooks",
    name: "Hooks",
    scope: "Lifecycle event handlers",
    deterministic: true,
    loaded: "On trigger event (PreToolUse, PostToolUse, etc.)",
    modifiable: "By developer, committed to repo",
    when: [
      "Enforce formatting before file writes (PreToolUse → Bash)",
      "Run tests after code changes (PostToolUse → Write)",
      "Block disallowed commands (PreToolUse gate)",
      "Log all tool calls for audit",
    ],
    strengths: [
      "Deterministic: shell runs exactly, no model interpretation",
      "Enforced even if model tries to skip",
      "Composable: combine with CI pipelines",
    ],
    limits: [
      "Complex: require shell scripts or node scripts",
      "Harder to debug when things break",
      "Over-blocking hooks cause developer friction",
    ],
    example: "event: PreToolUse\ntool: Bash\ncommand: prettier --write \"$FILE\"",
    color: "violet",
  },
  {
    id: "skills",
    name: "Skills",
    scope: "Reusable task workflows",
    deterministic: false,
    loaded: "On demand (invoked by /skill-name)",
    modifiable: "By developer, in .claude/skills/",
    when: [
      "Repeatable multi-step workflows (scaffold, migrate, deploy)",
      "Task templates with conditional logic",
      "Onboarding playbooks for new contributors",
    ],
    strengths: [
      "Scoped: loaded only when needed, no context pollution",
      "Composable: reference other skills and CLAUDE.md",
      "Discoverable via / commands",
    ],
    limits: [
      "Non-deterministic: model interprets the skill instructions",
      "Must be explicitly invoked",
      "Loading adds latency if skill is large",
    ],
    example: "name: deploy-production\nwhen: manual\ndo: build, run checks, deploy to prod",
    color: "amber",
  },
];

const COLOR_MAP: Record<string, string> = {
  sky: "border-sky-400/40 bg-sky-500/5",
  violet: "border-violet-400/40 bg-violet-500/5",
  amber: "border-amber-400/40 bg-amber-500/5",
};

const COLOR_ACCENT: Record<string, string> = {
  sky: "text-sky-600 dark:text-sky-300",
  violet: "text-violet-600 dark:text-violet-300",
  amber: "text-amber-600 dark:text-amber-300",
};

export function HookSkillComparison() {
  const [selected, setSelected] = useState<string>("claudemd");

  const m = MECHANISMS.find((x) => x.id === selected)!;

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <div>
        <h3 className="font-bold">CLAUDE.md vs Hooks vs Skills</h3>
        <p className="text-sm text-muted">
          The three D3 configuration mechanisms — each serves a different
          determinism and scope trade-off. Click one to explore.
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {MECHANISMS.map((mech) => (
          <button
            key={mech.id}
            type="button"
            onClick={() => setSelected(mech.id)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
              selected === mech.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-muted hover:border-accent/50"
            }`}
          >
            {mech.name}
          </button>
        ))}
      </div>

      <div
        className={`mt-4 rounded-xl border ${COLOR_MAP[m.color]} p-5 animate-slide-up`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h4
            className={`text-lg font-bold ${COLOR_ACCENT[m.color]}`}
          >
            {m.name}
          </h4>
          <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-mono text-muted">
            {m.scope}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span
            className={`rounded px-2 py-1 font-bold ${
              m.deterministic
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {m.deterministic ? "Deterministic ✓" : "Non-deterministic ⚠"}
          </span>
          <span className="rounded bg-panel-2 px-2 py-1 text-muted">
            Loaded: {m.loaded}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-accent">
              When to use
            </h5>
            <ul className="mt-2 space-y-1.5">
              {m.when.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-muted">
                  <span className="text-accent">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Strengths
            </h5>
            <ul className="mt-2 space-y-1.5">
              {m.strengths.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-muted">
                  <span className="text-emerald-500">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
              Limits
            </h5>
            <ul className="mt-2 space-y-1.5">
              {m.limits.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-muted">
                  <span className="text-red-500">−</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-muted">
              Example
            </h5>
            <pre className="mt-2 rounded-lg border border-line bg-background p-3 font-mono text-[11px] leading-relaxed text-muted whitespace-pre-wrap">
              {m.example}
            </pre>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-line bg-background p-3 text-xs leading-relaxed text-muted">
        <strong className="text-foreground">Exam shortcut:</strong> If the
        scenario says &quot;enforce deterministically&quot; →{" "}
        <strong>Hooks</strong>. If it says &quot;project memory / coding
        conventions&quot; → <strong>CLAUDE.md</strong>. If it says &quot;reusable
        task workflow invoked on demand&quot; → <strong>Skills</strong>.
      </p>
    </div>
  );
}
