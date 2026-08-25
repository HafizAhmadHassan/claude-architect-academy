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
      linkedLabId: "claude-code-workflow-lab",
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
      linkedLabId: "claude-code-workflow-lab",
    },
    examQuestionId: "q-hook-posttooluse",
    takeaway:
      "Boundaries belong in configuration, not conversation. Reserve prompts for judgment; give machinery the rules.",
    tags: ["permissions", "plan mode", "hooks", "claude code"],
  },
  {
    id: "skills-commands-automation",
    domainId: "claude-code-workflows",
    title: "Skills, Custom Commands & Workflow Automation",
    summary:
      "Reusable skill files and slash commands encode repeatable workflows so Claude Code applies your team's patterns consistently without re-explaining.",
    objectives: [
      "Create skill files that encapsulate multi-step workflows",
      "Design custom slash commands with parameterized inputs",
      "Chain skills with other tools and hooks for end-to-end automation",
      "Version and share skills across a team via source control",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Skills are structured instruction files that teach Claude Code a specific workflow: how to scaffold a new API route, how to run a security audit, how to prepare a release. Unlike CLAUDE.md's global rules, skills are invoked on demand via slash commands and carry their own step-by-step procedure, expected inputs, and output format.",
        "Custom commands extend the slash-command namespace. A `/deploy-check` command might run linting, type-checking, integration tests, and a diff summary in sequence. Skills compose: one command can invoke another, and hooks can gate or augment the chain. The result is a library of battle-tested workflows that new team members can run immediately.",
      ],
    },
    whyItMatters: [
      "Skills and custom commands appear in Domain 3's task statements on workflow automation.",
      "Reusable workflows reduce prompt engineering per task — encode once, invoke many times.",
      "Team-shared skills are a force multiplier: senior patterns become executable without mentoring overhead.",
    ],
    simpleExample: {
      title: "A new-feature skill",
      body: "Skill file that guides Claude through adding a new API endpoint:",
      code: {
        label: ".claude/skills/new-api-endpoint.md",
        language: "markdown",
        code: `# Skill: New API Endpoint

## Steps
1. Ask for resource name and HTTP method
2. Create route file at src/routes/<resource>/index.ts
3. Add Zod schema co-located with route
4. Write unit tests covering happy path + 1 error case
5. Update OpenAPI spec if one exists
6. Run \`pnpm test --filter <resource>\` to verify

## Output
Report: file created, tests passing, any warnings.`,
      },
    },
    productionExample: {
      title: "Onboarding automation at a startup",
      body: "A 15-person team shipped 12 skill files covering their most common tasks: new endpoint, new migration, new React component, security audit, dependency update, and release prep. New engineers run `/skill new-endpoint` on day one and get the team's exact conventions — barrel exports, error shapes, test patterns — without reading wiki pages. After three months, 78% of routine tasks started via a skill command rather than ad-hoc prompting.",
    },
    antiPattern: {
      name: "One mega-skill for everything",
      wrong:
        "A single 200-line skill file covering all possible workflows with branching logic.",
      consequence:
        "Claude gets confused by irrelevant steps, the skill breaks when any step changes, and nobody dares edit it.",
      fix:
        "One skill per clear intention. Keep each under 50 lines. Compose via slash-command chaining instead of conditional branching.",
    },
    tradeOffs: [
      {
        choice: "Many small focused skills",
        gain: "Easy to maintain, test, and share; clear entry points",
        cost: "Team must know which skill to invoke; discovery overhead",
      },
      {
        choice: "Parameterized slash commands",
        gain: "Flexible inputs; one command handles variants",
        cost: "More complex validation; error messages must guide usage",
      },
      {
        choice: "Skills in source control",
        gain: "Version history, code review, team-wide availability",
        cost: "Requires discipline to keep skills truthful as codebase evolves",
      },
    ],
    handsOn: {
      title: "Build a skill library",
      steps: [
        "Write a skill for the task you repeat most often (new component, new route, etc.).",
        "Test it by running the skill on a fresh branch — does Claude follow every step?",
        "Create a slash command that chains two skills together.",
        "Add a PreToolUse hook that validates the skill's output format.",
      ],
      linkedLabId: "claude-code-workflow-lab",
    },
    examQuestionId: "q-skill-design",
    takeaway:
      "Skills turn tribal knowledge into executable contracts. If you explain it twice, write it as a skill.",
    tags: ["skills", "commands", "automation", "claude code"],
  },
  {
    id: "ci-cd-integration",
    domainId: "claude-code-workflows",
    title: "CI/CD Integration & Automated Testing",
    summary:
      "Run Claude Code in pipelines for automated code review, test generation, and deployment validation — with the same permission and safety model as interactive use.",
    objectives: [
      "Configure Claude Code for non-interactive CI environments",
      "Use Claude for automated code review in pull request workflows",
      "Generate and maintain test suites with CI-driven Claude invocations",
      "Apply permission rules and hooks in pipeline contexts",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Claude Code runs in CI the same way it runs locally: it reads CLAUDE.md, respects permission rules, and executes hooks. The difference is non-interactive mode — no human in the loop for permission prompts, so deny-by-default and pre-approved allow-lists become critical.",
        "Common CI patterns include: automated code review on pull requests (Claude reads the diff, flags issues, posts a summary), test generation (Claude writes tests for uncovered code), and deployment validation (Claude runs a smoke-test skill and reports results). Each pattern uses the same underlying skill/hook/permission infrastructure.",
      ],
    },
    whyItMatters: [
      "CI/CD automation is explicitly named in Domain 3's task statements.",
      "Pipeline contexts require understanding permission rules without interactive prompts.",
      "Code review automation is a high-impact, low-risk entry point for agentic workflows.",
    ],
    simpleExample: {
      title: "CI code review step",
      body: "GitHub Actions step that runs Claude Code for PR review:",
      code: {
        label: ".github/workflows/review.yml",
        language: "yaml",
        code: `- name: Claude Code Review
  run: |
    claude --print --dangerously-skip-permissions \\
      "Review the diff in this PR. Focus on:
       1. Security issues (injection, auth bypass)
       2. Performance regressions
       3. Missing error handling
       Output a structured summary with file:line references."
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
      },
    },
    productionExample: {
      title: "Automated test generation pipeline",
      body: "A team added a CI job that runs after every merge to main. Claude reads the new diff, identifies untested code paths, generates test files, and opens a follow-up PR. The job uses a custom skill that enforces the team's test conventions (Arrange-Act-Assert, no snapshot tests, coverage thresholds). Over six months, test coverage rose from 62% to 89% with zero manual test-writing effort for routine cases.",
    },
    antiPattern: {
      name: "Skipping permissions in CI",
      wrong:
        "Using --dangerously-skip-permissions on every CI step because 'CI is trusted'.",
      consequence:
        "A compromised dependency or malicious PR diff triggers unrestricted file writes, secret reads, or network calls in the pipeline.",
      fix:
        "Use minimal allow-lists per CI job. Code review needs only Read + Bash(diff). Test generation needs Read + Write(test/**). Deny everything else.",
    },
    tradeOffs: [
      {
        choice: "Claude code review in CI",
        gain: "Catches issues humans miss; consistent review quality",
        cost: "API costs per PR; false positives need tuning",
      },
      {
        choice: "Automated test generation",
        gain: "Coverage rises without manual effort",
        cost: "Generated tests need human review for correctness and intent",
      },
      {
        choice: "Non-interactive permissions",
        gain: "Pipelines run without human gates",
        cost: "Requires precise allow-lists; over-permissive rules create security gaps",
      },
    ],
    handsOn: {
      title: "Add Claude to a CI pipeline",
      steps: [
        "Create a GitHub Actions workflow that runs Claude Code on a PR diff.",
        "Write a review skill with the team's specific focus areas.",
        "Configure permission rules for the CI job: read-only where possible.",
        "Run the workflow on a real PR and evaluate the review output quality.",
      ],
      linkedLabId: "claude-code-workflow-lab",
    },
    examQuestionId: "q-ci-permissions",
    takeaway:
      "CI is just another user of Claude Code — same rules, same skills, tighter permissions. Automate the repeatable, protect the dangerous.",
    tags: ["ci/cd", "automation", "code review", "testing", "claude code"],
  },
];
