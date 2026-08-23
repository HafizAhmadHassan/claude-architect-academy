import type { DomainId } from "./types";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  durationWeeks: number;
  domainIds: DomainId[];
  description: string;
  skillsProven: string[];
  deliverables: string[];
  rubric: string[];
  startFromLabId?: string;
}

export const projects: Project[] = [
  {
    id: "support-agent-platform",
    title: "Production support agent platform",
    tagline: "The exam's favorite scenario, built for real",
    durationWeeks: 3,
    domainIds: ["agentic-architecture", "context-reliability", "tool-design-mcp"],
    description:
      "A customer-support agent that reads tickets autonomously, proposes writes through an approval queue, survives multi-day sessions via checkpoint summarization, and passes a mock compliance review. This is the scenario family the exam describes most — building it makes those questions feel like recall.",
    skillsProven: [
      "Risk-classed capability design (read vs write vs gated)",
      "Human-in-the-loop queues with audit trails",
      "Checkpoint summarization with provenance",
      "Typed error handling across an outage",
    ],
    deliverables: [
      "Agent service with capability registry and approval queue",
      "Session-state store with fact provenance",
      "Chaos-test suite covering outage, injection, and long-session cases",
      "One-page architecture decision record",
    ],
    rubric: [
      "No prompt phrasing — including injected instructions — can execute a write directly",
      "Every proposal in the queue carries tool, args, ticket ID, rationale, timestamp, and final approver",
      "A scripted 100-turn session keeps per-turn token cost flat after compaction begins",
      "Promises made at turn 5 are still honored and cited at turn 95",
      "Killing the payment provider mid-flight recovers automatically with zero duplicate side effects",
    ],
    startFromLabId: "enterprise-support-agent",
  },
  {
    id: "research-pipeline",
    title: "Multi-agent research pipeline",
    tagline: "Orchestration with contracts, not vibes",
    durationWeeks: 2,
    domainIds: ["agentic-architecture", "prompt-engineering"],
    description:
      "A research system that decomposes questions, runs scoped subagents in parallel, verifies every claim against sources with a judge pass, and produces cited reports. The deliverable demonstrates you can coordinate agents through typed contracts while keeping costs observable.",
    skillsProven: [
      "Decomposition and brief design",
      "Fan-out/fan-in with per-branch budgets",
      "Findings-with-provenance handoffs",
      "LLM-as-judge calibration against human labels",
    ],
    deliverables: [
      "Orchestrator with dynamic decomposition",
      "Researcher + verifier + writer agents behind typed interfaces",
      "Token-cost dashboard per pipeline run",
      "Calibration report: judge agreement vs your labeled sample",
    ],
    rubric: [
      "Writer prompts stay under a fixed size ceiling regardless of researcher exploration depth",
      "Every factual sentence in output traces to a Finding with URL and verbatim quote",
      "Verifier downgrades or rejects fabricated quotes in a deliberately poisoned corpus test",
      "Wall-clock latency of two researchers ≈ max(individual), not sum",
      "Judge-vs-human agreement ≥80% on a 20-item labeled set",
    ],
    startFromLabId: "multi-agent-research",
  },
  {
    id: "mcp-gateway-broker",
    title: "MCP gateway with permission broker",
    tagline: "Least privilege as infrastructure",
    durationWeeks: 3,
    domainIds: ["tool-design-mcp", "claude-code-workflows"],
    description:
      "An MCP gateway fronting three internal systems with per-user JWT exchange, capability-scope enforcement, rate limiting, and a full audit log. Includes a Claude Code integration and a red-team drill proving injection attempts die at the boundary.",
    skillsProven: [
      "Server-per-system topology with scoped credentials",
      "Per-user identity end-to-end (RLS preserved)",
      "Centralized policy enforcement and audit",
      "Transport choice trade-offs (stdio vs HTTP)",
    ],
    deliverables: [
      "Gateway service with scope matrix per capability",
      "Token-exchange service mapping user JWTs to upstream scopes",
      "Audit log queryable by user, tool, and outcome category",
      "Red-team transcript showing blocked escalation attempts",
    ],
    rubric: [
      "No standing admin credential exists anywhere in the deployment",
      "Warehouse queries execute under the requesting user's row-level security context",
      "Permission failures return errorCategory=permission and appear in audit within one second",
      "Rate limiter contains a runaway agent loop without affecting other users",
      "Both Claude Code and a custom host connect to the same servers with identical guarantees",
    ],
    startFromLabId: "claude-code-workflow-lab",
  },
  {
    id: "eval-harness",
    title: "Evaluation harness for structured output",
    tagline: "Make prompt changes boring again",
    durationWeeks: 2,
    domainIds: ["prompt-engineering", "context-reliability"],
    description:
      "A reusable eval framework for extraction pipelines: golden sets with documented hard cases, business-rule validators beyond schema, informed-retry instrumentation, and CI gating that blocks regressive changes. The project that turns 'I think it still works' into a green check.",
    skillsProven: [
      "Golden-set design covering documented failure modes",
      "Schema honesty (nullable fields, enum constraints)",
      "Validator-informed retry loops with caps and idempotency",
      "CI/CD integration for AI quality gates",
    ],
    deliverables: [
      "Harness CLI running any pipeline against any golden set",
      "Fifty-case golden corpus with per-case rationale",
      "CI workflow gating merges on eval results",
      "Regression report comparing prompt versions",
    ],
    rubric: [
      "Deliberately degrading a prompt fails CI within one run",
      "Missing-due-date cases return null across model and temperature variations",
      "Retry logs prove attempt N+1 received attempt N's specific validation errors",
      "Cost per case is tracked; harness flags pipelines exceeding budget",
      "Adding a new pipeline to the harness takes one config file",
    ],
    startFromLabId: "structured-api-app",
  },
  {
    id: "observability-dashboard",
    title: "Observability dashboard for long-running agents",
    tagline: "See every iteration before users see every bug",
    durationWeeks: 2,
    domainIds: ["context-reliability", "agentic-architecture"],
    description:
      "Trace collection and visualization for agentic systems: per-iteration spans with inputs, tool calls, outputs, and token counts; session replay; drift detection across runs; and alerting on cost or behavior anomalies.",
    skillsProven: [
      "Trace schema design correlated by session ID",
      "Token-cost accounting and anomaly detection",
      "Failure taxonomy analytics (transient vs validation vs permission)",
      "Debugging production nondeterminism from recorded evidence",
    ],
    deliverables: [
      "Trace ingestion endpoint plus storage schema",
      "Waterfall UI reconstructing any session decision path",
      "Domain breakdown of error categories over time",
      "Alert rules for cost spikes and permission-failure bursts",
    ],
    rubric: [
      "Any reported inconsistency can be diagnosed from traces alone within ten minutes",
      "Tool-call arguments and results are visible per span, redacted of secrets",
      "Injecting a synthetic cost spike triggers the alert end-to-end",
      "Dashboard distinguishes the three error categories without regex parsing",
      "Replaying a traced session reproduces tool-call sequences deterministically where sampling is fixed",
    ],
    startFromLabId: "tool-use-app",
  },
];
