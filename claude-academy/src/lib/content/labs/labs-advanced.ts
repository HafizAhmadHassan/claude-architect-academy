import type { Lab } from "../types";

export const labsAdvanced: Lab[] = [
  {
    id: "claude-code-workflow-lab",
    domainIds: ["claude-code-workflows"],
    title: "Claude Code team workflow lab",
    estimatedMinutes: 75,
    objective:
      "Configure a repository for serious Claude Code work: hierarchical CLAUDE.md memory, a custom slash command producing schema-validated JSON in headless CI, PostToolUse normalization hooks, and permission deny rules — programmatic enforcement instead of prompt-based hope.",
    prerequisites: [
      "Claude Code installed and authenticated",
      "A Git repository you can safely modify",
      "Node.js 20+ for hook scripts",
    ],
    architecture: [
      "CLAUDE.md files form hierarchical memory: root holds org-wide policy, subdirectories hold package-specific commands and conventions. Claude Code loads the relevant levels automatically.",
      "Custom slash commands are markdown prompt templates stored in .claude/commands/ — versioned with the repo, shared by every teammate.",
      "Headless mode (claude -p --output-format json --json-schema) turns any workflow into a CI consumer contract with validated structure.",
      "Hooks intercept lifecycle events: PreToolUse gates execution, PostToolUse transforms results before Claude sees them. Enforcement lives here, not in prose.",
    ],
    steps: [
      {
        title: "Author hierarchical project memory",
        detail:
          "Thin root file, specific child file. Commands must be ones you verified; conventions must be ones you enforce.",
        code: {
          label: "CLAUDE.md + packages/api/CLAUDE.md",
          language: "markdown",
          code: `# CLAUDE.md (repo root)
- Run tests with: npm test --workspaces
- Never edit generated/: it is overwritten by codegen
- Commit messages follow Conventional Commits

# packages/api/CLAUDE.md
- This is the Express API workspace.
- Test only this package: npm test -w api
- All dates cross the wire as ISO-8601 UTC.
- Migrations: npm run migrate:create -- -w api -- <name>`,
        },
      },
      {
        title: "Create a custom slash command",
        detail:
          "Commands live in .claude/commands/. $ARGUMENTS receives what the user types after the command name.",
        code: {
          label: ".claude/commands/security-review.md",
          language: "markdown",
          code: `---
description: Review the diff for security issues
allowed-tools: Read, Grep, Bash(git diff:*)
---

Review ALL uncommitted changes for security issues:
- Injection (SQL, command, header)
- Secrets or credentials committed
- Missing authorization checks on new routes
- Unsafe deserialization

For each finding report severity (critical|high|medium|low),
file, line, description, and suggested fix.
Be concrete; cite the exact line. $ARGUMENTS`,
        },
      },
      {
        title: "Run it headless with schema-validated output",
        detail:
          "The same command becomes a CI gate when run non-interactively: JSON out, schema-validated, exit codes machine-readable.",
        code: {
          label: ".github/workflows/security-gate.yml (job step)",
          language: "bash",
          code: `claude -p "/security-review" \\
  --output-format json \\
  --json-schema '{
    "type": "object",
    "properties": {
      "findings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "severity": {"enum": ["critical","high","medium","low"]},
            "file": {"type": "string"},
            "line": {"type": "integer"},
            "description": {"type": "string"}
          },
          "required": ["severity","file","description"]
        }
      }
    },
    "required": ["findings"]
  }' > findings.json

# Fail CI on criticals
node -e 'const f=require("./findings.json").findings;
process.exit(f.some(x=>x.severity==="critical")?1:0)'`,
        },
      },
      {
        title: "Normalize tool output with a PostToolUse hook",
        detail:
          "Timestamp chaos (Unix epochs vs ISO strings) is a classic misreading source. Fix it at the boundary so every result arrives pre-normalized.",
        code: {
          label: ".claude/settings.json + scripts/normalize-dates.js",
          language: "json",
          code: `// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash|Read",
        "hooks": [
          { "type": "command",
            "command": "node scripts/normalize-dates.js" }
        ]
      }
    ]
  },
  "permissions": {
    "deny": ["Read(.env*)", "Edit(infrastructure/**)", "WebFetch"]
  }
}

// scripts/normalize-dates.js reads stdin JSON, rewrites any
// 10-digit numeric field into ISO-8601, writes stdin back out.`,
        },
      },
    ],
    expectedOutput:
      "/security-review runs interactively with full explanations; in CI it emits findings.json that passes schema validation; a deliberately committed fake secret produces a critical finding and a red build; timestamps from any tool arrive to Claude as ISO-8601.",
    validationChecklist: [
      "Root vs package CLAUDE.md both load; package-specific command works only inside its directory context",
      "Slash command appears in /help and accepts arguments",
      "Headless run outputs parseable JSON conforming to your schema",
      "CI fails on an injected critical finding and passes on clean diffs",
      "Deny rules actually block .env reads and infrastructure edits — verify by attempting them",
      "PostToolUse hook converts 1699999999 → 2023-11-14T22:13:19Z in tool output",
    ],
    extensionChallenge:
      "Add a PreToolUse hook that blocks Edit on files matching a CODEOWNERS map you don't own, and wire the security command to post findings back as inline PR comments via the GitHub CLI.",
  },
  {
    id: "enterprise-support-agent",
    domainIds: [
      "agentic-architecture",
      "context-reliability",
      "prompt-engineering",
    ],
    title: "Capstone: enterprise support agent",
    estimatedMinutes: 120,
    objective:
      "Assemble everything — guarded tools, approval queues, typed errors, checkpoint summarization, and tracing — into one support agent that survives long sessions, provider outages, and compliance review.",
    prerequisites: [
      "Completed at least three earlier labs",
      "An Anthropic API key",
      "Comfortable reading trace logs",
    ],
    architecture: [
      "Read path stays autonomous: ticket lookup, history search, knowledge-base retrieval all execute immediately under read-only credentials.",
      "Write path crosses a human boundary: refunds and account changes become structured proposals in an approval queue — never direct mutations.",
      "Session state is checkpointed: resolved threads compress into durable facts with source references; each turn resumes with compact state plus recent messages, bounding token growth.",
      "Every failure carries errorCategory and a trace ID; observability records inputs, tool calls, outputs, and token counts per iteration so inconsistencies are diagnosable, not mystical.",
    ],
    steps: [
      {
        title: "Split capabilities by risk class",
        detail:
          "One registry, two enforcement paths. Reads execute; writes propose.",
        code: {
          label: "src/capabilities.ts",
          language: "typescript",
          code: `export const CAPABILITIES = {
  get_ticket:       { kind: "read" },
  search_history:   { kind: "read" },
  kb_lookup:        { kind: "read" },
  issue_refund:     { kind: "write", requiresApproval: true,
                      maxAutoAmountMinor: 0 }, // ALL refunds gated
  update_address:   { kind: "write", requiresApproval: true },
} as const;

export function authorize(tool: keyof typeof CAPABILITIES) {
  const cap = CAPABILITIES[tool];
  if (cap.kind === "read") return { mode: "execute" };
  if (cap.requiresApproval) return { mode: "propose" };
  return { mode: "execute" };
}`,
        },
      },
      {
        title: "Route proposals through an approval queue",
        detail:
          "Mutating calls return a pending proposal payload (permission category) and persist to a queue table a human dashboard consumes.",
        code: {
          label: "src/approvals.ts",
          language: "typescript",
          code: `import crypto from "node:crypto";

const queue: ApprovalRequest[] = [];

export function propose(input: {
  tool: string;
  args: Record<string, unknown>;
  ticketId: string;
  rationale: string;
}) {
  const request = {
    id: crypto.randomUUID(),
    ...input,
    status: "pending_approval" as const,
    createdAt: new Date().toISOString(),
  };
  queue.push(request);
  return {
    ok: false,
    errorCategory: "permission",
    message: \`Refund requires approval; proposal \${request.id} queued\`,
    proposalId: request.id,
  };
}

interface ApprovalRequest {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  ticketId: string;
  rationale: string;
  status: "pending_approval";
  createdAt: string;
}`,
        },
      },
      {
        title: "Checkpoint session state",
        detail:
          "After each resolution, compress the thread into durable facts. Resume with compact state + last N messages — attention stays sharp, cost stays bounded.",
        code: {
          label: "src/session-state.ts",
          language: "typescript",
          code: `export interface SessionFact {
  fact: string;
  source: string;     // e.g. "ticket_8812 msg 4"
  recordedAt: string;
}

export interface SessionState {
  ticketId: string;
  facts: SessionFact[];
}

export async function checkpoint(
  state: SessionState,
  threadSummaryInput: string
): Promise<SessionState> {
  const client = new Anthropic();
  const res = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 800,
    system:
      "Extract durable commitments (refunds promised, deadlines, " +
      "addresses). JSON: {facts:[{fact, source}]}. No speculation.",
    messages: [{ role: "user", content: threadSummaryInput }],
  });
  const parsed = JSON.parse(
    res.content.filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text).join("")
  );
  return {
    ticketId: state.ticketId,
    facts: [...state.facts, ...parsed.facts],
  };
}

// Resume prompt = renderState(state) + last 6 messages only`,
        },
      },
      {
        title: "Instrument every iteration",
        detail:
          "Trace spans make behavior auditable: inputs, tool calls, outputs, tokens — correlated by session ID so 'inconsistent answers' become diffable executions.",
        code: {
          label: "src/trace.ts",
          language: "typescript",
          code: `import crypto from "node:crypto";

export interface Span {
  traceId: string;
  iteration: number;
  inputTokens?: number;
  outputTokens?: number;
  toolCalls?: { name: string; args: unknown; ok: boolean }[];
  outcome: string;
  at: string;
}

const log: Span[] = [];

export function startTrace() {
  return crypto.randomUUID();
}

export function record(span: Span) {
  log.push(span);
  // Ship to your observability backend in production
}

export function dumpByTrace(traceId: string) {
  return log.filter((s) => s.traceId === traceId);
}`,
        },
      },
      {
        title: "Chaos-test the whole thing",
        detail:
          "Force each failure class and confirm the agent survives: outage (transient → backoff), malformed KB response (validation → correction), refund attempt (permission → queue), 200-message session (compaction → flat cost curve).",
        code: {
          label: "terminal",
          language: "bash",
          code: `npx tsx eval/chaos.ts
# Expect:
#  [transient]   3 attempts w/ backoff, then success — no dupes
#  [validation]  model received validator complaint, fixed payload
#  [permission]  proposal queued with ID, customer got honest answer
#  [long-session] tokens/turn flat after compaction kicks in`,
        },
      },
    ],
    expectedOutput:
      "A refund request ends with a queued proposal ID and an honest customer reply ('a specialist will confirm within 24h') — not a silent mutation. A 150k-token-equivalent session resumes from compact state at constant per-turn cost, with every commitment traceable to its source span.",
    validationChecklist: [
      "No write capability executes directly under any prompt phrasing, including injection attempts",
      "Every queued proposal has tool, args, ticket, rationale, and timestamp for auditor review",
      "Facts survive compaction: promises made in turn 5 still honored at turn 80, with source citations",
      "Per-turn token cost is visibly flat after checkpoints begin",
      "Provider-outage simulation recovers automatically within retry caps, zero duplicate side effects",
      "dumpByTrace reconstructs the full decision path for any session",
    ],
    extensionChallenge:
      "Add calibrated routing: train thresholds against labeled outcomes so low-risk refunds under a dollar threshold auto-approve while borderline cases escalate, then measure reviewer workload reduction against a labeled holdout set.",
  },
];
