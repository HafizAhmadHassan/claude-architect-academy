import type { Lesson } from "../types";

export const domain3Lessons: Lesson[] = [
  {
    id: "claudemd-project-memory",
    domainId: "claude-code-workflows",
    title: "CLAUDE.md & Project Memory",
    summary:
      "Curated project instructions loaded every session: commands that work, conventions that matter, caveats that bite.",
    objectives: [
      "Structure CLAUDE.md content by durability and blast radius",
      "Use hierarchical memory across enterprise, project, and local scopes",
      "Keep memory high-signal so instructions survive attention budgets",
      "Pair CLAUDE.md with slash-command files for repeatable workflows",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "CLAUDE.md files are persistent memory injected at session start. They scale hierarchically: enterprise policy at the top, repository conventions in the project root, subdirectory specifics next to the code they govern, and personal preferences in local files excluded from source control.",
        "The file earns its place with signal density. Every line should change Claude's behavior: build/test commands verified to work, non-obvious conventions ('we use barrel exports only in lib/'), and gotchas ('migration step required before integration tests'). Prose essays and copied handbooks dilute attention.",
      ],
    },
    whyItMatters: [
      "CLAUDE.md is named explicitly in Domain 3's first task statements.",
      "Monorepo scenarios test whether you scope conventions to the right level instead of one giant file.",
      "The interview pattern — having Claude ask clarifying questions before big changes — pairs with well-seeded memory.",
    ],
    simpleExample: {
      title: "High-signal CLAUDE.md",
      body: "Short sections, imperative voice, no biography:",
      code: {
        label: "CLAUDE.md",
        language: "markdown",
        code: `# Orders service

## Commands
- pnpm test --filter orders   (unit)
- pnpm db:migrate && pnpm test:e2e   (integration needs DB up)

## Conventions
- Route handlers live in src/routes/<resource>/index.ts
- All money math uses minor units (integer cents) — never floats
- Zod schemas co-located with route, exported for client reuse

## Gotchas
- Run migrations BEFORE e2e; CI does this via pretest hook
- Do not edit generated/ — regenerate with pnpm codegen`,
      },
    },
    productionExample: {
      title: "Monorepo with layered memory",
      body: "A 40-service monorepo keeps a thin root CLAUDE.md (org-wide commit format, security rules), per-package CLAUDE.md files (framework quirks, test commands), and developer-local files for personal aliases. When the team migrated from Jest to Vitest, updating the three relevant package-level memories changed Claude Code's behavior everywhere on the next session — no prompts re-typed, no rules forgotten mid-task.",
    },
    antiPattern: {
      name: "The handbook dump",
      wrong:
        "Pasting the entire engineering wiki into CLAUDE.md 'so nothing is missing'.",
      consequence:
        "Attention spreads across thousands of low-relevance tokens; the five instructions that matter get lost, and stale guidance actively misleads.",
      fix:
        "Curate ruthlessly. If an instruction has not changed behavior in a month, delete it. Link out to documents instead of inlining them.",
    },
    tradeOffs: [
      {
        choice: "Root-level only memory",
        gain: "One place to maintain",
        cost: "Package-specific nuance drowns or contradicts siblings",
      },
      {
        choice: "Hierarchical memory",
        gain: "Right context at right scope; easy team-wide updates",
        cost: "More files to keep truthful as architecture evolves",
      },
      {
        choice: "Local (uncommitted) overrides",
        gain: "Personal workflow freedom without team noise",
        cost: "'Works on my machine' divergence if overused",
      },
    ],
    handsOn: {
      title: "Author real project memory",
      steps: [
        "Write a root CLAUDE.md for any repo you maintain using the four-section template.",
        "Ask Claude Code to run your documented test command before and after adding it; compare behavior.",
        "Add one nested CLAUDE.md where a subdirectory genuinely differs.",
        "Delete one line per week that earned its place least.",
      ],
    },
    examQuestionId: "q-claudemd-hierarchy",
    takeaway:
      "Memory is curation, not storage. Every line must earn its attention cost every single session.",
    tags: ["claude code", "claudemd", "memory", "conventions"],
  },
  {
    id: "permissions-plan-mode-hooks",
    domainId: "claude-code-workflows",
    title: "Permissions, Plan Mode & Hooks",
    summary:
      "Programmatic guardrails: permission rules that physically bound actions, plan mode for high-stakes changes, hooks that intercept lifecycle events.",
    objectives: [
      "Configure allow/ask/deny permission rules instead of prompt-based requests",
      "Choose plan mode vs direct execution based on blast radius and ambiguity",
      "Attach PreToolUse and PostToolUse hooks to enforce and normalize",
      "Explain why programmatic enforcement beats asking nicely in the prompt",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Claude Code's safety model is layered. Permissions are declarative rules: always allow read-only git status, ask before any npm install, deny writes to infra/. Plan mode flips execution into explore-first: Claude surveys the codebase, proposes an approach, and waits for sign-off before touching files. Hooks are shell commands bound to lifecycle events — PreToolUse can veto or rewrite a call before execution; PostToolUse can validate or transform results after.",
        "The unifying principle is programmatic enforcement. A rule in settings is deterministic; a sentence in CLAUDE.md is advisory. Use prose for judgment calls and machinery for boundaries.",
      ],
    },
    whyItMatters: [
      "Hooks, permissions, and plan mode each have dedicated task statements in Domain 3.",
      "PostToolUse normalization patterns appear verbatim in blueprint examples.",
      "Plan-mode-vs-direct-execution choice questions mirror real code-review judgment calls.",
    ],
    simpleExample: {
      title: "Three layers in concert",
      body: "Permissions bound what is possible, hooks clean what passes, plan mode governs how much changes at once.",
      code: {
        label: ".claude/settings.json + hook",
        language: "json",
        code: `{
  "permissions": {
    "allow": ["Bash(git diff:*)", "Read(*)"],
    "ask": ["Bash(npm install:*)"],
    "deny": ["Read(.env*)", "Edit(src/generated/**)"]
  }
}

// PostToolUse hook: normalize timestamps from any tool output
// claude hook runs scripts/normalize-dates.js with tool JSON
// on stdin; its stdout replaces the result the model sees.`,
      },
    },
    productionExample: {
      title: "Compliance-bound monorepo",
      body: "A fintech denies all writes under `ledger/` except through reviewed PRs, requires plan mode whenever a task touches more than five files (enforced by a PreToolUse hook counting Edit attempts), and normalizes every Bash tool result through PostToolUse to strip secrets from stack traces before the model sees them. Auditors receive the settings files themselves as evidence of enforcement.",
    },
    antiPattern: {
      name: "Prompt-based policing",
      wrong:
        "'Never touch the ledger directory' written in CLAUDE.md with no permission rule backing it.",
      consequence:
        "Under long sessions or aggressive refactors the instruction gets outweighed by task pressure, and the forbidden write happens anyway.",
      fix:
        "Mirror every hard boundary in permissions/hooks so violation is impossible, and let CLAUDE.md explain WHY the boundary exists.",
    },
    tradeOffs: [
      {
        choice: "Strict deny-by-default",
        gain: "Predictable blast radius; audit-friendly",
        cost: "Constant approval interruptions slow trusted flows",
      },
      {
        choice: "Plan mode for everything",
        gain: "Human sign-off on all strategies",
        cost: "Trivial edits drown in ceremony",
      },
      {
        choice: "Heavy PostToolUse transformation",
        gain: "Model always sees normalized data",
        cost: "Hidden mutation layer complicates debugging when outputs surprise you",
      },
    ],
    handsOn: {
      title: "Harden a workspace",
      steps: [
        "Write permission rules: two allows, two asks, two denies matching your real fears.",
        "Install a PostToolUse hook that uppercases any returned JSON 'status' field; verify the model sees the change.",
        "Run one small bugfix in direct mode and one multi-file refactor in plan mode; compare review experience.",
        "Attempt a denied action and confirm the block is structural, not behavioral.",
      ],
    },
    examQuestionId: "q-hook-posttooluse",
    takeaway:
      "Boundaries belong in configuration, not conversation. Reserve prompts for judgment; give machinery the rules.",
    tags: ["permissions", "plan mode", "hooks", "claude code"],
  },
];
