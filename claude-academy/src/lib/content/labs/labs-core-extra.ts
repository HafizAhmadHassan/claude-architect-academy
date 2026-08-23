import type { Lab } from "../types";

export const labsCoreExtra: Lab[] = [
  {
    id: "structured-api-app",
    domainIds: ["prompt-engineering", "tool-design-mcp"],
    title: "Structured-output extraction pipeline",
    estimatedMinutes: 75,
    objective:
      "Build a production-grade invoice-to-JSON pipeline using tool-forced structured outputs, schema-honest nullability, validator-informed retries, and a golden eval set that catches regressions before they reach users.",
    prerequisites: [
      "An Anthropic API key",
      "Node.js 20+ with TypeScript",
      "Completed the MCP server lab or equivalent API familiarity",
    ],
    architecture: [
      "Extraction runs through the Messages API with a forced tool choice, so the response is guaranteed to match your JSON Schema — format correctness moves from prompt hope to API contract.",
      "Fields that are genuinely optional in the real world (due dates on some invoices) must be nullable in the schema; required-but-absent fields manufacture facts.",
      "Validation happens after generation against the same schema plus business rules (currency formats, integer cents). Failures feed the validator's exact messages back into a retry.",
      "A frozen golden set of tricky documents gates every prompt or model change in CI, converting silent regressions into loud failures.",
    ],
    steps: [
      {
        title: "Design the honest schema",
        detail:
          "Write the Zod schema first. Note due_date is nullable because roughly 15% of invoices genuinely lack deadlines — forcing presence would fabricate dates.",
        code: {
          label: "src/schema.ts",
          language: "typescript",
          code: `import { z } from "zod";

export const InvoiceSchema = z.object({
  vendor: z.string().min(1),
  amount_minor: z
    .number()
    .int()
    .describe("Total in integer minor units (cents)"),
  currency: z.enum(["USD", "EUR", "GBP"]),
  due_date: z
    .string()
    .date()
    .nullable()
    .describe("ISO date, or null when the invoice states no deadline"),
  line_items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unit_price_minor: z.number().int(),
    })
  ),
});

export type Invoice = z.infer<typeof InvoiceSchema>;`,
        },
      },
      {
        title: "Force structured output via a tool",
        detail:
          "Register an emit_invoice tool and force Claude to call it. The SDK converts Zod into JSON Schema for you; the response arrives as validated arguments, not prose.",
        code: {
          label: "src/extract.ts",
          language: "typescript",
          code: `import Anthropic from "@anthropic-ai/sdk";
import { zodToJsonSchema } from "zod-to-json-schema";
import { InvoiceSchema } from "./schema.js";

const client = new Anthropic();

export async function extractInvoice(emailText: string) {
  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    tools: [
      {
        name: "emit_invoice",
        description:
          "Submit the extracted invoice. Use null for due_date when no deadline appears in the source.",
        input_schema: zodToJsonSchema(InvoiceSchema) as never,
      },
    ],
    tool_choice: { type: "tool", name: "emit_invoice" },
    messages: [
      {
        role: "user",
        content: \`Extract the invoice from this email. Never invent values:\\n\\n\${emailText}\`,
      },
    ],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  return block ? (block.input as unknown) : null;
}`,
        },
      },
      {
        title: "Validate with informed retries",
        detail:
          "Schema validity alone is not truth: add business rules (line items sum to total). On failure, retry with the validator's specific complaints appended so each attempt repairs rather than re-rolls.",
        code: {
          label: "src/pipeline.ts",
          language: "typescript",
          code: `import { extractInvoice } from "./extract.js";
import { InvoiceSchema } from "./schema.js";

const MAX_RETRIES = 3;

export async function extractValidated(emailText: string) {
  let complaint = "";
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const raw = await extractInvoice(
      complaint
        ? \`\${emailText}\\n\\nYour previous attempt was rejected:\\n\${complaint}\`
        : emailText
    );
    const parsed = InvoiceSchema.safeParse(raw);
    if (parsed.success) {
      const sum = parsed.data.line_items.reduce(
        (acc, li) => acc + li.quantity * li.unit_price_minor,
        0
      );
      if (Math.abs(sum - parsed.data.amount_minor) > 1) {
        complaint = \`line items sum to \${sum} but amount_minor is \${parsed.data.amount_minor}. Re-check quantities and unit prices.\`;
        continue;
      }
      return parsed.data;
    }
    complaint = parsed.error.issues
      .map((i) => \`\${i.path.join(".")}: \${i.message}\`)
      .join("; ");
  }
  throw new Error("extraction_failed_after_retries");
}`,
        },
      },
      {
        title: "Freeze a golden eval set",
        detail:
          "Save ten documents covering your documented hard cases: missing due date, comma-decimal EUR amounts, multi-page line items, zero-amount credit notes. Gate changes on them.",
        code: {
          label: "eval/run-evals.ts",
          language: "typescript",
          code: `import fs from "node:fs";
import { extractValidated } from "../src/pipeline.js";

const cases = JSON.parse(
  fs.readFileSync("eval/golden.json", "utf8")
); // [{input: "...", expect: {...}}, ...]

let failures = 0;
for (const [i, c] of cases.entries()) {
  const got = await extractValidated(c.input);
  const ok =
    JSON.stringify(got) === JSON.stringify(c.expect);
  if (!ok) {
    failures++;
    console.error(\`case \${i} FAILED\`, { got, want: c.expect });
  }
}
process.exit(failures > 0 ? 1 : 0);`,
        },
      },
    ],
    expectedOutput:
      "For an email with no deadline, due_date comes back exactly null (never a guessed date). For a malformed attempt, the retry log shows the validator's specific complaint feeding the next call, and run-evals exits 0 on the golden set.",
    validationChecklist: [
      "Missing-deadline fixture returns due_date: null across 5 consecutive runs",
      "amount_minor is always an integer — never 12.34",
      "Deliberately corrupting the schema makes the pipeline fail with extraction_failed_after_retries, not silently",
      "Golden-set runner exits nonzero when any case breaks",
      "Retry log proves the second attempt received the first attempt's validation errors",
    ],
    extensionChallenge:
      "Add per-supplier few-shot examples selected by vendor detection, track token spend per document, and wire the eval runner into CI so any prompt change requires a green golden set before merge.",
  },
  {
    id: "tool-use-app",
    domainIds: ["agentic-architecture", "tool-design-mcp"],
    title: "Tool-use agent loop from scratch",
    estimatedMinutes: 60,
    objective:
      "Implement the core agentic loop by hand — tools, tool_result wiring, stop conditions, and budgets — so you can diagnose the failure modes (orphaned results, runaway loops) that frameworks normally hide.",
    prerequisites: [
      "An Anthropic API key",
      "Node.js 20+ with TypeScript",
      "Understanding of the agentic-loop lesson",
    ],
    architecture: [
      "The loop: send messages → Claude responds → if stop_reason is tool_use, execute each requested tool → append tool_result blocks → repeat until end_turn or budget exhaustion.",
      "Every tool_use block MUST be answered by a tool_result block in the next message; skipping this is the root cause of hallucinated answers.",
      "Stop conditions come from structured signals (stop_reason === 'end_turn'); the turn budget exists only for when those signals never fire.",
      "Tools are plain functions behind a registry keyed by name — the model never executes anything itself.",
    ],
    steps: [
      {
        title: "Define tools and their schemas",
        detail:
          "Two read-only tools over fake data. Descriptions state scope, formats, and empty-result behavior.",
        code: {
          label: "src/tools.ts",
          language: "typescript",
          code: `import Anthropic from "@anthropic-ai/sdk";

type ToolDef = Anthropic.Tool;
type Handler = (args: Record<string, never>) => unknown;

export const TOOLS: ToolDef[] = [
  {
    name: "lookup_order",
    description:
      "Fetch one order by ID. IDs look like 'ord_123'. Returns order status, items, and totals. Returns {found: false} for unknown IDs — that is data, not an error.",
    input_schema: {
      type: "object",
      properties: {
        order_id: { type: "string", pattern: "^ord_" },
      },
      required: ["order_id"],
    },
  },
  {
    name: "list_open_orders",
    description:
      "List all orders with status 'open'. Returns an array, possibly EMPTY when nothing is open.",
    input_schema: { type: "object", properties: {} },
  },
];

export const HANDLERS: Record<string, Handler> = {
  lookup_order: ({ order_id }: never) => {
    const db: Record<string, unknown> = {
      ord_1: { status: "open", total_minor: 4200 },
      ord_2: { status: "shipped", total_minor: 1999 },
    };
    return db[order_id as string]
      ? { found: true, ...db[order_id as string] }
      : { found: false };
  },
  list_open_orders: () => [{ id: "ord_1", total_minor: 4200 }],
};`,
        },
      },
      {
        title: "Write the loop with correct result wiring",
        detail:
          "The critical section: assistant tool_use blocks and your tool_result blocks must pair up inside the conversation history.",
        code: {
          label: "src/agent.ts",
          language: "typescript",
          code: `import Anthropic from "@anthropic-ai/sdk";
import { TOOLS, HANDLERS } from "./tools.js";

const client = new Anthropic();
const MAX_TURNS = 8; // budget: worst-case ceiling

export async function runAgent(userGoal: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userGoal },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      tools: TOOLS,
      messages,
    });

    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      return res.content; // normal exit: the answer
    }

    // Answer EVERY requested tool — never partially
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      const output = HANDLERS[block.name](block.input as never);
      results.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(output),
      });
    }
    messages.push({ role: "user", content: results });
  }

  throw new Error("turn_budget_exhausted"); // observable, bounded
}`,
        },
      },
      {
        title: "Break it on purpose",
        detail:
          "Reproduce the classic bugs in a scratch copy so you recognize them in logs: comment out the tool_result push (orphaned results), then set MAX_TURNS to 1000 without a stop check (runaway cost).",
        code: {
          label: "terminal",
          language: "bash",
          code: `npx tsx -e '
import { runAgent } from "./src/agent.js";
const answer = await runAgent(
  "What is the total of our open orders? Use the tools."
);
console.log(JSON.stringify(answer, null, 2));'`,
        },
      },
    ],
    expectedOutput:
      "The agent calls list_open_orders, receives the data, computes the answer, and stops with end_turn — all within 3 turns. The broken variants show either Claude inventing an answer (orphaned result) or the budget exception firing.",
    validationChecklist: [
      "Happy path answers correctly in ≤3 turns with visible tool calls in logs",
      "Every tool_use block in history has a matching tool_result",
      "Unknown order_id yields {found:false} consumed gracefully — never an exception",
      "Setting an impossible goal terminates via turn_budget_exhausted within bounded turns",
      "No console.log inside handlers pollutes structured output",
    ],
    extensionChallenge:
      "Add a parallel-tool-call trace showing multiple tool_use blocks answered in one round trip, wrap handlers in the typed error envelope from the MCP lab, and log token counts per turn to watch cost grow with history.",
  },
  {
    id: "multi-agent-research",
    domainIds: ["agentic-architecture"],
    title: "Orchestrator + subagent research system",
    estimatedMinutes: 90,
    objective:
      "Build a three-agent research system — one orchestrator, parallel researcher subagents, one writer — practicing scoped briefs, fan-out/fan-in, and findings-with-provenance handoffs instead of transcript dumps.",
    prerequisites: [
      "An Anthropic API key",
      "Completed the tool-use agent loop lab",
      "Comfort with Promise.all for parallel dispatch",
    ],
    architecture: [
      "The orchestrator decomposes the question into independent sub-questions, spawns one researcher per sub-question in parallel, then feeds structured findings to a single writer.",
      "Subagents receive a focused brief (question, constraints, required output shape) — never the whole conversation. They return findings with source URLs and relevance scores.",
      "Parallelize independence: researchers run concurrently via Promise.all; the writer waits because it depends on every input (fan-in).",
      "Context passing is by contract: {claim, source, confidence} tuples, not transcripts. The writer's prompt stays small regardless of how much the researchers explored.",
    ],
    steps: [
      {
        title: "Define the finding contract",
        detail:
          "Everything agents exchange flows through this shape. It is what makes handoffs auditable.",
        code: {
          label: "src/types.ts",
          language: "typescript",
          code: `export interface Finding {
  claim: string;
  source_url: string;
  quote: string;
  confidence: number; // 0..1, from labeled rubric
}

export interface Brief {
  question: string;
  constraints: string[];
  requiredFindings: number;
}

export interface ResearchResult {
  brief: Brief;
  findings: Finding[];
  tokensUsed: number;
}`,
        },
      },
      {
        title: "Implement a researcher subagent",
        detail:
          "Each researcher gets only its brief. In production its tools would be web search; here a mock corpus keeps the lab offline-friendly while preserving the contract.",
        code: {
          label: "src/researcher.ts",
          language: "typescript",
          code: `import Anthropic from "@anthropic-ai/sdk";
import type { Brief, ResearchResult, Finding } from "./types.js";

const client = new Anthropic();

const CORPUS = [
  { url: "https://docs.example.com/r1", text: "Study A found X improves throughput 40%." },
  { url: "https://blog.example.com/r2", text: "Practitioners report X regresses latency at scale." },
];

export async function research(brief: Brief): Promise<ResearchResult> {
  const res = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1500,
    system:
      "You are a research agent. Answer ONLY from the provided corpus. " +
      "Return strict JSON: {findings:[{claim, source_url, quote, confidence}]}. " +
      "Every claim needs a verbatim quote from its cited source.",
    messages: [{
      role: "user",
      content: \`QUESTION: \${brief.question}\\nCONSTRAINTS: \${brief.constraints.join("; ")}\\n\\nCORPUS:\\n\${JSON.stringify(CORPUS)}\`,
    }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const findings: Finding[] = JSON.parse(text).findings;

  return {
    brief,
    findings,
    tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
  };
}`,
        },
      },
      {
        title: "Wire the orchestrator with fan-out/fan-in",
        detail:
          "Decompose, dispatch in parallel, wait for all, then hand compact findings — not transcripts — to the writer.",
        code: {
          label: "src/orchestrator.ts",
          language: "typescript",
          code: `import { research } from "./researcher.js";
import type { ResearchResult } from "./types.js";

export async function orchestrate(topic: string) {
  const briefs = decompose(topic);

  // Fan-out: researchers are independent -> parallel
  const results: ResearchResult[] = await Promise.all(
    briefs.map((b) => research(b))
  );

  // Fan-in: writer depends on ALL results -> after Promise.all
  const report = await writeReport(topic, results);

  return { report, totalTokens: results.reduce((s, r) => s + r.tokensUsed, 0) };
}

function decompose(topic: string) {
  // In production an LLM call produces these; fixed here for reproducibility
  return [
    { question: \`Evidence FOR \${topic}\`, constraints: ["cite corpus"], requiredFindings: 2 },
    { question: \`Evidence AGAINST \${topic}\`, constraints: ["cite corpus"], requiredFindings: 2 },
  ];
}

async function writeReport(topic: string, results: ResearchResult[]) {
  const findings = results.flatMap((r) =>
    r.findings.map((f) => ({ ...f, question: r.brief.question }))
  );
  const client = new Anthropic();
  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system:
      "Synthesize a balanced report. Cite sources inline as [url]. " +
      "Never state claims absent from the findings.",
    messages: [{
      role: "user",
      content: \`TOPIC: \${topic}\\n\\nFINDINGS:\\n\${JSON.stringify(findings, null, 2)}\`,
    }],
  });
  return res.content
    .filter((b): b is import("@anthropic-ai/sdk").TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\\n");
}`,
        },
      },
      {
        title: "Measure what the contract saves",
        detail:
          "Log the token cost of handing findings vs handing full transcripts. The delta is the argument for structured handoffs.",
        code: {
          label: "terminal",
          language: "bash",
          code: `npx tsx -e '
import { orchestrate } from "./src/orchestrator.js";
const out = await orchestrate("serverless databases");
console.log("REPORT:", out.report.slice(0, 400));
console.log("TOTAL TOKENS:", out.totalTokens);
// Compare: JSON.stringify(fullTranscripts).length / 4 ≈ tokens wasted
// if we had forwarded raw conversations instead of findings.'`,
        },
      },
    ],
    expectedOutput:
      "Two researchers run concurrently (wall clock ≈ slowest, not sum), the report cites only corpus URLs, and the writer's prompt contains findings — measured in hundreds of tokens — instead of full transcripts in the tens of thousands.",
    validationChecklist: [
      "Researchers provably overlap in time (timestamped logs)",
      "Every sentence in the report citing a fact maps to a Finding with a matching URL",
      "Writer prompt size stays flat even when researcher transcripts grow",
      "A deliberately fabricated claim (corpus stripped) causes the researcher to return zero findings rather than inventing quotes",
      "totalTokens accounts for both subagents but excludes the orchestrator's own overhead",
    ],
    extensionChallenge:
      "Add a verifier agent that re-checks each Finding's quote against the corpus and downgrades confidence on mismatch, then route low-confidence findings back to researchers for a second pass before writing.",
  },
];
