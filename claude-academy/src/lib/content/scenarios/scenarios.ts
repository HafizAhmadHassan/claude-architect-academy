import type { ArchitectureScenario } from "../types";

export const scenarios: ArchitectureScenario[] = [
  {
    id: "crm-support-agent-approval",
    title: "Support agent with guarded CRM writes",
    businessRequirement:
      "Your company needs a customer-support agent that can access CRM data to resolve tickets, but every modification of a customer record must be approved by a human before it takes effect.",
    technicalConstraints: [
      "Read latency budget: under 3 seconds per ticket reply",
      "CRM API supports scoped read-only and read-write service accounts",
      "Compliance forbids unreviewed changes to customer records",
      "Support team works in shifts; approvals must queue, not block synchronously forever",
    ],
    question: "What architecture should you choose?",
    choices: [
      {
        id: "a",
        text: "One autonomous agent holding a read-write CRM credential for all tools so it can resolve tickets end-to-end without human involvement",
      },
      {
        id: "b",
        text: "A single agent with auto-executed read-only tools; any mutating tool call is intercepted and queued as a structured change proposal that a human approves or rejects before execution",
      },
      {
        id: "c",
        text: "No tool use at all: the model answers from general knowledge and staff copy any changes manually into the CRM",
      },
      {
        id: "d",
        text: "Two independent agents, one reading and one writing, running simultaneously on the same ticket for speed",
      },
    ],
    correctChoiceId: "b",
    choiceExplanations: {
      a: "Violates the core compliance constraint. A read-write credential plus autonomy means unreviewed production mutations; one prompt-injected instruction away from an audit incident.",
      b: "Correct. Reads stay fast and autonomous under least privilege; writes become auditable proposals. The approval queue satisfies shift-based human review without blocking reads, and interception at the tool boundary makes policy enforcement programmatic rather than prompt-based.",
      c: "Meets safety by removing capability. Resolution rates collapse because every answer requiring real data becomes 'please contact support', which defeats the purpose of the agent.",
      d: "Splitting agents does not add oversight: the writer still mutates autonomously, and two agents racing on one ticket creates conflicting concurrent state with no single source of truth.",
    },
    explanation:
      "The requirement decomposes into two different risk classes. Reads are reversible and low-risk, so they belong on the fast path with scoped credentials. Writes are irreversible and regulated, so they must cross a human boundary. Enforcing this at the tool-execution layer (permission gate + proposal queue) turns compliance into architecture instead of a suggestion in the system prompt.",
    architecturalPrinciple:
      "Separate reversible actions from irreversible ones; gate irreversibility behind programmatic human review, not prompt instructions.",
    difficulty: "intermediate",
    domainId: "agentic-architecture",
    tags: ["human-in-the-loop", "permissions", "tool gateway", "compliance"],
  },
  {
    id: "document-pipeline-validation",
    title: "Invoice extraction pipeline with honest schemas",
    businessRequirement:
      "Finance receives 40,000 supplier emails per month. An automated pipeline must extract invoice fields (vendor, amounts, currency, line items, due date) into JSON for the ERP. Downstream systems reject malformed records, and finance refuses to pay from invented data.",
    technicalConstraints: [
      "Roughly 15% of invoices genuinely lack a due date",
      "Amounts arrive in multiple currencies and formats (1.234,56 vs 1,234.56)",
      "ERP accepts only validated JSON matching a strict schema; retries are cheap but silent corruption is not",
      "Pipeline must recover automatically from transient provider outages without duplicating payments",
    ],
    question: "Which pipeline design best satisfies these requirements?",
    choices: [
      {
        id: "a",
        text: "Force one all-required schema and retry with higher temperature until validation passes on every email",
      },
      {
        id: "b",
        text: "Nullable fields for genuinely optional data; tool-forced structured output validated against JSON Schema; retries that feed validator errors back to the model; typed transient-vs-validation error handling with idempotency keys on side effects",
      },
      {
        id: "c",
        text: "Free-text extraction parsed downstream with regexes written per supplier format",
      },
      {
        id: "d",
        text: "A single mega-prompt that extracts, validates, and commits to the ERP in one generation with no intermediate checks",
      },
    ],
    correctChoiceId: "b",
    choiceExplanations: {
      a: "Required-but-often-absent fields manufacture facts — exactly what finance forbids. Temperature roulette until validation passes also produces confidently wrong records that pass schema checks.",
      b: "Correct. The schema permits truth (null for absent dates), structured outputs make format deterministic at the API level, validator-informed retries convert failures into guided repair, and category-typed errors plus idempotency keys handle outages safely.",
      c: "Regex-per-supplier is unmaintainable at thousands of formats and fails silently on every new template; it optimizes for yesterday's mail.",
      d: "One-shot generation without intermediate validation concentrates every failure mode into an unauditable step; when it errs, no layer can catch it before money moves.",
    },
    explanation:
      "This scenario tests whether you treat the schema as an honesty contract rather than a form to satisfy. Absent data needs a representation (null), format correctness should be enforced by the API's structured-output mechanism instead of hope, retries must carry information (the validator's specific complaints), and failure classes must drive different handling: transient faults back off patiently while validation faults return for correction. Idempotency keys ensure that when retries do fire after partial failures, side effects like payment submissions cannot duplicate.",
    architecturalPrinciple:
      "Schemas must permit the truth, retries must carry information, and every class of failure deserves its own handler.",
    difficulty: "advanced",
    domainId: "prompt-engineering",
    tags: ["structured output", "validation", "retries", "idempotency", "schemas"],
  },
  {
    id: "long-session-support-degradation",
    title: "Long-running support sessions without context collapse",
    businessRequirement:
      "An enterprise support agent handles multi-day ticket conversations with customers. Sessions routinely exceed 150k tokens. Customers complain the agent forgets earlier commitments, and per-ticket cost has tripled because full history ships on every call.",
    technicalConstraints: [
      "Earlier promises (refunds, deadlines) must remain honored and auditable weeks later",
      "Support staff can review agent state but cannot re-enter data manually",
      "Provider context window caps at 200k tokens; cost grows linearly with shipped history",
      "Crash recovery must never resurrect corrupted or poisoned conversation spans",
    ],
    question: "Which session-management architecture fits?",
    choices: [
      {
        id: "a",
        text: "Keep appending everything to one transcript; upgrade to the largest available context window and instruct the model to prioritize important messages",
      },
      {
        id: "b",
        text: "Checkpoint-summarize resolved threads into durable structured state (with source references), resume each turn with compact state plus recent turns; sanitize history before resuming after crashes",
      },
      {
        id: "c",
        text: "Hard-reset context every morning and ask customers to restate their issue and prior agreements daily",
      },
      {
        id: "d",
        text: "Let the agent decide mid-session which past messages to delete based on self-assessed importance",
      },
    ],
    correctChoiceId: "b",
    choiceExplanations: {
      a: "Bigger windows delay, not prevent, dilution; 'prioritize' instructions compete inside the same overloaded attention, and linear cost growth remains untouched.",
      b: "Correct. Compaction bounds both attention dilution and shipping cost; durable structured state keeps commitments enforceable and auditable with provenance; crash sanitization prevents resurrection of corrupted spans.",
      c: "Amnesia transfers memory work onto customers, destroying satisfaction and violating the audit requirement for earlier promises.",
      d: "Self-pruned history is unauditable and lossy in the worst way: models discard what looks boring, which is often where obligations hide.",
    },
    explanation:
      "Context management is a first-class architecture concern once sessions outlive a window. The pattern: resolve-and-compress (finished threads become compact structured facts with references), keep recency live, and treat crashes as integrity events requiring sanitization before resumption. This preserves accountability (every commitment traces to its origin) while bounding the two resources that actually break long sessions: attention quality and token economics.",
    architecturalPrinciple:
      "Treat context as a managed resource: compress resolved work into durable state, resume compactly, and never resume unvalidated history.",
    difficulty: "advanced",
    domainId: "context-reliability",
    tags: ["context windows", "summarization", "session management", "crash recovery"],
  },
];
