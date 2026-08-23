import type { PracticeQuestion } from "../types";

const OFFICIAL_NOTE =
  "Practice question — not an official Anthropic exam question.";

export const disclaimer = OFFICIAL_NOTE;

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "q-agentic-loop-stop",
    domainId: "agentic-architecture",
    difficulty: "beginner",
    type: "single-choice",
    question:
      "In an agentic loop, which event most directly causes the loop to terminate normally after Claude produces its answer?",
    options: [
      {
        id: "a",
        text: "The response contains no tool_use blocks, so stop_reason is end_turn",
      },
      { id: "b", text: "Claude prints the literal word DONE in its output" },
      { id: "c", text: "All registered tools have been called at least once" },
      { id: "d", text: "Temperature is set to 0 so output becomes deterministic" },
    ],
    correctOptionIds: ["a"],
    explanation:
      "A normal exit happens when Claude stops requesting tools. The API signals this through stop_reason (end_turn instead of tool_use). Production loops add budgets on top of this signal, but the signal itself is the natural terminator.",
    optionExplanations: {
      a: "Correct. No new tool requests means there is nothing left to observe; the final assistant message is the answer.",
      b: "Parsing sentinel words out of free text is brittle and unnecessary. The stop_reason field is the structured signal designed for this.",
      c: "Tools are available, not mandatory. Requiring every tool to fire would force pointless calls and still would not prove the goal is met.",
      d: "Temperature controls sampling variance, not loop termination. Deterministic models can still request tools forever.",
    },
    principle:
      "Terminate on structured signals (stop_reason), enforce budgets as a safety net.",
    tags: ["agentic loop", "stop conditions"],
    references: [
      {
        label: "Anthropic Docs – Tool use",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-orphaned-results",
    domainId: "agentic-architecture",
    difficulty: "intermediate",
    type: "debugging",
    scenario:
      "Your billing agent calls lookup_invoice, your code executes the query successfully, but logs show Claude then re-calls the same tool two more times and finally answers with an invoice amount that does not match any database record.",
    question: "What is the most likely root cause?",
    options: [
      {
        id: "a",
        text: "Tool results are never appended to the conversation as tool_result blocks",
      },
      { id: "b", text: "The invoice database is returning stale reads" },
      {
        id: "c",
        text: "max_tokens is too small for Claude to explain its reasoning",
      },
      {
        id: "d",
        text: "The system prompt does not tell Claude today's date",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "If tool_result messages are dropped, Claude never observes the data it asked for. From its perspective the tool silently failed, so retrying is rational, and any 'answer' is reconstructed from priors rather than observations, which explains the fabricated amount.",
    optionExplanations: {
      a: "Correct. Observations must be returned as user-role messages containing tool_result blocks keyed by tool_use_id. Missing observations produce exactly this repeat-and-invent signature.",
      b: "Stale reads would still return values, and Claude would quote them. Fabrication plus retries points at missing observations, not stale ones.",
      c: "A token limit truncation raises a visible stop_reason of max_tokens, not silent re-calls with invented data.",
      d: "Missing dates can confuse relative time questions but would not cause repeated identical calls or fabricated amounts.",
    },
    principle:
      "Every tool_use must be answered by exactly one tool_result before the next model call.",
    tags: ["agentic loop", "state management", "debugging"],
    references: [
      {
        label: "Anthropic Docs – Tool use: handle tool results",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/handling-tool-use-errors",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-monolith-agent-refactor",
    domainId: "agentic-architecture",
    difficulty: "advanced",
    type: "architecture-decision",
    scenario:
      "A single Claude agent has access to 15 tools spanning CRM reads, billing writes, email sending, and analytics queries. It stores the entire conversation history in the prompt, runs for up to 40 minutes, and can modify production records without oversight. Error rates and costs are climbing.",
    question: "Which architectural change addresses the most risks at once?",
    options: [
      {
        id: "a",
        text: "Increase max_tokens and add a stronger system prompt telling the agent to be careful",
      },
      {
        id: "b",
        text: "Split into an orchestrator with scoped subagents per capability, move history to external session state, and gate write actions behind human approval",
      },
      {
        id: "c",
        text: "Run three identical agents in parallel and return whichever finishes first for redundancy",
      },
      {
        id: "d",
        text: "Remove all tools and let the agent answer from internal knowledge only",
      },
    ],
    correctOptionIds: ["b"],
    explanation:
      "Decomposition attacks every listed symptom simultaneously: each subagent gets a small tool surface and focused context, orchestrator/subagent boundaries create natural checkpoints, externalized session state ends unbounded prompt growth, and an approval gate removes unsupervised production writes.",
    optionExplanations: {
      a: "Prompting harder does not reduce the blast radius of production writes, does not bound context growth, and leaves 15 competing tools confusing selection.",
      b: "Correct. Orchestrator/subagents + persisted session state + human-in-the-loop writes is the standard decomposition for oversized agents.",
      c: "Redundant racing triples cost, still grants unrestricted writes, and adds nondeterminism about which result ships.",
      d: "Removing tools eliminates the product's core value; the failure was in governance and scope, not in tool use itself.",
    },
    principle:
      "Scale agents by decomposing responsibilities, scoping permissions, and adding approval gates on irreversible actions.",
    tags: ["orchestration", "subagents", "human-in-the-loop", "state management"],
    references: [
      {
        label: "Anthropic Engineering – Building effective agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-tool-description-quality",
    domainId: "tool-design-mcp",
    difficulty: "beginner",
    type: "multiple-response",
    question:
      "Which two qualities make a tool description effective? Select two.",
    options: [
      {
        id: "a",
        text: "It states when the tool should be used and when it should not be used",
      },
      {
        id: "b",
        text: "It documents parameters, units, and formats with concrete examples",
      },
      {
        id: "c",
        text: "It is written in uppercase so the model treats it as higher priority",
      },
      {
        id: "d",
        text: "It hides edge-case behavior so the prompt stays short",
      },
    ],
    correctOptionIds: ["a", "b"],
    explanation:
      "Claude selects tools based almost entirely on names, descriptions, and schemas. A description is a behavioral contract: usage boundaries prevent misuse, and precise parameter documentation prevents malformed calls. Hiding edge cases guarantees the model discovers them in production.",
    optionExplanations: {
      a: "Correct. Explicit use and do-not-use guidance is the single biggest driver of correct tool selection.",
      b: "Correct. Units, formats, and examples in descriptions measurably reduce invalid arguments.",
      c: "Capitalization is not a priority mechanism. Clarity beats shouting.",
      d: "Concealing edge cases shifts failures from design time to runtime, where they are more expensive.",
    },
    principle:
      "Treat tool descriptions as API contracts for the model: explicit scope, complete parameter documentation.",
    tags: ["tool design", "tool descriptions", "schemas"],
    references: [
      {
        label: "Anthropic Docs – Best practices for tool definitions",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices-and-troubleshooting",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-mcp-client-server",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "single-choice",
    question:
      "In Model Context Protocol, which statement correctly describes the division of responsibility between clients and servers?",
    options: [
      {
        id: "a",
        text: "Servers discover tools; clients execute them inside the host application",
      },
      {
        id: "b",
        text: "Clients connect hosts like Claude to servers, which expose tools, resources, and prompts",
      },
      {
        id: "c",
        text: "Clients store credentials for third-party APIs; servers store conversation history",
      },
      {
        id: "d",
        text: "Servers translate natural language into SQL; clients render the UI",
      },
    ],
    correctOptionIds: ["b"],
    explanation:
      "MCP defines a client–server protocol: an MCP client (inside a host such as Claude Desktop or your application) maintains connections to MCP servers, and each server exposes capabilities such as tools, resources, and prompts over transports like stdio or HTTP-based streaming.",
    optionExplanations: {
      a: "Reversed. Clients discover capabilities from servers; execution of a chosen tool happens in the server, whose results flow back through the client.",
      b: "Correct. Hosts embed clients; servers expose tools, resources, and prompts.",
      c: "Credential storage is a concern of the server's implementation for its own upstream APIs, and conversation history belongs to the host application, not the protocol.",
      d: "Translation logic may live anywhere; MCP itself says nothing about SQL or UI rendering.",
    },
    principle:
      "MCP standardizes how hosts reach external context: clients connect, servers expose capabilities.",
    tags: ["mcp", "clients", "servers"],
    references: [
      {
        label: "Model Context Protocol – Core concepts",
        url: "https://modelcontextprotocol.io/docs/learn/architecture",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-empty-vs-error",
    domainId: "tool-design-mcp",
    difficulty: "intermediate",
    type: "debugging",
    scenario:
      "A search_customers tool returns the string 'No customers found' both when the filter legitimately matches nobody and when the service account lacks permission for that region. Agents respond incorrectly in roughly half of the ambiguous cases.",
    question: "What is the best fix?",
    options: [
      {
        id: "a",
        text: "Return structured success with an empty results array for legitimate matches, and a structured error with an errorCategory field for permission failures",
      },
      {
        id: "b",
        text: "Append 'this is definitely accurate' to the message so Claude trusts it",
      },
      {
        id: "c",
        text: "Retry permission failures automatically ten times, then return empty",
      },
      {
        id: "d",
        text: "Remove the region filter entirely so permission errors become impossible",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Access failures and valid empty results require opposite next actions: retry or escalate versus proceed. Structured error metadata such as errorCategory (transient, validation, permission) lets the model, or your code, branch deterministically instead of guessing from prose.",
    optionExplanations: {
      a: "Correct. Distinguish outcome types structurally so downstream decisions are mechanical rather than inferred.",
      b: "Assertive phrasing changes nothing about the underlying ambiguity and encourages confident wrong answers.",
      c: "Retrying permission errors wastes budget and cannot succeed; collapsing them back into empty restores the original bug.",
      d: "Removing functionality to hide errors reduces product value and does not fix the contract.",
    },
    principle:
      "Design tool outputs so distinct outcomes are machine-distinguishable, especially error categories.",
    tags: ["structured errors", "failure handling", "tool design"],
    references: [
      {
        label: "Anthropic Docs – Tool use error handling",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/handling-tool-use-errors",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-claude-md-purpose",
    domainId: "claude-code-workflows",
    difficulty: "beginner",
    type: "single-choice",
    question:
      "What belongs in a project's CLAUDE.md file?",
    options: [
      {
        id: "a",
        text: "Repository conventions, build and test commands, and environment notes Claude Code should know in every session",
      },
      { id: "b", text: "Secrets and API keys so tests can run without configuration" },
      {
        id: "c",
        text: "A copy of the entire company engineering handbook",
      },
      {
        id: "d",
        text: "Nothing. CLAUDE.md files are generated artifacts that must never be hand-edited",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "CLAUDE.md is persistent project memory loaded at session start. It earns its place with concise, high-signal instructions: commands that work, conventions the team actually follows, and gotchas. Secrets never belong in it, and bloated files dilute attention.",
    optionExplanations: {
      a: "Correct. Concise, durable, project-specific guidance is exactly what CLAUDE.md is for.",
      b: "CLAUDE.md is committed to source control. Putting secrets in it leaks credentials to everyone who can read the repo.",
      c: "Indiscriminate bulk context wastes the model's attention. Curate what changes Claude's behavior in this repository.",
      d: "CLAUDE.md is meant to be authored and refined by the team; treating it as untouchable discards its whole purpose.",
    },
    principle:
      "CLAUDE.md is curated project memory: commands, conventions, caveats — kept tight and true.",
    tags: ["claude code", "claudemd", "project instructions"],
    references: [
      {
        label: "Claude Code – Memory & project instructions",
        url: "https://docs.anthropic.com/en/docs/claude-code/memory",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-plan-mode-choice",
    domainId: "claude-code-workflows",
    difficulty: "intermediate",
    type: "architecture-decision",
    scenario:
      "You need to migrate a monolith's billing module into a separate service. The change touches dozens of files, several valid decomposition strategies exist, and the team wants to agree on the approach before any code lands.",
    question: "How should you run Claude Code for this task?",
    options: [
      {
        id: "a",
        text: "Plan mode first: explore the codebase, present the strategy, get sign-off, then execute iteratively",
      },
      {
        id: "b",
        text: "Direct execution immediately, since Claude Code always asks before destructive edits",
      },
      {
        id: "c",
        text: "Disable permissions entirely so the migration completes in one autonomous pass overnight",
      },
      {
        id: "d",
        text: "Paste the whole repository into the initial prompt and ask for a one-shot rewrite",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "Plan mode exists precisely for large-scale, multi-approach changes: Claude explores, proposes a plan, and waits for approval before editing. After sign-off, iterative execution with tests at each step keeps the migration reviewable and reversible.",
    optionExplanations: {
      a: "Correct. Ambiguous strategy plus broad blast radius is the textbook plan-mode trigger.",
      b: "Direct execution suits simple, well-scoped edits. For a multi-strategy migration it guesses the approach before humans weigh in.",
      c: "Broadly granted permissions on an overnight autonomous run maximize, not minimize, risk on production code.",
      d: "Bulk-pasting a repository wastes context and forfeits the exploration and iteration workflow that makes migrations tractable.",
    },
    principle:
      "Match mode to blast radius: plan for large ambiguous changes, direct execution for small well-scoped ones.",
    tags: ["claude code", "plan mode", "permissions"],
    references: [
      {
        label: "Claude Code – Common workflows",
        url: "https://docs.anthropic.com/en/docs/claude-code/common-workflows",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-fewshot-extraction",
    domainId: "prompt-engineering",
    difficulty: "intermediate",
    type: "single-choice",
    scenario:
      "An extraction pipeline converts messy vendor emails into JSON (vendor, amount, currency, due_date). Field order drifts, currencies appear inconsistently formatted, and about one in five outputs fails schema validation.",
    question: "Which intervention most reliably improves format consistency?",
    options: [
      {
        id: "a",
        text: "Add two or three concrete input/output few-shot examples demonstrating the exact target schema, including a messy-currency case",
      },
      { id: "b", text: "Double the length of the prose instructions describing the format" },
      { id: "c", text: "Raise temperature to encourage the model to explore formats" },
      {
        id: "d",
        text: "Ask the model to try its best and validate afterwards without feedback",
      },
    ],
    correctOptionIds: ["a"],
    explanation:
      "For consistent formatting, concrete demonstrations outperform verbal descriptions. Few-shot pairs that show exact JSON shape, normalization of dirty inputs, and boundary handling anchor the output distribution far better than additional prose.",
    optionExplanations: {
      a: "Correct. Examples are the highest-leverage lever for format adherence, especially when they include the tricky cases.",
      b: "Longer prose restating the same rules adds tokens, not reliability. Models imitate demonstrations better than descriptions.",
      c: "Higher temperature increases variance, which is the opposite of the goal.",
      d: "Validation without a corrective loop just measures failure. Pair validation with schema-guided retries feeding errors back.",
    },
    principle:
      "Show, then tell: few-shot exemplars beat verbose instructions for structured output.",
    tags: ["few-shot prompting", "structured output", "json schema"],
    references: [
      {
        label: "Anthropic Docs – Prompt engineering overview",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
    ],
    isOfficial: false,
  },
  {
    id: "q-long-session-degradation",
    domainId: "context-reliability",
    difficulty: "advanced",
    type: "trade-off-analysis",
    scenario:
      "A customer-support agent handles six-hour sessions. Early responses cite ticket facts accurately; late-session responses start contradicting earlier statements and referencing details that were never provided. Token spend also grows super-linearly.",
    question: "Which trade-off analysis best resolves this?",
    options: [
      {
        id: "a",
        text: "Keep appending everything: dropping any history risks losing a fact the user mentioned once",
      },
      {
        id: "b",
        text: "Summarize resolved threads into structured session state at checkpoints, resume with the compact state plus recent turns, and persist provenance for cited facts",
      },
      {
        id: "c",
        text: "Start a brand-new session every hour and instruct users to repeat themselves",
      },
      {
        id: "d",
        text: "Have the model self-rate its confidence at the end of each response and warn users when confidence drops",
      },
    ],
    correctOptionIds: ["b"],
    explanation:
      "This balances continuity against degradation. Checkpoint summarization compresses stale detail into durable structured state while preserving recency for active threads; resuming from compact state bounds token growth; keeping provenance preserves attribution so later answers remain verifiable. Self-reported confidence is an unreliable proxy for correctness.",
    optionExplanations: {
      a: "Never trimming maximizes retention until attention dilution and cost make the agent unusable, which is exactly the observed failure.",
      b: "Correct. Summarize-and-resume with provenance directly targets degradation and cost while preserving continuity.",
      c: "Hard resets eliminate degradation by eliminating memory, transferring the burden to customers and destroying resolution rates.",
      d: "Models cannot reliably introspect their own accuracy; sentiment and self-reported confidence are poor routing signals compared with calibrated, field-level scores.",
    },
    principle:
      "Manage context actively: checkpoint summaries, compact resumes, and preserved provenance beat both hoarding and amnesia.",
    tags: ["context degradation", "summarization", "session management", "provenance"],
    references: [
      {
        label: "Anthropic Engineering – Effective context engineering for AI agents",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
    ],
    isOfficial: false,
  },
];
