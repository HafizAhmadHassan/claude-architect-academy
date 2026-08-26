import type { PracticeQuestion } from "../types";

export const moreQuestions: PracticeQuestion[] = [
  {
    id: "q-subagent-context-passing",
    domainId: "agentic-architecture",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "A research orchestrator dispatches a web-research subagent, then forwards the subagent's entire conversation transcript to the writing subagent 'so no detail is lost'. Downstream prompts have grown past 100k tokens and quality is falling.",
    question: "What should change about the context passing?",
    options: [
      {
        id: "a",
        text: "Forward structured findings only: key facts with source URLs and relevance scores",
      },
      { id: "b", text: "Forward nothing; let the writer redo its own research" },
      {
        id: "c",
        text: "Forward the full transcript but ask the writer to ignore irrelevant parts",
      },
      {
        id: "d",
        text: "Increase max_tokens so the writer can process the whole transcript",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Downstream agents need conclusions with provenance, not raw process. Structured summaries preserve attribution while cutting context to what the next agent can actually use.",
    optionExplanations: {
      a: "Correct. Findings plus citations are the contract between agents; everything else is process noise.",
      b: "Duplicating work doubles cost and discards verified sources — worse, not better.",
      c: "'Ignore the irrelevant parts' is an instruction the model cannot reliably execute on 100k tokens; attention dilution remains.",
      d: "A bigger window delays the failure rather than fixing it, and costs grow linearly with transcript size.",
    },
    principle:
      "Pass conclusions with provenance between agents; transcripts are for debugging, not handoffs.",
    tags: ["subagents", "context passing"],
    references: [
      {
        label: "Anthropic Engineering – Building effective agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-confidence-gate-vs-threshold",
    domainId: "agentic-architecture",
    difficulty: "advanced",
    type: "trade-off-analysis",
    scenario:
      "An operations agent may cancel customer shipments autonomously. The team wants oversight but cannot review every cancellation. Someone proposes letting the agent proceed whenever it self-reports confidence above 8/10.",
    question: "Which analysis is strongest?",
    options: [
      {
        id: "a",
        text: "Self-reported confidence reflects the model's phrasing habits, not accuracy; gate on action class and dollar thresholds in code, routing only borderline cases to humans using calibrated scores from labeled outcomes",
      },
      { id: "b", text: "Reasonable — models know when they are likely wrong" },
      {
        id: "c",
        text: "Fine as long as the scale is 1–100 instead of 1–10 for precision",
      },
      {
        id: "d",
        text: "Replace it with sentiment analysis on the request text to detect risky cancellations",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Uncalibrated self-assessment is a weak proxy for correctness. Structural gates (what kind of action, how much money) enforced programmatically give deterministic safety, while calibrated field-level scores trained against labeled outcomes direct scarce human attention where errors actually cluster.",
    optionExplanations: {
      a: "Correct. Deterministic gates for structure, calibrated scores for prioritization — neither relies on model introspection.",
      b: "Models routinely express high confidence while wrong; introspective certainty is not calibration.",
      c: "Changing the scale changes granularity of a miscalibrated signal, not its reliability.",
      d: "Sentiment measures tone, not risk; calm complex requests pass while angry simple ones get blocked.",
    },
    principle:
      "Gate irreversible actions structurally; calibrate review signals against labeled outcomes.",
    tags: ["human-in-the-loop", "escalation", "calibration"],
    references: [
      {
        label: "Anthropic Docs – CCA-F exam guide domain guidance",
        url: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-parallel-dispatch",
    domainId: "agentic-architecture",
    difficulty: "intermediate",
    type: "architecture-decision",
    scenario:
      "An orchestrator must gather pricing from four independent vendors, then synthesize one comparison report. Current sequential execution takes 12 minutes.",
    question: "Which architecture best reduces wall-clock time without sacrificing correctness?",
    options: [
      {
        id: "a",
        text: "Dispatch all four vendor lookups in parallel, then run synthesis once all results arrive",
      },
      {
        id: "b",
        text: "Run four full pipelines in parallel and ship whichever comparison finishes first",
      },
      {
        id: "c",
        text: "Remove synthesis and return the four raw results to the user",
      },
      {
        id: "d",
        text: "Ask the user which vendor to skip so only three lookups are needed",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Independent subtasks parallelize; dependent ones serialize. Fan-out for the independent fetches collapses latency roughly to the slowest vendor, while synthesis correctly waits because it depends on every input.",
    optionExplanations: {
      a: "Correct. Classic fan-out/fan-in: parallelize independence, serialize the join.",
      b: "Racing complete pipelines multiplies cost and yields whichever finished fastest, not necessarily correct or complete.",
      c: "Raw dumps abandon the actual product — the synthesized comparison.",
      d: "Degrading scope to dodge a fixable performance problem harms the product.",
    },
    principle:
      "Parallelize independent work; synchronize before tasks whose inputs depend on it.",
    tags: ["orchestration", "parallel agents", "workflows"],
    references: [
      {
        label: "Anthropic Engineering – Building effective agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-turn-budget-tradeoff",
    domainId: "agentic-architecture",
    difficulty: "beginner",
    type: "single-choice",
    question:
      "What is the primary purpose of a turn budget in an agentic loop?",
    options: [
      {
        id: "a",
        text: "To bound worst-case cost and latency when the model fails to reach a stop condition",
      },
      { id: "b", text: "To make responses deterministic" },
      { id: "c", text: "To prioritize which tools the model may call" },
      {
        id: "d",
        text: "To compress conversation history automatically at each turn",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Stop conditions normally end loops; budgets exist for when they do not fire — thrashing, circular tool calls, or impossible goals — converting a runaway incident into a bounded, observable failure.",
    optionExplanations: {
      a: "Correct. Budgets cap blast radius: worst-case spend and duration become design constants.",
      b: "Determinism comes from sampling parameters, not loop limits.",
      c: "Tool access is governed by the tool list and permissions, not turn counts.",
      d: "Summarization is a separate context strategy, not what turn budgets do.",
    },
    principle:
      "Every loop needs a designed exit and a hard ceiling; budgets convert runaways into incidents you can afford.",
    tags: ["agentic loop", "budgets"],
    references: [
      {
        label: "Anthropic Docs – Tool use overview",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-tool-granularity",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "An agent exposes get_user_by_email, get_user_by_id, list_users_by_org, search_users_by_name, and get_user_settings as five separate tools. Logs show frequent wrong-tool selection and calls chained two or three deep to assemble one answer.",
    question: "What is the most effective tool-design response?",
    options: [
      {
        id: "a",
        text: "Consolidate into fewer intention-named tools (e.g., find_users with documented lookup modes), keeping schemas explicit per mode",
      },
      {
        id: "b",
        text: "Add ten more specialized variants covering every conceivable lookup",
      },
      {
        id: "c",
        text: "Keep the five tools but warn in each description that selection matters",
      },
      {
        id: "d",
        text: "Remove descriptions entirely so the model infers behavior from names",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Five overlapping read paths create selection ambiguity and force multi-call assembly. Consolidating by intention with an explicit mode parameter (and per-mode schema docs) removes the guessing game while keeping permissions manageable.",
    optionExplanations: {
      a: "Correct. Intention-shaped tools reduce both mis-selection and chatty sequences.",
      b: "More variants deepen the exact problem — choice overload and overlap.",
      c: "Urging careful selection does not resolve structural ambiguity.",
      d: "Descriptions are the contract; deleting them maximizes uncertainty.",
    },
    principle:
      "Shape tools around intentions, not database access patterns; ambiguity in the surface becomes errors in execution.",
    tags: ["tool design", "granularity"],
    references: [
      {
        label: "Anthropic Docs – Tool use best practices",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices-and-troubleshooting",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-mcp-resource-vs-tool",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "single-choice",
    question:
      "Your MCP server exposes a large style-guide document that the host application should inject as context when relevant, and a create_issue action that files GitHub tickets. How should these be classified?",
    options: [
      {
        id: "a",
        text: "Style guide as a resource; create_issue as a tool",
      },
      { id: "b", text: "Both as tools so the model controls everything" },
      { id: "c", text: "Both as resources since neither mutates data" },
      {
        id: "d",
        text: "Style guide as a prompt template; create_issue as a resource",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Resources are application-controlled read-only context — perfect for reference documents surfaced by the host. Tools are model-invoked actions, which is exactly what filing an issue is.",
    optionExplanations: {
      a: "Correct. Read-only context → resource; action → tool.",
      b: "Making static documents model-invocable wastes turns and invites pointless calls; tools imply actions.",
      c: "create_issue mutates external state — classifying it as a read-only resource breaks the protocol's semantics.",
      d: "Prompt templates are reusable message structures, not documents; resources cannot perform actions.",
    },
    principle:
      "Model-invoked actions are tools; application-controlled context is resources; reusable message patterns are prompts.",
    tags: ["mcp", "resources", "tools"],
    references: [
      {
        label: "Model Context Protocol – Concepts",
        url: "https://modelcontextprotocol.io/docs/learn/architecture",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-transient-vs-validation",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "debugging",
    scenario:
      "During a provider outage, your agent hammers a failing API hundreds of times per minute. Separately, users occasionally trigger validation failures that also retry endlessly because the payload never changes.",
    question: "Which fix addresses both behaviors?",
    options: [
      {
        id: "a",
        text: "Require errorCategory in every tool error: transient errors retry with capped exponential backoff; validation errors return immediately to the model for input correction",
      },
      {
        id: "b",
        text: "Retry everything up to 500 times with a fixed 1-second delay",
      },
      {
        id: "c",
        text: "Never retry anything; fail every pipeline on first error",
      },
      {
        id: "d",
        text: "Retry only when the HTTP status code is odd-numbered",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Category-driven handling makes retry policy deterministic: transient faults deserve patient backoff, validation faults deserve informative correction. Both pathologies come from treating distinct failure classes identically.",
    optionExplanations: {
      a: "Correct. Typed failures enable typed recovery — the core of reliable tool integration.",
      b: "Fixed aggressive retries amplify outages and still cannot fix invalid payloads.",
      c: "Abandoning retries sacrifices resilience to momentary blips.",
      d: "HTTP parity carries no relationship to recoverability.",
    },
    principle:
      "Transient means backoff, validation means correction, permission means escalation — encode the difference.",
    tags: ["failure handling", "retries", "structured errors"],
    references: [
      {
        label: "Anthropic Docs – Handling tool use errors",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/handling-tool-use-errors",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-mcp-auth-scoping",
    domainId: "tool-design-mcp",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "You are building an MCP server that reads calendars, creates events, and sends meeting invites for enterprise users via OAuth.",
    question: "Which authentication and authorization design is strongest?",
    options: [
      {
        id: "a",
        text: "Per-user OAuth tokens scoped to calendar.read/write and smtp.send as needed, enforced server-side per capability, with mutations additionally gated behind approval rules",
      },
      {
        id: "b",
        text: "One service-account admin token shared across all users for simplicity",
      },
      {
        id: "c",
        text: "Full mailbox admin scope so future features never need re-auth",
      },
      {
        id: "d",
        text: "Client-side tokens passed through the model's context so it can manage them",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Least privilege per user, capability-scoped enforcement at the server, and human gates on mutations together contain both technical failure and abuse. Identity flows through infrastructure, never through model context.",
    optionExplanations: {
      a: "Correct. Per-user identity + minimal scopes + mutation gates is defense-in-depth done right.",
      b: "Shared identity destroys attribution and grants everyone admin reach — an audit nightmare.",
      c: "Scope creep for hypothetical futures violates least privilege today.",
      d: "Tokens in model context leak into logs, traces, and potential outputs; credentials belong to infrastructure.",
    },
    principle:
      "Credentials live in infrastructure, scoped to capability and user; the model reasons about actions, never holds keys.",
    tags: ["mcp", "authentication", "permissions"],
    references: [
      {
        label: "Model Context Protocol – Authorization",
        url: "https://modelcontextprotocol.io/specification/authorization",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-claudemd-hierarchy",
    domainId: "claude-code-workflows",
    difficulty: "intermediate",
    type: "architecture-decision",
    scenario:
      "A monorepo hosts a Python API package, a React frontend package, and shared infra code. Conventions conflict: formatting, test commands, and lint rules differ per package. One root CLAUDE.md currently mixes everything.",
    question: "How should project memory be organized?",
    options: [
      {
        id: "a",
        text: "Thin root CLAUDE.md for org-wide rules, plus a CLAUDE.md inside each package holding its own commands and conventions",
      },
      {
        id: "b",
        text: "One exhaustive root file listing every rule for every package",
      },
      {
        id: "c",
        text: "No CLAUDE.md anywhere; explain conventions in chat each session",
      },
      {
        id: "d",
        text: "Only a local untracked memory file per developer",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Hierarchical memory puts each instruction where its scope lives: org policy at root, package specifics alongside the package. Claude Code loads relevant levels automatically, keeping context focused and team-shareable through version control.",
    optionExplanations: {
      a: "Correct. Scope locality keeps instructions accurate and maintainable.",
      b: "Cross-package noise dilutes attention and guarantees stale contradictions as packages evolve.",
      c: "Session-only explanations discard knowledge every session and differ per teammate.",
      d: "Local-only memory is invisible to teammates and lost on machine changes; shared conventions need shared files.",
    },
    principle:
      "Memory mirrors architecture: global policy up top, specifics beside the code they govern.",
    tags: ["claudemd", "claude code", "monorepo"],
    references: [
      {
        label: "Claude Code – Memory management",
        url: "https://docs.anthropic.com/en/docs/claude-code/memory",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-hook-posttooluse",
    domainId: "claude-code-workflows",
    difficulty: "advanced",
    type: "debugging",
    scenario:
      "Claude Code keeps misreading timestamps: some tools return Unix epochs, others ISO strings, and the model frequently converts them incorrectly mid-task.",
    question: "Which intervention fixes this deterministically?",
    options: [
      {
        id: "a",
        text: "Register a PostToolUse hook that normalizes all timestamp fields to ISO-8601 before results reach the model",
      },
      {
        id: "b",
        text: "Add a CLAUDE.md line instructing careful timestamp conversion",
      },
      {
        id: "c",
        text: "Ask the user to reformat outputs manually each session",
      },
      {
        id: "d",
        text: "Switch models until one handles mixed formats well",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "PostToolUse hooks transform tool results after execution but before the model sees them — programmatic normalization eliminates the entire error class instead of asking the model to be careful.",
    optionExplanations: {
      a: "Correct. Enforcement at the boundary beats vigilance in the prompt, every time.",
      b: "Advisory text still leaves conversion to chance under task pressure.",
      c: "Manual steps contradict why automation exists and erode trust.",
      d: "Model roulette is expensive and non-deterministic; the defect is in the data contract.",
    },
    principle:
      "Normalize heterogeneous data at the tool boundary with hooks; never delegate data hygiene to model diligence.",
    tags: ["hooks", "posttooluse", "claude code"],
    references: [
      {
        label: "Claude Code – Hooks reference",
        url: "https://docs.anthropic.com/en/docs/claude-code/hooks",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-slash-command-ci",
    domainId: "claude-code-workflows",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "Your team wants a /security-review command producing machine-parseable findings consumed by a CI job that blocks PRs on critical issues.",
    question: "Which setup achieves this?",
    options: [
      {
        id: "a",
        text: "Define the custom slash command, then invoke claude non-interactively with --output-format json and --json-schema so CI parses validated structured findings",
      },
      {
        id: "b",
        text: "Parse free-text output from claude -p looking for keywords like CRITICAL",
      },
      {
        id: "c",
        text: "Have developers screenshot the terminal and attach findings manually",
      },
      {
        id: "d",
        text: "Run claude interactively in CI and rely on exit codes alone",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Custom slash commands codify team workflow; JSON output mode with a schema produces validated, machine-parseable results — exactly what CI consumers require.",
    optionExplanations: {
      a: "Correct. Commands standardize the prompt; json+schema standardizes the interface.",
      b: "Keyword scraping breaks on wording drift and yields fragile, untyped parsing.",
      c: "Manual screenshots defeat automation and auditability entirely.",
      d: "Interactive sessions are not CI-appropriate, and exit codes carry no finding details.",
    },
    principle:
      "Automated consumers need contracts: slash commands for workflow, JSON schemas for output shape.",
    tags: ["commands", "structured output", "ci/cd"],
    references: [
      {
        label: "Claude Code – CLI usage & slash commands",
        url: "https://docs.anthropic.com/en/docs/claude-code/cli-usage",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-plan-mode-small-fix",
    domainId: "claude-code-workflows",
    difficulty: "beginner",
    type: "single-choice",
    question:
      "For a one-line date-validation bugfix in a single well-tested function, which Claude Code workflow fits best?",
    options: [
      {
        id: "a",
        text: "Direct execution with tests run afterward",
      },
      {
        id: "b",
        text: "Plan mode with a formal written proposal approved by the team",
      },
      { id: "c", text: "Rewrite the module from scratch in plan mode" },
      {
        id: "d",
        text: "Disable all permissions and let it refactor freely overnight",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Direct execution matches small, well-scoped changes with clear correctness criteria. Plan mode earns its ceremony on ambiguous, high-blast-radius work — not single-line fixes.",
    optionExplanations: {
      a: "Correct. Proportionate process: tiny fix, tiny loop, verify with tests.",
      b: "Ceremony overhead exceeds task risk; plan mode would slow the team for no added safety.",
      c: "Wholesale rewrite of working code to fix one line multiplies risk absurdly.",
      d: "Unbounded autonomy on production code is how small bugs become incidents.",
    },
    principle:
      "Match workflow weight to blast radius and ambiguity — nothing more, nothing less.",
    tags: ["plan mode", "workflows"],
    references: [
      {
        label: "Claude Code – Common workflows",
        url: "https://docs.anthropic.com/en/docs/claude-code/common-workflows",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-schema-fabrication",
    domainId: "prompt-engineering",
    difficulty: "intermediate",
    type: "debugging",
    scenario:
      "An extraction schema marks due_date required, but many source emails genuinely omit deadlines. Production shows fabricated dates appearing in roughly 9% of records.",
    question: "What is the root fix?",
    options: [
      {
        id: "a",
        text: "Make due_date nullable in the schema and instruct that absent deadlines must return null, never inferred values",
      },
      {
        id: "b",
        text: "Keep the field required and tell the model to try harder to find dates",
      },
      {
        id: "c",
        text: "Lower temperature so fabrication decreases statistically",
      },
      {
        id: "d",
        text: "Post-process: delete any date that looks suspicious after generation",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Required-but-often-absent fields pressure the model into satisfying the validator with invented values. Expressing absence honestly (null) aligns the contract with reality; paired with explicit instructions, fabrication loses its incentive.",
    optionExplanations: {
      a: "Correct. Schemas must permit truthfulness; 'unknown' needs a representation.",
      b: "The dates do not exist; determination manufactures them.",
      c: "Sampling tweaks nudge variance, not honesty about missing data.",
      d: "Heuristic deletion trades fabrication for silent data loss with no traceability.",
    },
    principle:
      "Design schemas that allow the world to be unknown; forced presence manufactures facts.",
    tags: ["json schema", "validation", "extraction"],
    references: [
      {
        label: "Anthropic Docs – Structured outputs",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/forcing-tool-use",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-retry-error-context",
    domainId: "prompt-engineering",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "A document-to-JSON pipeline validates output and retries up to three times on failure. Currently it resends the identical request, and repeated identical failures are common.",
    question: "Which change makes retries effective?",
    options: [
      {
        id: "a",
        text: "Append the validator's specific errors and the offending output to the retry attempt so the model knows exactly what to fix",
      },
      { id: "b", text: "Raise the cap from three attempts to thirty" },
      { id: "c", text: "Randomize temperature on each retry for diversity" },
      { id: "d", text: "Switch to streaming mode during retries" },
    ],
    correctOptionIds: ["a"],
    explanation:
      "A retry without new information is a coin re-flip. Feeding precise validation errors ('amount_minor must be integer cents') turns each attempt into targeted correction, collapsing repeat-failure rates dramatically.",
    optionExplanations: {
      a: "Correct. Error-informed retries convert blind luck into guided repair.",
      b: "Thirty uninformed attempts cost 30× and usually reproduce the same mistake.",
      c: "Randomness explores alternatives aimlessly instead of repairing known defects.",
      d: "Transport mechanics do not change what the model knows about its failure.",
    },
    principle:
      "Every retry must carry information: name the violated rule and show the failed output.",
    tags: ["retries", "validation", "loops"],
    references: [
      {
        label: "Anthropic Docs – Prompt engineering",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-tagged-sections-provenance",
    domainId: "prompt-engineering",
    difficulty: "intermediate",
    type: "single-choice",
    question:
      "A summarization prompt receives ten source documents and must cite where each claim originated. Which prompting structure supports this best?",
    options: [
      {
        id: "a",
        text: "Wrap each document in tagged sections carrying metadata (source URL, title, date) and require citations referencing those tags",
      },
      {
        id: "b",
        text: "Concatenate all documents into one blob separated by blank lines",
      },
      {
        id: "c",
        text: "Request citations but provide no way to identify individual documents",
      },
      {
        id: "d",
        text: "Ask for citations only when the summary feels uncertain",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Structured separation of content and metadata gives every claim an addressable origin, making citations verifiable instead of decorative.",
    optionExplanations: {
      a: "Correct. Tags create stable identifiers; metadata creates provenance.",
      b: "Blobbed inputs make attribution structurally impossible.",
      c: "Unverifiable citation requests produce plausible-looking fabrications.",
      d: "Confidence-triggered citing misses precisely the confidently-wrong claims.",
    },
    principle:
      "Provenance requires structure: separate content from metadata and make origins addressable.",
    tags: ["provenance", "prompting structure", "citations"],
    references: [
      {
        label: "Anthropic Docs – Long context tips",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-golden-eval-set",
    domainId: "prompt-engineering",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "Your team iterates prompts weekly. Last month a 'small tweak' silently dropped extraction recall on edge cases; nobody noticed for two weeks.",
    question: "Which practice prevents recurrence?",
    options: [
      {
        id: "a",
        text: "Maintain a golden eval set covering documented hard cases and gate every prompt/model change on its results in CI",
      },
      {
        id: "b",
        text: "Review diffs manually and rely on reviewer memory of past regressions",
      },
      {
        id: "c",
        text: "Test only in production with real traffic monitoring",
      },
      {
        id: "d",
        text: "Freeze all prompt changes until certification launches",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Frozen, representative eval sets turn silent regressions into loud CI failures, making iteration fast and safe simultaneously — the same discipline code gets from unit tests.",
    optionExplanations: {
      a: "Correct. Evals are regression insurance; gating makes them enforceable.",
      b: "Human memory of subtle metric shifts does not scale or survive turnover.",
      c: "Production-only testing discovers regressions via users, at maximum cost.",
      d: "Iteration freezes protect quality by abandoning improvement — the opposite of sustainable.",
    },
    principle:
      "If a prompt cannot be evaluated automatically, it cannot be changed safely.",
    tags: ["evaluation", "regression", "ci/cd"],
    references: [
      {
        label: "Anthropic Docs – Evaluation tooling",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-evaluator",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-session-resume-vs-fresh",
    domainId: "context-reliability",
    difficulty: "advanced",
    type: "trade-off-analysis",
    scenario:
      "After a crash, an agent restarts with prior history available. Most of the transcript is valid, but a corrupted tool response injected contradictory instructions midway.",
    question: "Which trade-off analysis is correct?",
    options: [
      {
        id: "a",
        text: "Resume from compacted state built by filtering the corrupted span, preserving valid decisions with their sources; a fresh start would discard legitimate progress",
      },
      { id: "b", text: "Always resume the full transcript untouched" },
      {
        id: "c",
        text: "Always start completely fresh regardless of corruption location",
      },
      {
        id: "d",
        text: "Resume but append a note telling the model some earlier content may be wrong",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Resumption versus restart hinges on context validity. Compaction with sanitization preserves paid-for progress and provenance while surgically removing poison — strictly better than blanket policies.",
    optionExplanations: {
      a: "Correct. Validate, filter, compress, resume — proportionate to where corruption sits.",
      b: "Faithfully resuming known-corrupted history re-injects the attack.",
      c: "Discarding all valid work punishes users for one bad span.",
      d: "Warning about poison is weaker than removing it; contradictions still compete for attention.",
    },
    principle:
      "Choose resumption by validity: sanitize and compact when possible, restart only when trust cannot be restored.",
    tags: ["session management", "crash recovery", "context"],
    references: [
      {
        label: "Anthropic Engineering – Context engineering",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-error-taxonomy-routing",
    domainId: "context-reliability",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "Tool errors in your agent all surface as generic strings. Ops wants automatic handling, and compliance demands an audit trail distinguishing outages from misuse from unauthorized attempts.",
    question: "Which design satisfies both?",
    options: [
      {
        id: "a",
        text: "Structured error payloads carrying errorCategory (transient/validation/permission) plus trace IDs, with handlers branching per category and every event logged",
      },
      {
        id: "b",
        text: "Regex over error strings to guess categories at the dashboard layer",
      },
      {
        id: "c",
        text: "Log full transcripts only; humans triage weekly",
      },
      {
        id: "d",
        text: "Treat all failures as transient with uniform retries to keep code simple",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Typed errors serve machines (deterministic branching: backoff vs correct vs escalate) and auditors (queryable, attributable events) simultaneously — stringly-typed failures serve neither.",
    optionExplanations: {
      a: "Correct. Categories drive behavior; trace IDs drive accountability.",
      b: "String matching breaks silently as messages evolve; audits inherit the fragility.",
      c: "Weekly human triage neither prevents damage nor scales with traffic.",
      d: "Uniform retries hammer permission walls during outages and corrupt audit meaning.",
    },
    principle:
      "Errors are data: category for control flow, trace ID for accountability.",
    tags: ["error propagation", "observability", "audit"],
    references: [
      {
        label: "Anthropic Docs – Tool use error handling",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/handling-tool-use-errors",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-context-budget-math",
    domainId: "context-reliability",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "A support session averages 900 tokens per exchange. After 40 exchanges the model starts contradicting early constraints, and per-exchange cost has doubled because the entire history ships every call.",
    question: "Which intervention directly addresses both contradiction and cost growth?",
    options: [
      {
        id: "a",
        text: "Checkpoint-summarize resolved threads into structured state and resume with compact state plus recent turns",
      },
      {
        id: "b",
        text: "Double the context window setting and continue unchanged",
      },
      {
        id: "c",
        text: "Instruct the model to ignore older messages when conflicts arise",
      },
      {
        id: "d",
        text: "Reduce max_tokens per response to cut cost",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Compaction attacks both symptoms at once: shipped tokens shrink (cost) and durable facts live in curated state instead of diluted attention (consistency). Window expansion and ignoring advice treat neither mechanism.",
    optionExplanations: {
      a: "Correct. Compress the past, keep the recent, persist decisions with provenance.",
      b: "Larger windows raise ceilings and costs; dilution dynamics remain.",
      c: "'Ignore' instructions compete within the same overloaded attention.",
      d: "Shorter replies do not shrink the growing history payload driving cost.",
    },
    principle:
      "Context is a budget: checkpoint resolved work, resume compact, cite what you kept.",
    tags: ["summarization", "context windows", "cost"],
    references: [
      {
        label: "Anthropic Docs – Context windows",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-trace-debugging",
    domainId: "context-reliability",
    difficulty: "advanced",
    type: "debugging",
    scenario:
      "Users report inconsistent answers to identical questions across sessions. You have only final-response logs: no intermediate steps, no token counts, no tool-call records.",
    question: "What is the minimum instrumentation addition that enables real diagnosis?",
    options: [
      {
        id: "a",
        text: "Per-iteration traces capturing inputs, tool calls with arguments/results, outputs, and token counts, correlated by a session trace ID",
      },
      { id: "b", text: "Log model temperature settings per request" },
      {
        id: "c",
        text: "Store user ratings and correlate them with response length",
      },
      {
        id: "d",
        text: "Capture screenshots of the console during local reproduction attempts",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Non-determinism diagnosis requires seeing the decision path: which tools ran, with what data, producing which intermediates. Trace IDs stitch those spans into replayable sessions.",
    optionExplanations: {
      a: "Correct. Full-path observability turns mystery inconsistencies into diffable executions.",
      b: "Sampling config is one variable among many; alone it explains little.",
      c: "Ratings measure outcomes, not causes; length correlates with nothing diagnostic here.",
      d: "Local screenshots cannot capture server-side nondeterminism across sessions.",
    },
    principle:
      "You cannot debug what you did not record: instrument every iteration, correlate by trace.",
    tags: ["observability", "tracing", "debugging"],
    references: [
      {
        label: "Anthropic Console – Traces & observability",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/observability",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-pagination-semantics",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "debugging",
    scenario:
      "A search_emails tool silently returns only the first 25 matches. Users complain the agent 'misses' emails that exist; the model frequently asserts an email is not present.",
    question: "What is the root cause and fix?",
    options: [
      {
        id: "a",
        text: "The description never documents truncation; document pagination explicitly (has_more, cursor param) or return a truncated flag so absence claims stay honest",
      },
      {
        id: "b",
        text: "Return all matching emails always, regardless of size",
      },
      { id: "c", text: "Tell Claude in the system prompt that results may be partial" },
      {
        id: "d",
        text: "Raise an error when more than 25 results exist so the model knows",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Undocumented truncation turns a correct-sounding 'no such email' into a false claim. The contract must expose pagination (cursor + has_more) or at minimum a truncated marker, letting the agent fetch more pages or hedge its answer truthfully.",
    optionExplanations: {
      a: "Correct. Truncation is part of the output contract; models can only be honest about what the contract discloses.",
      b: "Unbounded returns explode token costs and context windows on large mailboxes.",
      c: "A global hint cannot tell the model which specific calls were cut short.",
      d: "Errors imply malfunction; 'many matches' is success requiring continuation, not failure.",
    },
    principle:
      "Partial data without disclosure manufactures confident falsehoods; contracts must surface truncation.",
    tags: ["tool design", "pagination"],
    references: [
      {
        label: "Anthropic Docs – Tool use best practices",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices-and-troubleshooting",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-idempotency-keys",
    domainId: "tool-design-mcp",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "Your agent retries create_payment after a timeout. The first attempt actually succeeded, so the customer is charged twice.",
    question: "Which tool-design mechanism prevents this?",
    options: [
      {
        id: "a",
        text: "Require an idempotency key parameter on mutating tools so repeated calls with the same key collapse into one effect",
      },
      {
        id: "b",
        text: "Set temperature to 0 so the agent does not retry randomly",
      },
      {
        id: "c",
        text: "Disable automatic retries entirely for write tools",
      },
      {
        id: "d",
        text: "Add a confirmation prompt asking the user before every retry",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Timeouts make outcome ambiguity unavoidable — you cannot know if the server applied the write. Idempotency keys let clients retry safely because the upstream deduplicates by key, which is exactly how payment APIs solve it.",
    optionExplanations: {
      a: "Correct. Deduplication by key converts ambiguous timeouts into safe retries.",
      b: "Sampling settings do not govern transport-level retry logic.",
      c: "Removing retries trades double-charge risk for guaranteed failures during transient faults.",
      d: "Humans cannot distinguish 'failed' from 'succeeded but response lost' any better than code can — and now they are a latency bottleneck too.",
    },
    principle:
      "Any tool whose retries could duplicate side effects needs idempotency keys designed in from day one.",
    tags: ["retries", "idempotency", "tool design"],
    references: [
      {
        label: "Anthropic Docs – Handling tool use errors",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/handling-tool-use-errors",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-tool-list-token-cost",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "trade-off-analysis",
    scenario:
      "An assistant exposes 80 MCP tools year-round. Selection errors rise, and every request pays the token cost of 80 schemas even though most tasks need three tools.",
    question: "Which analysis is strongest?",
    options: [
      {
        id: "a",
        text: "Both symptoms share one cause: oversized always-on surfaces. Consolidate overlapping tools and load tool groups per task/domain (or via multiple scoped MCP servers) so each request carries only relevant capabilities",
      },
      {
        id: "b",
        text: "Keep all 80 tools but shorten descriptions to one line to save tokens",
      },
      { id: "c", text: "Increase max_tokens to accommodate selection mistakes" },
      {
        id: "d",
        text: "Ask users to memorize tool names and request them explicitly",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Tool lists consume context on every call and compete during selection. Shrinking the surface — consolidation plus per-task loading through grouped servers — fixes accuracy and cost simultaneously.",
    optionExplanations: {
      a: "Correct. Surface area is the root variable; reduce it structurally, not cosmetically.",
      b: "Starved descriptions worsen mis-selection — the exact symptom being treated.",
      c: "Bigger budgets pay for more wrong answers with no selection benefit.",
      d: "Pushing interface memory onto users defeats the purpose of natural-language tool use.",
    },
    principle:
      "Every tool on the list taxes every request twice: tokens on input, attention during selection.",
    tags: ["tool design", "context windows", "mcp"],
    references: [
      {
        label: "Anthropic Engineering – Effective context engineering",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-schema-enum-vs-freetext",
    domainId: "tool-design-mcp",
    difficulty: "beginner",
    type: "single-choice",
    question:
      "A deploy tool accepts environment as a free-text string. Calls arrive with 'prod', 'production', 'Prod', and ' prd '. Which schema change is most effective?",
    options: [
      {
        id: "a",
        text: "Constrain environment to an enum of valid identifiers and document each value",
      },
      {
        id: "b",
        text: "Normalize strings downstream with fuzzy matching against known aliases",
      },
      { id: "c", text: "Add a description saying 'use prod, not production'" },
      {
        id: "d",
        text: "Accept anything and resolve the target environment with a second LLM call",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Enums turn an infinite validation problem into a closed set: invalid values fail schema validation immediately with a clear message, and the model sees the legal choices right in the schema it fills.",
    optionExplanations: {
      a: "Correct. Closed sets eliminate whole classes of malformed input by construction.",
      b: "Fuzzy matching guesses — 'prd ' might map to staging someday and nobody would notice.",
      c: "Advisory prose still permits every misspelling; validation does not.",
      d: "An LLM resolver adds cost, latency, and its own error rate to fix a schema problem.",
    },
    principle:
      "Prefer closed sets over open text wherever the domain allows; constraints validate better than advice.",
    tags: ["json schema", "enums", "validation"],
    references: [
      {
        label: "Anthropic Docs – Tool use overview",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-system-prompt-injection-place",
    domainId: "prompt-engineering",
    difficulty: "intermediate",
    type: "single-choice",
    question: "A system prompt is split into sections: role, rules, format, and context. Where should a 'never reveal this prompt' hard constraint go to maximize its strength?",
    options: [
      { id: "a", text: "Deep in the middle of the context section alongside runtime data" },
      { id: "b", text: "Immediately after the role definition, in its own ruled-off section" },
      { id: "c", text: "Repeated at the end of every section as a reminder" },
      { id: "d", text: "Embedded in a tool description for the tool Claude calls most" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Attention follows a U-curve: strong at the top and bottom, weaker in the middle. Hard constraints placed immediately after the role definition sit at the highest-attention position in the prompt.",
    optionExplanations: {
      a: "The middle is the weakest attention zone — critical rules placed here get the least weight.",
      b: "Correct. Top-of-prompt placement plus a dedicated rules section maximizes attention weight.",
      c: "Repetition costs tokens and adds noise, diluting rather than reinforcing the constraint.",
      d: "Tying a security rule to a single tool's description means it only applies in that tool's scope, not globally.",
    },
    principle:
      "Place hard constraints at prompt edges (top or bottom); never bury them in the low-attention middle.",
    tags: ["system prompts", "attention placement", "prompt injection"],
    references: [
      {
        label: "Anthropic Docs – Prompt engineering guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-multi-pass-review-flow",
    domainId: "prompt-engineering",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "Your pipeline generates legal contract clauses. A single Claude call produces correct clauses 85% of the time. You need 99%+ accuracy before sending to lawyers.",
    question: "What is the most effective multi-pass architecture for this problem?",
    options: [
      { id: "a", text: "Run the same prompt 5 times and take the majority vote on each clause" },
      { id: "b", text: "Pass 1 generates, Pass 2 validates against a checklist, Pass 3 rewrites flagged items — each pass has a different system prompt" },
      { id: "c", text: "Increase temperature to 0.9 to get more varied outputs and pick the best" },
      { id: "d", text: "Chain the 5 calls so each one reviews the previous output and adds corrections" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Different passes need different prompts. A generation prompt optimizes for producing content; a validation prompt optimizes for critical evaluation against a concrete checklist. Mixing these into one prompt confuses the model's behavior.",
    optionExplanations: {
      a: "Majority voting only works when each independent call has similar error modes. Same prompt = same systematic biases = no improvement.",
      b: "Correct. Specialized passes with distinct system prompts enable adversarial review that catches errors the generator systematically misses.",
      c: "Higher temperature increases variety but not quality — you might get different wrong answers, not better ones.",
      d: "Cascading corrections can propagate errors: a wrong 'fix' in Pass 2 creates new problems in Pass 3 that compound.",
    },
    principle:
      "Multi-pass systems work when each pass has a specialized role, clear success criteria, and independent evaluation.",
    tags: ["multi-pass review", "validation", "pipeline design"],
    references: [
      {
        label: "Anthropic Docs – Multi-step processing",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multi-step-processing",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-tool-use-examples-pattern",
    domainId: "prompt-engineering",
    difficulty: "beginner",
    type: "single-choice",
    question: "When using tool use, where should example tool calls appear in the system prompt?",
    options: [
      { id: "a", text: "In the tool description itself, alongside the parameter schema" },
      { id: "b", text: "In a dedicated 'examples' section of the system prompt, after the rules" },
      { id: "c", text: "Embedded in the user message at runtime" },
      { id: "d", text: "Tool use examples are unnecessary — the schema alone is sufficient" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "The tool description explains what the tool does; example calls demonstrate how to use it in context. Placing them in the system prompt at a high-attention position ensures the model sees the pattern before filling in parameters.",
    optionExplanations: {
      a: "Tool descriptions should explain the tool's purpose and parameters. Mixing in examples blurs the schema definition.",
      b: "Correct. A dedicated examples section in the system prompt gives Claude a concrete pattern to follow when deciding how to call tools.",
      c: "User messages are for the actual task, not teaching the model how to use tools — tool use patterns belong in the system prompt.",
      d: "Schemas define the shape of input; examples show the intent and conventions. Both are needed for complex tools.",
    },
    principle:
      "Tool use examples in the system prompt bridge the gap between 'what parameters are valid' and 'how should I actually call this'.",
    tags: ["tool use", "few-shot prompting", "system prompts"],
    references: [
      {
        label: "Anthropic Docs – Tool use best practices",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-eval-criteria-rubric",
    domainId: "prompt-engineering",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "You're building an eval suite for an agent that writes SQL queries. The queries sometimes return correct data but use inefficient JOINs, or use correct JOINs but select wrong columns.",
    question: "What is the best eval design for catching both failure modes?",
    options: [
      { id: "a", text: "A single binary pass/fail rubric: 'Does the query return correct results?'" },
      { id: "b", text: "Separate rubrics per dimension: result accuracy, JOIN efficiency, column selection — each scored independently" },
      { id: "c", text: "A human review step that catches everything after the fact" },
      { id: "d", text: "Run each query against a live database and compare output to expected" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Multidimensional failures need multidimensional rubrics. A single pass/fail masks whether the query was close (right columns, wrong JOIN) or completely wrong. Independent scoring per dimension tells you exactly what to fix in the prompt or tool definition.",
    optionExplanations: {
      a: "Binary pass/fail cannot distinguish between 'almost right' and 'completely wrong' — you lose diagnostic signal.",
      b: "Correct. Per-dimension scoring gives actionable feedback: if JOIN scores drop after a prompt change, you know exactly what regressed.",
      c: "Human review is expensive and doesn't scale to every PR. Eval suites catch regressions automatically before humans need to look.",
      d: "Execution-based eval is the gold standard but requires a live database. Rubric-based eval is a faster, offline complement.",
    },
    principle:
      "Design eval rubrics per dimension of quality; single-number scores mask where problems actually are.",
    tags: ["evaluation", "rubric design", "multi-dimensional"],
    references: [
      {
        label: "Anthropic Docs – Evaluation best practices",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-context-degradation-signals",
    domainId: "context-reliability",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "Your customer support agent has been running for 45 minutes. Responses are getting slower and less relevant, but no errors are being thrown.",
    question: "What are the two most reliable early signals that context degradation is occurring?",
    options: [
      { id: "a", text: "Latency increases and response length increases" },
      { id: "b", text: "Response length increases and tool call accuracy decreases" },
      { id: "c", text: "Memory usage increases and API rate limits are hit" },
      { id: "d", text: "Token count increases and temperature setting changes" },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Growing response length is a classic degradation signal — Claude pads responses as it loses focus on the core instruction. Tool call accuracy decreasing means the model is losing track of tool schemas buried deep in the context.",
    optionExplanations: {
      a: "Latency correlates with context length but is not itself a degradation signal — it's a consequence, not an indicator of quality loss.",
      b: "Correct. Longer responses + declining tool accuracy are the two earliest behavioral signals of context window pressure.",
      c: "Memory and rate limits are infrastructure metrics, not quality signals. They tell you something is wrong, not what.",
      d: "Temperature doesn't change automatically during a session; it's a static configuration.",
    },
    principle:
      "Monitor behavioral outputs (response length, tool accuracy) rather than infrastructure metrics (latency, memory) for degradation signals.",
    tags: ["context degradation", "monitoring", "reliability"],
    references: [
      {
        label: "Anthropic Docs – Context window management",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-session-resume-architecture",
    domainId: "context-reliability",
    difficulty: "advanced",
    type: "single-choice",
    scenario:
      "A legal research agent ran for 2 hours last week, producing a detailed case analysis. A lawyer now needs to continue the research with follow-up questions.",
    question: "What is the most architecturally sound approach to resuming this session?",
    options: [
      { id: "a", text: "Store the full 2-hour conversation and replay it verbatim into the context window" },
      { id: "b", text: "Recreate the session from scratch using the original user queries only" },
      { id: "c", text: "Load a structured checkpoint of key findings, active questions, and provenance — start a fresh conversation from that checkpoint" },
      { id: "d", text: "Continue the original session without changes — the API handles persistence automatically" },
    ],
    correctOptionIds: ["c"],
    explanation:
      "Full replay is too large for the context window and wastes tokens on dead-end exploration. Starting fresh loses accumulated knowledge. A structured checkpoint captures what matters — key findings, unresolved questions, source references — in a compact form that fits in a new session.",
    optionExplanations: {
      a: "A 2-hour conversation can be hundreds of thousands of tokens — it won't fit in the context window and most of it is irrelevant dead ends.",
      b: "Recreating from scratch means the agent re-does all exploration, burning tokens and time, and may not reproduce the same analysis.",
      c: "Correct. Structured checkpoints capture durable knowledge compactly while fresh context gives the model room to think about new questions.",
      d: "API sessions are stateless by default — you must implement persistence yourself. Even with session storage, raw transcripts grow too large to reload.",
    },
    principle:
      "Design for resumability: persist structured checkpoints, not raw transcripts. Fresh context + checkpoint knowledge beats replay.",
    tags: ["session management", "context window", "resumability"],
    references: [
      {
        label: "Anthropic Engineering – Effective context engineering",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
    ],
    isOfficial: false,
  },
];
