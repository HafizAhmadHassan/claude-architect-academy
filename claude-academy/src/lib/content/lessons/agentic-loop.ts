import type { Lesson } from "../types";

export const agenticLoopLesson: Lesson = {
  id: "the-agentic-loop",
  domainId: "agentic-architecture",
  title: "The Agentic Loop",
  summary:
    "The core runtime pattern behind every Claude agent: reason, act through tools, observe results, and repeat until a stop condition is met.",
  objectives: [
    "Describe each phase of the agentic loop and what flows between them",
    "Explain why tool results must be fed back into the conversation as observations",
    "Choose stop conditions that prevent both premature exits and runaway loops",
    "Identify the production risks introduced by unbounded loops",
  ],
  explanation: {
    heading: "Concept",
    body: [
      "An agent is not a single model call. It is a loop in which Claude repeatedly decides the next action, executes it through a tool, observes the structured result, and updates its plan. The model never touches your systems directly. It proposes tool calls; your runtime executes them and returns observations.",
      "The loop closes when a stop condition fires: the model emits a final answer, a budget is exhausted (turns, tokens, time, or cost), or a required human approval gate halts execution. Everything else in agentic design, including orchestration, subagents, and handoffs, is an extension of this one pattern.",
    ],
  },
  whyItMatters: [
    "Domain 1 carries the heaviest exam weight (27%), and nearly every scenario assumes you can trace what happens on each iteration of the loop.",
    "Most production incidents in agent systems are loop failures: missing observations, absent budgets, or stop conditions that never fire.",
    "Cost and latency scale with iterations, so loop design is where architectural trade-offs become concrete.",
  ],
  diagram: "agentic-loop",
  simpleExample: {
    title: "A two-tool support agent",
    body: "Claude answers billing questions using lookup_invoice and refund_status. Each turn it may call one tool; your code runs it and appends the result as an observation.",
    code: {
      label: "agent.ts",
      language: "typescript",
      code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
  {
    name: "lookup_invoice",
    description:
      "Look up an invoice by ID. Returns status, amount, and due date. Use for any question about a specific invoice.",
    input_schema: {
      type: "object" as const,
      properties: { invoice_id: { type: "string" } },
      required: ["invoice_id"],
    },
  },
  {
    name: "refund_status",
    description:
      "Get the current status of a refund request. Returns state and last update time.",
    input_schema: {
      type: "object" as const,
      properties: { refund_id: { type: "string" } },
      required: ["refund_id"],
    },
  },
];

async function runAgent(userGoal: string, maxTurns = 8) {
  const messages = [{ role: "user", content: userGoal }];

  for (let turn = 0; turn < maxTurns; turn++) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: "Answer billing questions. Use tools before stating facts.",
      messages,
      tools,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      return response;
    }

    const toolUseBlocks = response.content.filter(
      (b) => b.type === "tool_use"
    );
    const results = await Promise.all(
      toolUseBlocks.map(async (call) => ({
        type: "tool_result" as const,
        tool_use_id: call.id,
        content: JSON.stringify(await executeTool(call.name, call.input)),
      }))
    );

    messages.push({ role: "user", content: results });
  }

  throw new Error("Turn budget exhausted before completion");
}

async function executeTool(name: string, input: unknown) {
  if (name === "lookup_invoice") {
    return { status: "overdue", amount_usd: 240, days_late: 6 };
  }
  return { state: "processing", updated_at: "2026-08-20T14:03:00Z" };
}`,
    },
  },
  productionExample: {
    title: "Refund triage service at an e-commerce company",
    body: "A payments team wraps the same loop in production guardrails: every tool result is validated against a schema before re-entering the prompt, the loop enforces a hard budget of 10 turns and $0.40 of token spend, and any refund above $200 routes to a human approval queue instead of executing. Structured logs record each iteration with inputs, outputs, latency, and cost so regressions are debuggable. The loop itself did not change from the simple example. What changed is that every exit path became explicit.",
  },
  antiPattern: {
    name: "Fire-and-forget tool calls",
    wrong:
      "Executing tool calls but appending only the assistant's text to history, discarding the structured tool_result blocks.",
    consequence:
      "The model loses its observations, re-plans from stale assumptions, repeats calls it already made, or confidently invents results it never saw. Costs climb while quality collapses.",
    fix:
      "Always append a user message containing one tool_result block per tool_use block, keyed by tool_use_id, before the next model call.",
  },
  tradeOffs: [
    {
      choice: "Higher turn budget",
      gain: "Complex multi-step tasks complete without manual restarts",
      cost: "Runaway loops multiply token spend and latency when the model thrashes",
    },
    {
      choice: "More tools per turn",
      gain: "Fewer iterations because the model can parallelize independent actions",
      cost: "Larger tool surface confuses selection and degrades accuracy per call",
    },
    {
      choice: "Strict stop conditions",
      gain: "Predictable worst-case cost and bounded incident blast radius",
      cost: "Legitimately long tasks terminate early unless budgets are tuned per task class",
    },
  ],
  handsOn: {
    title: "Trace the loop by hand",
    steps: [
      "Clone the simple example and add console.log of the full messages array after every append.",
      "Ask: 'Is invoice inv_881 overdue, and has my refund r_21 landed?' and count how many loop iterations run.",
      "Break it on purpose: comment out the tool_result append and watch the model hallucinate or repeat calls.",
      "Set maxTurns to 2 and confirm the budget error fires instead of an infinite loop.",
      "Finish the linked MCP lab to see the same loop driven through real external tools.",
    ],
    linkedLabId: "mcp-server",
  },
  examQuestionId: "q-agentic-loop-stop",
  takeaway:
    "An agent is a budgeted loop of decisions and observations. Design the exit paths first, then let the model improvise inside them.",
  tags: ["agentic loop", "tool use", "stop conditions", "state management"],
};
