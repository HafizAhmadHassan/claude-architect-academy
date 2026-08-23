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
];
