import type { PracticeQuestion } from "../types";

export const lessonExamQuestions: PracticeQuestion[] = [
  {
    id: "q-skill-design",
    domainId: "claude-code-workflows",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "A team maintains a 200-line skill file covering every workflow — scaffolding, migrations, security audits, releases — with heavy conditional branching. Contributors are afraid to edit it, and Claude frequently executes irrelevant steps.",
    question: "What is the strongest redesign?",
    options: [
      { id: "a", text: "Split into small single-intention skills invoked on demand, composed by chaining commands rather than branching inside one file" },
      { id: "b", text: "Move all skill contents into CLAUDE.md so every workflow is always loaded" },
      { id: "c", text: "Keep the mega-skill but add more conditional branches to disambiguate steps" },
      { id: "d", text: "Delete skills entirely; rely on each developer re-explaining workflows per session" },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Skills are on-demand procedure contracts. One intention per skill keeps every step relevant to the invoked task, keeps files maintainable, and composition happens through command chaining instead of brittle internal branching. CLAUDE.md is for rules that apply broadly — loading all workflows into it bloats every session.",
    optionExplanations: {
      a: "Correct. Focused skills match invocation scope to instruction scope, eliminating irrelevant-step confusion.",
      b: "CLAUDE.md loads every session; pushing all workflows there recreates the wall-of-context problem it exists to avoid.",
      c: "More branching increases fragility and maintenance fear — the exact failure being reported.",
      d: "Discarding encoded workflows forfeits consistency and forces re-teaching tribal knowledge every session.",
    },
    principle:
      "One skill per clear intention; compose workflows by chaining, not by branching inside a monolith.",
    tags: ["skills", "commands", "claude code"],
    references: [
      {
        label: "Claude Code Docs – Skills",
        url: "https://code.claude.com/docs/en/skills",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-ci-permissions",
    domainId: "claude-code-workflows",
    difficulty: "advanced",
    type: "architecture-decision",
    scenario:
      "You are adding Claude Code to a CI pipeline for automated PR review. There is no human available to approve permission prompts, yet the pipeline must never allow destructive commands or writes outside the repo.",
    question: "Which permission configuration fits this environment?",
    options: [
      { id: "a", text: "Run interactively with a bot watching output and approving prompts" },
      { id: "b", text: "Grant bypassPermissions so review completes quickly" },
      { id: "c", text: "Deny-by-default with an explicit pre-approved allow-list of read-only tools and specific safe commands, plus hooks that block anything else" },
      { id: "d", text: "Allow everything except 'rm -rf' via a single deny rule" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "Non-interactive CI removes the human approval path, so the allow-list IS the policy: deny by default, enumerate exactly what review needs (read tools, git diff, posting comments), and use hooks as deterministic guards. This preserves Claude Code's normal safety model where pipelines can't fall back to prompting.",
    optionExplanations: {
      a: "CI has no interactive session to approve prompts; simulating one reintroduces a human bottleneck automation was meant to remove.",
      b: "bypassPermissions skips prompts entirely — including for dangerous operations. Speed is not worth unbounded blast radius.",
      c: "Correct. Deny-by-default with explicit allowances makes the security posture auditable and bounded.",
      d: "Blocklist thinking fails: only the enumerated hazard is prevented, while every unforeseen destructive operation remains allowed.",
    },
    principle:
      "In headless environments the allow-list replaces the human: deny by default, approve explicitly, enforce with hooks.",
    tags: ["CI/CD", "permissions", "automation"],
    references: [
      {
        label: "Claude Code Docs – Permissions & CI",
        url: "https://code.claude.com/docs/en/best-practices",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-system-prompt-structure",
    domainId: "prompt-engineering",
    difficulty: "beginner",
    type: "single-choice",
    scenario:
      "A 3,000-token system prompt buries its JSON-output requirement at position ~1,500. In production, roughly one in ten responses drifts from the schema exactly when inputs are long.",
    question: "Which structural change most directly addresses the drift?",
    options: [
      { id: "a", text: "Duplicate the format contract at the top and bottom of a layered, labeled prompt, and cut unrelated content" },
      { id: "b", text: "Increase max_tokens so responses have room to include the schema" },
      { id: "c", text: "Move the format contract deeper so surrounding prose can 'protect' it" },
      { id: "d", text: "Raise temperature slightly so the model explores formats more flexibly" },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Attention over long prompts favors the edges (primacy and recency); directives buried mid-prompt lose to later instructions when input pressure grows. Layering with labels, anchoring hard constraints (format, safety) at top and bottom, and pruning low-value tokens restores compliance without changing any model parameters.",
    optionExplanations: {
      a: "Correct. Edge placement plus reduced competition for attention targets the documented failure mechanism.",
      b: "Output budget does not affect whether the model attends to a mid-prompt directive.",
      c: "Burying the rule worsens the exact problem — middle positions receive the least weight.",
      d: "Temperature affects sampling variance, not instruction salience; higher variance would increase drift if anything.",
    },
    principle:
      "Prompt layout is attention layout: hard constraints live at the edges, soft guidance lives in the middle.",
    tags: ["system prompts", "attention", "output format"],
    references: [
      {
        label: "Claude Platform Docs – Prompt engineering best practices",
        url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-multi-pass-review",
    domainId: "prompt-engineering",
    difficulty: "intermediate",
    type: "trade-off-analysis",
    scenario:
      "A document-review pipeline asks one call to simultaneously check factual accuracy, structural coherence, tone, and citation formatting. Outputs improve on some dimensions while regressing on others, and failures are hard to attribute.",
    question: "What is the best architectural response?",
    options: [
      { id: "a", text: "Combine all criteria into one denser rubric within the same single call" },
      { id: "b", text: "Split into sequential passes, each with a single concern and its own rubric, aggregating findings at the end" },
      { id: "c", text: "Drop the lowest-value dimension (tone) entirely and hope conflicts disappear" },
      { id: "d", text: "Randomize criterion order per request so no dimension dominates" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Competing objectives inside one generation force the model to trade them off implicitly, and failures become unattributable. Multi-pass design gives each concern dedicated attention and a focused rubric, so quality compounds across passes and each finding carries a known provenance.",
    optionExplanations: {
      a: "Densifying the rubric intensifies the competition between criteria — the root cause remains untouched.",
      b: "Correct. One concern per pass isolates attention, enables per-pass evaluation, and makes regressions attributable.",
      c: "Deleting requirements changes the product spec; it papers over the architecture problem rather than fixing it.",
      d: "Order randomization addresses bias at the margins but keeps mutually interfering objectives in one call.",
    },
    principle:
      "Decompose evaluation along concern boundaries: one pass, one rubric, one job.",
    tags: ["multi-pass", "review", "prompt chaining"],
    references: [
      {
        label: "Anthropic Engineering – Building Effective Agents (chaining)",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-context-optimization",
    domainId: "context-reliability",
    difficulty: "intermediate",
    type: "multiple-response",
    scenario:
      "A research assistant degrades on long sessions: early instructions get ignored, token costs climb, and retrieved documents crowd out conversation history.",
    question: "Which strategies directly increase signal-per-token? (Select two.)",
    options: [
      { id: "a", text: "Hierarchical context loading: start from compact summaries, expand details only on demand" },
      { id: "b", text: "Retrieve only semantically relevant document chunks instead of injecting whole corpora" },
      { id: "c", text: "Raise max_tokens so answers can restate earlier instructions verbatim" },
      { id: "d", text: "Duplicate key instructions throughout the window so they survive anywhere in the context" },
    ],
    correctOptionIds: ["a", "b"],
    explanation:
      "Signal-per-token improves by reducing what enters the window (retrieval of relevant chunks, not full corpora) and by deferring detail until needed (hierarchical loading). Both shrink context volume while preserving access to information. Restating or duplicating content spends more tokens competing for the same attention.",
    optionExplanations: {
      a: "Correct. Summary-first loading keeps baseline footprint minimal while retaining on-demand depth.",
      b: "Correct. Semantic retrieval injects the fraction of documents relevant to the current task rather than everything 'just in case'.",
      c: "Larger outputs consume more window and do nothing about degraded attention to earlier context.",
      d: "Duplication multiplies token cost and adds redundancy; targeted placement beats carpet-bombing the window.",
    },
    principle:
      "Maximize signal per token: retrieve what is relevant, defer what can wait, never include context just-in-case.",
    tags: ["context window", "RAG", "progressive disclosure"],
    references: [
      {
        label: "Anthropic Engineering – Effective context engineering for AI agents",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-agent-monitoring",
    domainId: "context-reliability",
    difficulty: "advanced",
    type: "architecture-decision",
    scenario:
      "After a silent week-long quality regression in one domain of a support agent, the team decides alerts are needed. Current dashboards show only aggregate request counts.",
    question: "Which observability design catches this class of failure soonest?",
    options: [
      { id: "a", text: "Alert on total traffic volume dropping below a fixed floor" },
      { id: "b", text: "Domain-scoped metrics (escalation rate, success rate, p95 latency, tokens) with tiered thresholds tuned to baselines, plus traces linking requests to iterations and tool calls" },
      { id: "c", text: "Alert on every metric at aggressive thresholds to maximize coverage" },
      { id: "d", text: "Sample 1% of traces and alert when sampled latency exceeds the global median" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Domain-scoped degradation hides in aggregate numbers. The fix combines four pillar metrics broken out per domain with tiered alerting (info/warning/critical) tuned to measured baselines, underpinned by structured traces that make any firing alert root-causeable down to the tool call.",
    optionExplanations: {
      a: "Traffic volume says nothing about answer quality; users keep requesting while quality quietly sinks.",
      b: "Correct. Per-domain breakdowns localize regression; tiered thresholds surface it before users do; traces enable diagnosis.",
      c: "Alert-on-everything produces fatigue, trains the team to ignore pages, and buries real incidents in noise.",
      d: "Sparse sampling against a global median misses slow, domain-specific drift and provides too little signal to act on.",
    },
    principle:
      "Instrument per domain, alert in tiers against baselines, and trace deeply enough that every page is root-causeable.",
    tags: ["observability", "alerting", "metrics"],
    references: [
      {
        label: "Claude Platform Docs – Observability & evaluation",
        url: "https://platform.claude.com/docs/en/test-and-evaluate",
      },
    ],
    isOfficial: false,
  },
];
