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
];
