import type { Lesson } from "../types";

export const domain1Lessons: Lesson[] = [
  {
    id: "orchestrator-subagents",
    domainId: "agentic-architecture",
    title: "Orchestrator & Subagents",
    summary:
      "Decompose oversized agents into a coordinating orchestrator plus scoped subagents with explicit context contracts.",
    objectives: [
      "Recognize when a single agent has outgrown its tool surface and context",
      "Design orchestrator/subagent boundaries around capabilities and risk",
      "Pass context between agents with structured summaries instead of raw transcripts",
      "Explain the cost and latency consequences of adding orchestration layers",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "An orchestrator is an agent whose job is planning and routing rather than doing. It decomposes a goal, dispatches subtasks to subagents that each own a narrow tool set and system prompt, then integrates their structured results. Each subagent runs its own loop with its own budget.",
        "The boundary rule: one capability area per subagent, and no subagent receives more context than it needs to act. Findings travel upward as structured summaries — key facts, citations, confidence — never as full conversation transcripts.",
      ],
    },
    whyItMatters: [
      "Task Statement 1.3 of the blueprint covers subagent invocation, context passing, and spawning directly.",
      "Orchestration is the standard fix for tool-selection confusion and unbounded prompt growth in production incidents.",
      "Every layer adds latency and cost; knowing when NOT to orchestrate is equally testable.",
    ],
    simpleExample: {
      title: "Research-and-write pipeline",
      body: "An orchestrator splits 'write a briefing on topic X' into research and drafting subagents. The researcher returns sources with relevance scores; the writer receives only those summaries.",
      code: {
        label: "orchestrator.ts",
        language: "typescript",
        code: `const plan = await orchestrator("Brief me on MCP adoption");

for (const task of plan.subtasks) {
  const subagent = task.kind === "research" ? researcher : writer;
  const result = await subagent.run({
    instruction: task.instruction,
    context: task.requiredContext,
  });
  orchestrator.observe(task.id, result.summary);
}

return orchestrator.finalize();`,
      },
    },
    productionExample: {
      title: "Security review service",
      body: "A platform team replaced one 20-tool review agent with an orchestrator and three subagents: repo scanner (read-only git tools), dependency auditor (SBOM tools), and report generator (no tools, template-bound output). Orchestrator-to-subagent payloads are typed JSON with file lists and finding IDs, capped at size limits. P95 latency rose 15% from the extra hops while false-positive rates fell by half because each scanner sees only relevant tools.",
    },
    antiPattern: {
      name: "Transcript forwarding",
      wrong:
        "Pasting a subagent's entire conversation history into the next agent's prompt 'so nothing is lost'.",
      consequence:
        "Context bloat, attention dilution, duplicated reasoning, and cost growth linear in team size instead of task size.",
      fix:
        "Require every subagent to return a structured summary object; forward only fields downstream agents actually consume.",
    },
    tradeOffs: [
      {
        choice: "Adding an orchestration layer",
        gain: "Focused contexts, scoped permissions, parallelizable subtasks",
        cost: "Extra latency, serialization design work, harder end-to-end debugging",
      },
      {
        choice: "Parallel subagent dispatch",
        gain: "Wall-clock time drops for independent subtasks",
        cost: "Result merging complexity and higher concurrent API spend",
      },
      {
        choice: "Typed context contracts",
        gain: "Predictable handoffs, testable boundaries, easier regression hunts",
        cost: "Upfront schema design; brittle if task shapes churn frequently",
      },
    ],
    handsOn: {
      title: "Split a monolithic agent",
      steps: [
        "Take any agent with more than eight tools and list its distinct responsibilities.",
        "Draw the orchestrator/subagent split on paper with one tool set per box.",
        "Implement the smallest version: two subagents, JSON summaries, shared turn budget.",
        "Measure cost and latency before vs after; record both numbers.",
      ],
    },
    examQuestionId: "q-subagent-context-passing",
    takeaway:
      "Orchestrate along capability boundaries, pass structured summaries, and let data prove the added hop is worth it.",
    tags: ["orchestration", "subagents", "context passing"],
  },
  {
    id: "human-in-the-loop-gates",
    domainId: "agentic-architecture",
    title: "Human-in-the-Loop Gates",
    summary:
      "Insert programmatic approval boundaries where actions become irreversible, regulated, or high-blast-radius.",
    objectives: [
      "Classify agent actions by reversibility and blast radius",
      "Implement approval gates at the tool boundary rather than in prompts",
      "Queue approvals so humans review asynchronously without blocking reads",
      "Explain why self-reported confidence is a poor gate signal",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Not all agent actions deserve equal scrutiny. Reading data is reversible; writing records, spending money, or sending email is not. A human-in-the-loop gate intercepts specific tool calls at execution time and converts them into proposals that queue for human approval.",
        "The critical design choice is enforcement point. A system-prompt instruction like 'always ask before deleting' is a suggestion the model can forget under pressure. A permission layer that physically cannot execute the write until a human signs off is architecture.",
      ],
    },
    whyItMatters: [
      "Blueprint scenarios repeatedly pair CRM/production access with mandatory human approval.",
      "The distinction between programmatic enforcement and prompt-based rules is explicitly tested.",
      "Approval queues resolve the tension between oversight and the support-team shift model.",
    ],
    simpleExample: {
      title: "Gated write tool",
      body: "The write path never mutates. It validates input, then returns a proposal payload tagged for the approval queue.",
      code: {
        label: "gate.ts",
        language: "typescript",
        code: `async function updateCustomerTier(input: TierChange) {
  validate(input);

  return {
    isError: true,
    content: [text(JSON.stringify({
      errorCategory: "permission",
      message: "Requires human approval",
      proposal: { ...input, status: "pending_approval" },
    }))],
  };
}`,
      },
    },
    productionExample: {
      title: "Refund desk with dual thresholds",
      body: "A payments agent executes refunds below $50 automatically against a limited-balance credential. Refunds from $50 to $200 generate proposals reviewed within one business day. Anything above $200 pages an on-call approver. The gate lives in the tool executor, keyed by action class, not in any prompt. Audit logs tie every executed refund to its approving human and original conversation ID.",
    },
    antiPattern: {
      name: "Confidence-score autopilot",
      wrong:
        "Letting the agent proceed autonomously whenever it self-reports high confidence before acting.",
      consequence:
        "Models are poorly calibrated about their own correctness; confident failures execute irreversible writes exactly when they should not.",
      fix:
        "Gate on action class and business thresholds enforced in code; route review attention using calibrated confidence trained on labeled outcomes, never free-text self-assessment.",
    },
    tradeOffs: [
      {
        choice: "Gating every write",
        gain: "Maximum oversight and auditability",
        cost: "Approval queues become bottlenecks; automation value shrinks toward zero",
      },
      {
        choice: "Threshold-based gates",
        gain: "Low-risk volume stays fast; scrutiny scales with stakes",
        cost: "Threshold tuning requires incident history and periodic review",
      },
      {
        choice: "Async approval queues",
        gain: "Humans review on shift schedules without blocking the agent",
        cost: "Proposals can go stale; expiry and re-validation policies are required",
      },
    ],
    handsOn: {
      title: "Add a gate to your MCP server",
      steps: [
        "List every tool you have built and mark each read-only or mutating.",
        "Convert one mutating tool into a proposal-returning gated tool.",
        "Add a mock approval endpoint that flips proposals to executed.",
        "Verify the agent communicates pending status honestly to users.",
      ],
      linkedLabId: "multi-agent-research",
    },
    examQuestionId: "q-confidence-gate-vs-threshold",
    takeaway:
      "Enforce oversight where actions execute, not where the model talks. Irreversibility defines the gate line.",
    tags: ["human-in-the-loop", "permissions", "approval gates"],
  },
];
