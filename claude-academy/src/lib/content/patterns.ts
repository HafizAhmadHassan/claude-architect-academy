import type { DomainId } from "./types";

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Pattern {
  id: string;
  name: string;
  domainIds: DomainId[];
  complexity: "low" | "medium" | "high";
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  benefits: string[];
  drawbacks: string[];
  reliability: string;
  diagram: { nodes: DiagramNode[]; edges: DiagramEdge[] };
}

const N = (
  id: string,
  label: string,
  x: number,
  y: number
): DiagramNode => ({ id, label, x, y });

export const patterns: Pattern[] = [
  {
    id: "single-agent",
    name: "Single agent",
    domainIds: ["agentic-architecture"],
    complexity: "low",
    summary:
      "One model instance with a tool set completes the whole task in a single conversational loop. The default starting point.",
    whenToUse: [
      "Task fits one context window and one persona",
      "Tool count is small enough for reliable selection",
      "You need the simplest thing that can work",
    ],
    whenNotToUse: [
      "Subtasks need different tool scopes or permissions",
      "Context would exceed practical limits",
      "Independent subtasks could run concurrently",
    ],
    benefits: ["Simplest to build, debug, and reason about", "Fewest moving parts and failure modes", "Cheapest infrastructure"],
    drawbacks: ["Does not scale with task breadth or context size", "One prompt carries all responsibilities"],
    reliability:
      "Bound it with stop conditions plus a turn budget, and instrument every tool call — single agents fail by looping or guessing.",
    diagram: {
      nodes: [N("u", "User", 20, 98), N("a", "Agent + tools", 250, 98), N("t", "Tools", 490, 98)],
      edges: [
        { from: "u", to: "a", label: "goal" },
        { from: "a", to: "t", label: "calls" },
        { from: "t", to: "a", label: "results" },
      ],
    },
  },
  {
    id: "agentic-loop",
    name: "Agentic loop",
    domainIds: ["agentic-architecture"],
    complexity: "low",
    summary:
      "The core runtime pattern: model responds, requests tools, your code executes them, results return as tool_result blocks — until stop_reason signals completion.",
    whenToUse: [
      "The path to the answer cannot be predicted upfront",
      "Actions depend on observations from previous steps",
    ],
    whenNotToUse: [
      "A fixed sequence of known steps suffices — use a workflow instead",
      "No tools are needed at all",
    ],
    benefits: ["Handles open-ended tasks adaptively", "Structured termination via stop_reason"],
    drawbacks: ["Unbounded cost/latency without budgets", "Fails silently when tool results are not wired back"],
    reliability:
      "Every tool_use must receive a tool_result. Add turn budgets as a safety net and log each iteration with token counts.",
    diagram: {
      nodes: [N("l", "LLM", 40, 40), N("p", "Parse tool calls", 270, 40), N("x", "Execute", 500, 40), N("r", "tool_result → messages", 270, 150), N("d", "Done (end_turn)", 40, 150)],
      edges: [
        { from: "l", to: "p" },
        { from: "p", to: "x", label: "stop_reason=tool_use" },
        { from: "x", to: "r" },
        { from: "r", to: "l", label: "next iteration" },
        { from: "l", to: "d", label: "stop_reason=end_turn" },
      ],
    },
  },
  {
    id: "orchestrator-subagents",
    name: "Orchestrator / subagents",
    domainIds: ["agentic-architecture"],
    complexity: "high",
    summary:
      "A lead agent decomposes the goal, dispatches focused subagents with scoped briefs and minimal tools, and synthesizes structured findings.",
    whenToUse: [
      "Subtasks are separable and benefit from isolation",
      "Different phases need different tool scopes",
      "Parallelizable independent research or analysis",
    ],
    whenNotToUse: [
      "Task is small enough for one loop",
      "Subtasks share heavy mutable state",
      "Latency of coordination outweighs gains",
    ],
    benefits: ["Clean permission boundaries per subagent", "Main context stays compact via findings handoffs", "Independent work parallelizes"],
    drawbacks: ["More infrastructure and failure surfaces", "Contract design between agents takes discipline"],
    reliability:
      "Pass conclusions with provenance between agents — never raw transcripts. Give every subagent its own budget and error contract.",
    diagram: {
      nodes: [N("o", "Orchestrator", 240, 20), N("s1", "Researcher A", 60, 130), N("s2", "Researcher B", 420, 130), N("w", "Writer", 240, 210)],
      edges: [
        { from: "o", to: "s1", label: "brief" },
        { from: "o", to: "s2", label: "brief" },
        { from: "s1", to: "w", label: "findings" },
        { from: "s2", to: "w", label: "findings" },
      ],
    },
  },
  {
    id: "sequential-workflow",
    name: "Sequential workflow",
    domainIds: ["agentic-architecture", "prompt-engineering"],
    complexity: "low",
    summary:
      "Fixed pipeline of LLM steps where each stage's output feeds the next. Predictable, testable, cheap — the workflow side of the workflows-vs-agents divide.",
    whenToUse: [
      "Steps are known, ordered, and stable",
      "Each stage benefits from a specialized prompt",
      "You need deterministic cost and latency profiles",
    ],
    whenNotToUse: [
      "Later steps cannot know what they need until runtime",
      "Stage count would explode combinatorially",
    ],
    benefits: ["Predictable cost, latency, failure points", "Every stage independently evaluable"],
    drawbacks: ["Brittle to unexpected inputs mid-pipeline", "Cannot adapt path based on discoveries"],
    reliability:
      "Validate between stages; make each stage idempotent so the pipeline can resume from the last checkpoint after failures.",
    diagram: {
      nodes: [N("i", "Input", 20, 98), N("s1", "Extract", 200, 98), N("s2", "Transform", 380, 98), N("s3", "Summarize", 545, 98)],
      edges: [{ from: "i", to: "s1" }, { from: "s1", to: "s2" }, { from: "s2", to: "s3" }],
    },
  },
  {
    id: "parallel-agents",
    name: "Parallel agents (fan-out / fan-in)",
    domainIds: ["agentic-architecture"],
    complexity: "medium",
    summary:
      "Independent subtasks dispatch concurrently; a synchronization point waits for all before dependent work begins.",
    whenToUse: [
      "Multiple independent lookups, analyses, or drafts",
      "Wall-clock latency matters more than per-call cost",
      "Batch evaluation across many items",
    ],
    whenNotToUse: [
      "Tasks depend on each other's outputs",
      "Upstream rate limits punish concurrency",
      "Cost multiplies without latency payoff",
    ],
    benefits: ["Latency ≈ slowest branch, not the sum", "Isolation limits blast radius per branch"],
    drawbacks: ["N× token spend", "Requires careful join semantics on partial failure"],
    reliability:
      "Decide upfront what happens when one branch fails: retry, degrade, or abort the join. Never let one hung branch block the fan-in forever — add per-branch timeouts.",
    diagram: {
      nodes: [N("c", "Coordinator", 250, 30), N("a", "Branch A", 60, 120), N("b", "Branch B", 250, 120), N("cc", "Branch C", 440, 120), N("j", "Join", 250, 205)],
      edges: [
        { from: "c", to: "a" }, { from: "c", to: "b" }, { from: "c", to: "cc" },
        { from: "a", to: "j" }, { from: "b", to: "j" }, { from: "cc", to: "j", label: "sync" },
      ],
    },
  },
  {
    id: "human-in-the-loop",
    name: "Human-in-the-loop gate",
    domainIds: ["agentic-architecture", "claude-code-workflows"],
    complexity: "medium",
    summary:
      "Irreversible or regulated actions pause at a programmatic boundary where a human approves structured proposals before execution.",
    whenToUse: [
      "Actions are irreversible or externally visible (payments, emails, deletes)",
      "Compliance requires named human approval",
      "Model confidence is structurally unverifiable",
    ],
    whenNotToUse: [
      "Read-only or reversible operations (gate everything = no automation)",
      "Genuinely time-critical paths with no reviewer coverage",
    ],
    benefits: ["Bounded blast radius for worst-case errors", "Audit trail with named accountability"],
    drawbacks: ["Queue latency on write paths", "Reviewer fatigue if gates are poorly targeted"],
    reliability:
      "Gate structurally (action class, thresholds), never on uncalibrated model confidence. Queue proposals asynchronously rather than blocking forever.",
    diagram: {
      nodes: [N("ag", "Agent", 40, 98), N("q", "Proposal queue", 280, 98), N("h", "Human review", 520, 40), N("ex", "Execute", 520, 156)],
      edges: [
        { from: "ag", to: "q", label: "structured proposal" },
        { from: "q", to: "h", label: "pending" },
        { from: "h", to: "ex", label: "approve" },
        { from: "h", to: "q", label: "reject" },
      ],
    },
  },
  {
    id: "tool-gateway",
    name: "Tool gateway",
    domainIds: ["tool-design-mcp"],
    complexity: "medium",
    summary:
      "All tool execution funnels through one policy layer that validates arguments, checks permissions, applies rate limits, and normalizes errors before anything reaches upstream systems.",
    whenToUse: [
      "Multiple agents share dangerous capabilities",
      "You need one chokepoint for audit logging",
      "Policy changes should not require touching agents",
    ],
    whenNotToUse: [
      "Single-agent prototypes where indirection buys nothing yet",
      "Extremely latency-sensitive local tools",
    ],
    benefits: ["Enforcement is programmatic and centralized", "Uniform typed errors for every caller", "Rate limiting and audit fall out for free"],
    drawbacks: ["Gateway becomes critical-path infrastructure", "Extra hop adds latency"],
    reliability:
      "Return category-typed errors (transient / validation / permission) from the gateway itself so agents branch deterministically even when upstreams differ.",
    diagram: {
      nodes: [N("ag", "Agents", 40, 98), N("g", "Gateway: validate · authorize · log", 265, 98), N("up1", "CRM API", 520, 30), N("up2", "Payments API", 520, 98), N("up3", "Internal DB", 520, 166)],
      edges: [{ from: "ag", to: "g", label: "typed calls" }, { from: "g", to: "up1" }, { from: "g", to: "up2" }, { from: "g", to: "up3" }],
    },
  },
  {
    id: "mcp-integration",
    name: "MCP integration",
    domainIds: ["tool-design-mcp"],
    complexity: "medium",
    summary:
      "Standardized context architecture: hosts embed clients that connect to out-of-process servers exposing tools, resources, and prompts over stdio or HTTP transports.",
    whenToUse: [
      "Capabilities must serve multiple host apps (Claude Code, Desktop, custom)",
      "Integrations outlive any single application",
      "Third parties should be able to extend your system",
    ],
    whenNotToUse: [
      "One-off internal automation with a single consumer",
      "Capabilities too trivial to justify process separation",
    ],
    benefits: ["Write once, connect from any MCP host", "Servers are natural credential and permission boundaries", "Ecosystem interop"],
    drawbacks: ["Protocol and transport lifecycle to manage", "Versioning across hosts and servers"],
    reliability:
      "One server per system, credentials scoped to declared capabilities, resources for read-only context, tools for actions — and never tokens through model context.",
    diagram: {
      nodes: [N("h", "Host app", 40, 98), N("cl", "MCP client", 220, 98), N("sv", "MCP server", 420, 40), N("rs", "Resources", 545, 130), N("tl", "Tools", 330, 165)],
      edges: [
        { from: "h", to: "cl", label: "embeds" },
        { from: "cl", to: "sv", label: "JSON-RPC transport" },
        { from: "sv", to: "rs" },
        { from: "sv", to: "tl" },
      ],
    },
  },
  {
    id: "validation-retry",
    name: "Validation / informed retry",
    domainIds: ["prompt-engineering", "context-reliability"],
    complexity: "low",
    summary:
      "Outputs pass programmatic validation; failures feed the validator's specific complaints back into the next attempt, turning blind retries into guided repair.",
    whenToUse: [
      "Machine-checkable outputs (schemas, business rules)",
      "Generation quality varies run to run",
      "Downstream systems reject malformed records",
    ],
    whenNotToUse: [
      "Outputs already forced valid by API-level structured output + schema honesty",
      "Validation itself is subjective or expensive",
    ],
    benefits: ["Converts flaky generation into bounded convergence", "Retry logs document exactly why outputs failed"],
    drawbacks: ["Multiplies token cost per failure", "Needs capped attempts or pathological inputs spin"],
    reliability:
      "Cap retries, distinguish transient from validation failures, and add idempotency keys wherever retries touch side effects.",
    diagram: {
      nodes: [N("g", "Generate", 60, 98), N("v", "Validate", 300, 98), N("ok", "Accept", 545, 40), N("f", "Feed errors back", 300, 180)],
      edges: [
        { from: "g", to: "v" },
        { from: "v", to: "ok", label: "valid" },
        { from: "v", to: "f", label: "invalid" },
        { from: "f", to: "g", label: "retry ≤ cap" },
      ],
    },
  },
  {
    id: "evaluator",
    name: "Evaluator / LLM-as-judge",
    domainIds: ["prompt-engineering"],
    complexity: "medium",
    summary:
      "A second model call scores primary output against a rubric — enabling quality filtering, ranking, or routing beyond what schema checks can express.",
    whenToUse: [
      "Quality has dimensions code cannot measure (tone, completeness, groundedness)",
      "Routing: escalate only outputs scoring below threshold",
      "Scaling review capacity ahead of scarce human reviewers",
    ],
    whenNotToUse: [
      "Deterministic checks suffice — save the extra inference cost",
      "Rubric is so fuzzy the judge disagrees with itself run-to-run",
    ],
    benefits: ["Automates nuanced quality assessment", "Creates training signal for prompt iteration"],
    drawbacks: ["Judge bias and inconsistency", "Doubles inference cost"],
    reliability:
      "Calibrate judges against labeled human ratings; report agreement rates. Never let an uncalibrated judge gate irreversible actions.",
    diagram: {
      nodes: [N("p", "Producer", 40, 98), N("j", "Judge + rubric", 300, 98), N("hi", "High score → ship", 545, 40), N("lo", "Low score → revise/escalate", 545, 156)],
      edges: [{ from: "p", to: "j" }, { from: "j", to: "hi" }, { from: "j", to: "lo" }],
    },
  },
  {
    id: "multi-pass-review",
    name: "Multi-pass review",
    domainIds: ["prompt-engineering", "agentic-architecture"],
    complexity: "medium",
    summary:
      "The same artifact passes through several specialized critiques — correctness, security, style — with revisions between passes, instead of one generalist review.",
    whenToUse: [
      "High-stakes documents, PRs, or contracts",
      "Distinct expertise dimensions matter",
      "Single-pass reviews miss alternating defect types",
    ],
    whenNotToUse: [
      "Artifact value does not justify multiple passes",
      "Deadline tolerates neither the latency nor cost",
    ],
    benefits: ["Each pass holds one lens — higher catch rates per dimension", "Findings arrive pre-triaged by specialty"],
    drawbacks: ["Latency and cost scale linearly with passes", "Later passes may churn earlier fixes"],
    reliability:
      "Freeze the artifact between passes and diff revisions; require each pass to cite exact lines so findings stay verifiable.",
    diagram: {
      nodes: [N("d", "Draft", 40, 98), N("c1", "Correctness pass", 260, 30), N("c2", "Security pass", 260, 98), N("c3", "Clarity pass", 260, 166), N("f", "Final", 520, 98)],
      edges: [
        { from: "d", to: "c1" }, { from: "d", to: "c2" }, { from: "d", to: "c3" },
        { from: "c1", to: "f", label: "findings" }, { from: "c2", to: "f" }, { from: "c3", to: "f" },
      ],
    },
  },
  {
    id: "context-compression",
    name: "Context compression (checkpoint & resume)",
    domainIds: ["context-reliability"],
    complexity: "high",
    summary:
      "Long sessions periodically compress resolved work into durable structured state with provenance; each turn resumes with compact state plus recent messages.",
    whenToUse: [
      "Sessions routinely exceed comfortable window sizes",
      "Early commitments must survive weeks (support tickets)",
      "Per-call cost grows linearly with history",
    ],
    whenNotToUse: [
      "Short sessions far under window limits",
      "State so interdependent it cannot be summarized safely",
    ],
    benefits: ["Bounds attention dilution and shipping cost", "Commitments become queryable durable facts"],
    drawbacks: ["Compression can drop load-bearing nuance", "Merge policy needs real design"],
    reliability:
      "Keep provenance on every fact, sanitize corrupted spans before resuming, and write an explicit merge policy for state fields.",
    diagram: {
      nodes: [N("t", "Turns 1..N", 40, 98), N("ck", "Checkpoint summarizer", 280, 40), N("st", "Durable facts + sources", 520, 40), N("re", "Resume: state + recent turns", 280, 160)],
      edges: [
        { from: "t", to: "ck", label: "resolved thread" },
        { from: "ck", to: "st" },
        { from: "st", to: "re", label: "compact resume" },
        { from: "t", to: "re", label: "last N messages" },
      ],
    },
  },
  {
    id: "escalation",
    name: "Escalation ladder",
    domainIds: ["context-reliability", "agentic-architecture"],
    complexity: "medium",
    summary:
      "Failures climb a defined ladder — retry, alternative strategy, degraded mode, human — with calibrated triggers deciding when each rung fires.",
    whenToUse: [
      "Mixed traffic: most requests easy, some genuinely hard",
      "Autonomy must degrade gracefully instead of failing hard",
      "Review capacity is finite and must go where it matters",
    ],
    whenNotToUse: [
      "Every failure deserves full human attention anyway",
      "No calibrated signal exists to trigger rungs",
    ],
    benefits: ["Predictable behavior under partial failure", "Scarce human attention routes to hardest cases"],
    drawbacks: ["Threshold calibration is ongoing work", "Mis-calibration hides problems below the noise"],
    reliability:
      "Triggers come from typed error categories and calibrated scores trained on labeled outcomes — never self-reported model confidence.",
    diagram: {
      nodes: [N("e", "Error detected", 40, 98), N("r1", "Rung 1: retry w/ backoff", 280, 30), N("r2", "Rung 2: alternate strategy", 280, 98), N("h", "Rung 3: human queue", 520, 166)],
      edges: [
        { from: "e", to: "r1", label: "transient" },
        { from: "r1", to: "e", label: "failed again" },
        { from: "e", to: "r2", label: "validation" },
        { from: "e", to: "h", label: "permission / repeated" },
      ],
    },
  },
];
