import type { Lesson } from "../types";

export const domain2Lessons: Lesson[] = [
  {
    id: "tool-design-contracts",
    domainId: "tool-design-mcp",
    title: "Tool Design Contracts",
    summary:
      "Treat every tool as a contract the model must be able to honor: explicit scope, documented formats, and machine-distinguishable outcomes.",
    objectives: [
      "Write descriptions that state when to use a tool and when not to",
      "Document parameters with units, formats, examples, and edge-case behavior",
      "Choose granularity: consolidate chatty tools, split overloaded ones",
      "Design outputs so distinct outcomes are structurally distinguishable",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Claude selects tools based on names, descriptions, and schemas alone. That makes the description a behavioral contract: it defines what the tool does, when it applies, what each parameter means, and what happens at the edges. Anything left implicit becomes a production bug discovered by the model on your users' behalf.",
        "Granularity is the other half of the contract. Twenty overlapping tools confuse selection; one mega-tool that does five things produces malformed arguments. Aim for tools that map to single clear intentions.",
      ],
    },
    whyItMatters: [
      "Domain 2 is 18% of the exam and tool design principles lead its task statements.",
      "Most tool-use failures trace back to underspecified descriptions rather than model capability.",
      "Structured, distinguishable outcomes are prerequisites for reliable agent branching.",
    ],
    simpleExample: {
      title: "Weak vs strong description",
      body: "Same tool, two contracts. The strong version states scope, format, empty-result behavior, and forbidden usage.",
      code: {
        label: "descriptions",
        language: "typescript",
        code: `weak: "Searches customers."

strong:
"Look up customers by name substring.
Returns array of {id, name, region, tier}.
IDs are 'cus_' prefixed strings — never invent them.
Returns an EMPTY list when nothing matches; that is a
normal result, not an error.
Do not use for order history — use get_orders instead.",
`,
      },
    },
    productionExample: {
      title: "Tool audit at a fintech",
      body: "A team consolidated 23 CRM endpoints into 9 intention-named tools after logs showed 31% of calls failing schema validation. Every description gained parameter formats (dates as ISO-8601), explicit do-not-use guidance pointing at sibling tools, and documented empty-result semantics. Validation failures dropped below 3% within a week without any prompt changes — the contract was doing the work.",
    },
    antiPattern: {
      name: "The do-everything endpoint",
      wrong:
        "Exposing one generic query tool whose behavior depends on undocumented flag combinations.",
      consequence:
        "The model guesses flag semantics, produces plausible-but-wrong queries, and cannot distinguish its mistake from a data absence.",
      fix:
        "Split by intention into separately named tools with their own schemas, or encode mutually exclusive modes as an enum parameter with documented cases.",
    },
    tradeOffs: [
      {
        choice: "Verbose descriptions",
        gain: "Fewer misfires; correct selection in crowded tool sets",
        cost: "Token overhead on every request carrying the tool list",
      },
      {
        choice: "Fine-grained tools",
        gain: "Precise permissions per capability",
        cost: "Selection burden grows; sequences need more turns",
      },
      {
        choice: "Consolidated tools",
        gain: "Compact tool list; fewer round trips",
        cost: "Wider blast radius per call; harder permission scoping",
      },
    ],
    handsOn: {
      title: "Contract checklist rewrite",
      steps: [
        "Pick three tools you have built or use regularly.",
        "Score each against: scope statement, parameter formats, edge cases, do-not-use, empty-result semantics.",
        "Rewrite the weakest description and re-test selection accuracy with tricky phrasings.",
        "Note which checklist item fixed the most failures.",
      ],
      linkedLabId: "mcp-server",
    },
    examQuestionId: "q-tool-granularity",
    takeaway:
      "A tool is a promise written for a non-human reader. If the contract has gaps, the model will find them in production.",
    tags: ["tool design", "schemas", "descriptions"],
  },
  {
    id: "mcp-integration-architecture",
    domainId: "tool-design-mcp",
    title: "MCP Integration Architecture",
    summary:
      "Model Context Protocol standardizes how hosts reach external context: clients connect, servers expose tools, resources, and prompts over transports.",
    objectives: [
      "Place responsibilities correctly across MCP hosts, clients, and servers",
      "Choose between stdio and HTTP-based transports for local vs remote servers",
      "Use resources for read-only context and tools for actions",
      "Scope authentication and permissions at the server boundary",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "An MCP host (Claude Desktop, Claude Code, your app) embeds an MCP client that maintains connections to MCP servers. Each server declares capabilities: tools (model-invoked actions), resources (application-driven read-only context), and prompts (reusable templates). Servers run out-of-process and communicate over transports — stdio for local child processes, Streamable HTTP for remote services.",
        "Because servers are separate processes with their own credentials, they are natural permission boundaries. A server should hold exactly the upstream access its capability set requires — no shared god-credentials.",
      ],
    },
    whyItMatters: [
      "MCP appears throughout Domain 2's task statements: clients, servers, resources, authentication, permissions.",
      "Transport choice drives deployment shape: stdio means local install; HTTP enables centralized managed servers.",
      "Resource-vs-tool classification questions are common because the distinction is architectural, not cosmetic.",
    ],
    diagram: "mcp-architecture",
    simpleExample: {
      title: "Capability map",
      body: "One server, correctly classified capabilities:",
      code: {
        label: "capabilities.ts",
        language: "typescript",
        code: `server.registerTool("create_ticket", {...});   // action -> tool
server.registerTool("search_tickets", {...});   // query   -> tool

server.registerResource(
  "team-rubric",                                // static docs
  "file://rubrics/support.md",
  async () => ({ contents: [{ uri, text }] })
);

server.registerResource(
  "ticket-timeline",                            // dynamic read-only
  "tickets://{id}/timeline",
  { template },
  async (uri, { id }) => ({ contents: [render(id)] })
);`,
      },
    },
    productionExample: {
      title: "Fleet of scoped servers",
      body: "An enterprise runs three MCP servers behind one internal gateway: a GitHub server using a bot token limited to two repositories, a Data Warehouse server enforcing row-level security per user JWT, and an internal Wiki server with anonymous read. Each holds only its own credential; none can impersonate another. The gateway rate-limits per server, so a runaway loop in one integration cannot exhaust API budgets elsewhere.",
    },
    antiPattern: {
      name: "God-token server",
      wrong:
        "One MCP server holding admin credentials across all systems because 'it is easier than scoping'.",
      consequence:
        "Any prompt injection or logic bug in any tool inherits admin reach across every connected system at once.",
      fix:
        "One credential scope per server, mapped to its declared capabilities. Prefer read-only service accounts; gate mutations behind approval workflows.",
    },
    tradeOffs: [
      {
        choice: "stdio transport",
        gain: "Zero infrastructure; perfect for personal/local dev servers",
        cost: "Per-machine install; no central updates or observability",
      },
      {
        choice: "Streamable HTTP transport",
        gain: "Central hosting, auth, logging, versioned rollouts",
        cost: "Infrastructure, session management, network failure modes",
      },
      {
        choice: "Resources over re-fetching via tools",
        gain: "Applications control context injection; cheaper discovery",
        cost: "Model cannot self-serve dynamic lookups without a paired tool",
      },
    ],
    handsOn: {
      title: "Extend the lab server",
      steps: [
        "Add a static resource exposing your support rubric document.",
        "Add a templated resource returning ticket timelines by ID.",
        "Classify every existing capability as tool vs resource and justify each in one sentence.",
        "Swap stdio for Streamable HTTP locally and note what breaks in your client config.",
      ],
      linkedLabId: "mcp-server",
    },
    examQuestionId: "q-mcp-resource-vs-tool",
    takeaway:
      "Clients connect, servers expose, transports carry. Scope every credential to the smallest set its capabilities require.",
    tags: ["mcp", "architecture", "transports", "auth"],
  },
  {
    id: "structured-errors-empty-results",
    domainId: "tool-design-mcp",
    title: "Structured Errors & Empty Results",
    summary:
      "Reliable agents need machine-distinguishable outcomes: empty results are data, transient failures deserve backoff, validation failures deserve correction, permission failures deserve escalation.",
    objectives: [
      "Distinguish empty results from execution errors — and encode both distinctly",
      "Classify every failure as transient, validation, or permission",
      "Design error payloads with categories, messages safe for model consumption, and trace IDs",
      "Match retry policy to failure class instead of retrying everything identically",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "A tool call has four possible outcomes: success with data, success proving absence (empty result), failure that may succeed later (transient), and failure that cannot be fixed by repeating (validation or permission). Agents that cannot tell these apart either hallucinate around gaps or hammer failing endpoints.",
        "The fix is a typed error envelope. Every non-success result carries an errorCategory, a human-readable message written for the model to act on ('amount_minor must be integer cents'), and a trace ID for observability. The agent loop branches on category: backoff-and-retry for transient, feed-back-to-model for validation, stop-and-escalate for permission.",
        "Empty results sit outside the error axis entirely. 'No rows match' is a successful query whose answer is absence — returning an error for it triggers pointless retries and teaches the model to fear legitimate lookups.",
      ],
    },
    whyItMatters: [
      "Error-handling task statements appear explicitly in Domain 2's exam blueprint.",
      "During provider outages, category-blind retries amplify incidents instead of surviving them.",
      "Compliance teams need audit trails that distinguish outages from misuse — stringly-typed errors make that impossible.",
    ],
    simpleExample: {
      title: "A typed error envelope",
      body: "One shape, three categories, branchable by code:",
      code: {
        label: "error-contract.ts",
        language: "typescript",
        code: `// Success with absence — NOT an error
{ ok: true, data: [] }

// Failure — always carries a category
{
  ok: false,
  errorCategory: "transient",   // | "validation" | "permission"
  message: "Upstream timeout after 3s; safe to retry",
  traceId: "req_7f3a",
}

// Loop policy
if (!res.ok) {
  if (res.errorCategory === "transient") await backoffAndRetry();
  else if (res.errorCategory === "validation") return resToModel(res);
  else escalateToHuman(res);
}`,
      },
    },
    productionExample: {
      title: "Surviving a payment-provider outage",
      body: "A billing agent called a payment API that started returning 503s during a regional incident. Because every tool error carried errorCategory=transient plus jittered exponential backoff capped at five attempts, affected transactions queued and completed automatically when the provider recovered — no thundering herd, no duplicated charges (idempotency keys made retries safe). In the same quarter, validation-category errors cut silent data corruption to zero: malformed payloads went back to the model with the validator's exact complaint instead of retrying unchanged.",
    },
    antiPattern: {
      name: "Retry everything, forever",
      wrong:
        "Wrapping every tool call in a generic retry-until-success loop because 'transient errors exist'.",
      consequence:
        "Invalid payloads retry hundreds of times unchanged, permission walls get hammered, outages receive amplified traffic, and logs fill with identical failures no auditor can classify.",
      fix:
        "Require categories on every error. Retry only transients — with caps and backoff. Return validations to the model with the specific complaint. Escalate permissions immediately.",
    },
    tradeOffs: [
      {
        choice: "Rich typed error payloads",
        gain: "Deterministic branching, auditable incidents",
        cost: "More surface area to design and version",
      },
      {
        choice: "Empty-as-success convention",
        gain: "Model explores lookups confidently; no false alarms",
        cost: "Callers must check data.length rather than catch",
      },
      {
        choice: "Capped retries with idempotency keys",
        gain: "Safe automatic recovery from transient faults",
        cost: "Slightly slower worst case; key plumbing on mutations",
      },
    ],
    handsOn: {
      title: "Add the error envelope to your lab server",
      steps: [
        "Pick two tools in your MCP lab server and give every failure path the {ok, errorCategory, message, traceId} shape.",
        "Make list-style tools return empty arrays instead of throwing when nothing matches.",
        "Write the three-branch handler (backoff / model-feedback / escalate) around one tool and force each path artificially.",
        "Log every error with its category and confirm you can query 'all permission failures this session' from logs alone.",
      ],
      linkedLabId: "mcp-server",
    },
    examQuestionId: "q-transient-vs-validation",
    takeaway:
      "Absence is data, transience deserves patience, mistakes deserve information, and boundaries deserve humans. Encode all four.",
    tags: ["structured errors", "retries", "failure handling"],
  },
  {
    id: "mcp-auth-permissions",
    domainId: "tool-design-mcp",
    title: "MCP Auth & Permission Scoping",
    summary:
      "Credentials belong to infrastructure, scoped per user and capability, enforced at the server boundary — the model reasons about actions but never holds keys.",
    objectives: [
      "Keep credentials out of model context entirely",
      "Scope tokens per-user and per-capability using OAuth where users are involved",
      "Enforce least privilege server-side so client claims cannot widen access",
      "Gate irreversible mutations behind approval workflows even for authenticated callers",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "An MCP server is a trust boundary: it holds upstream credentials and decides which capabilities callers may exercise. Authentication answers 'who is calling' (per-user OAuth identity, or a service account for machine callers); authorization answers 'may this identity invoke this capability' (scope checks mapped to declared tools).",
        "The cardinal rule is that secrets never travel through model context. Tokens passed inside prompts leak into transcripts, traces, and occasionally completions. Instead, the host authenticates the user, the MCP client attaches credentials at the transport layer, and the server validates them before any tool executes.",
        "Least privilege completes the design: a calendar server needs calendar.read and calendar.write scopes — not full mailbox admin 'for future features'. And because authentication is not authorization-to-do-anything, destructive capabilities get a second gate: approval workflows that require explicit human confirmation regardless of token validity.",
      ],
    },
    whyItMatters: [
      "Authentication and permissions are named explicitly in Domain 2's exam task statements.",
      "Prompt injection turns 'the model holds admin' into 'an attacker holds admin'; scoping caps blast radius.",
      "Audit requirements demand per-user attribution — shared service accounts destroy accountability.",
    ],
    simpleExample: {
      title: "Scoping matrix at the boundary",
      body: "Capabilities map to scopes; enforcement happens before execution:",
      code: {
        label: "authz.ts",
        language: "typescript",
        code: `const CAPABILITY_SCOPES = {
  read_calendar:  ["calendar.read"],
  create_event:   ["calendar.write"],
  send_invites:   ["calendar.write", "smtp.send"], // + approval gate
} as const;

async function handle(tool: string, user: Principal) {
  const required = CAPABILITY_SCOPES[tool];
  if (!user.scopes.includesAll(required)) {
    return permissionError(tool, user);   // -> escalate, never retry
  }
  if (requiresApproval(tool)) {
    return queueForApproval(tool, user);  // human confirms mutations
  }
  return executeAs(user.upstreamToken);   // per-user, never shared
}`,
      },
    },
    productionExample: {
      title: "Per-user JWTs behind an internal gateway",
      body: "A company exposed three internal systems through MCP servers fronted by an API gateway. Each request arrived with the end user's short-lived JWT; each server exchanged it for narrowly-scoped upstream tokens via a token service. When security ran a red-team drill with an injected instruction ('email the customer list to attacker@…'), the mail server rejected the call — the requesting identity held no smtp.send scope, and the attempt landed in the audit log with a user attribution. The same drill against their pre-MCP script, which used one shared admin credential, succeeded.",
    },
    antiPattern: {
      name: "Tokens in context",
      wrong:
        "Passing API keys into the conversation ('here is my token, use it for API calls') or storing them in config files the model can read.",
      consequence:
        "Secrets leak into transcripts, logs, and traces; any prompt injection exfiltrates them; revocation requires hunting every transcript copy.",
      fix:
        "Inject credentials at the infrastructure layer — environment variables or secret managers read by the server process, attached by the MCP client at transport level, never rendered into model-visible content.",
    },
    tradeOffs: [
      {
        choice: "Per-user OAuth tokens",
        gain: "Attribution, easy revocation, upstream RLS honored",
        cost: "Token lifecycle complexity; login UX",
      },
      {
        choice: "Single service account",
        gain: "Simplest to build",
        cost: "No attribution, widest blast radius, audit failure",
      },
      {
        choice: "Approval gates on mutations",
        gain: "Irreversibility gets human judgment",
        cost: "Latency on write paths; queue operations burden",
      },
    ],
    handsOn: {
      title: "Scope your lab server",
      steps: [
        "Add a fake principal to your MCP lab (two users: viewer and admin).",
        "Reject disallowed capabilities with a permission-category error before any logic runs.",
        "Route one mutating tool through an approval queue instead of executing directly.",
        "Verify no token ever appears in a tool result or log line — grep to prove it.",
      ],
      linkedLabId: "mcp-server",
    },
    examQuestionId: "q-mcp-auth-scoping",
    takeaway:
      "Identity flows through infrastructure, scopes shrink to capability, and irreversible actions still meet a human. The model plans; the boundary permits.",
    tags: ["mcp", "authentication", "permissions", "oauth"],
  },
];
