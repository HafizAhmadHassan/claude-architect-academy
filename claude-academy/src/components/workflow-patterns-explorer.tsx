"use client";

import { useState } from "react";

interface PatternDef {
  id: string;
  name: string;
  kind: "workflow" | "agent";
  tagline: string;
  description: string;
  useWhen: string[];
  watchOut: string[];
  cost: "Low" | "Medium" | "High";
  diagram: React.ReactNode;
}

const box = {
  fill: "var(--panel-2)",
  stroke: "var(--line)",
};

const llmBox = {
  fill: "var(--accent-strong)",
};

function Edge({ d, label, dashed = false }: { d: string; label?: string; dashed?: boolean }) {
  const id = `we-${d.replace(/[^a-z0-9]/gi, "").slice(-10)}-${label?.length ?? 0}`;
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        markerEnd={`url(#wpe-arrow)`}
        className={dashed ? "" : "flow-dash"}
        strokeDasharray={dashed ? "4 4" : undefined}
        opacity={dashed ? 0.6 : 1}
        id={id}
      />
      {label && (
        <text fontSize="11" fill="var(--muted)" textAnchor="middle">
          <textPath href={`#${id}`} startOffset="50%">
            {label}
          </textPath>
        </text>
      )}
    </>
  );
}

function LlmNode({ x, y, w = 110, h = 48, label }: { x: number; y: number; w?: number; h?: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" {...llmBox} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#fff" fontWeight="600" fontSize="13">
        {label}
      </text>
    </g>
  );
}

function PlainNode({ x, y, w = 96, h = 40, label }: { x: number; y: number; w?: number; h?: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" {...box} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="var(--foreground)" fontWeight="600" fontSize="12">
        {label}
      </text>
    </g>
  );
}

function Gate({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <path
        d={`M ${cx} ${cy - 22} L ${cx + 30} ${cy} L ${cx} ${cy + 22} L ${cx - 30} ${cy} Z`}
        fill="var(--accent-soft)"
        stroke="var(--accent)"
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--accent)">
        {label}
      </text>
    </g>
  );
}

function DiagramFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 760 260" className="mx-auto min-w-[560px] max-w-full" role="img" aria-label={title}>
      <defs>
        <marker id="wpe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
        </marker>
      </defs>
      <g fontFamily="inherit">{children}</g>
    </svg>
  );
}

const chainingDiagram = (
  <DiagramFrame title="Prompt chaining workflow">
    <PlainNode x={8} y={110} label="Input" w={72} />
    <Edge d="M 80 130 H 108" />
    <LlmNode x={112} y={106} label="LLM 1" />
    <Edge d="M 222 130 H 258" />
    <Gate cx={292} cy={130} label="gate" />
    <Edge d="M 326 130 H 362" />
    <LlmNode x={366} y={106} label="LLM 2" />
    <Edge d="M 476 130 H 512" />
    <Gate cx={546} cy={130} label="gate" />
    <Edge d="M 580 130 H 616" />
    <LlmNode x={620} y={106} label="LLM 3" />
    <Edge d="M 730 130 H 752" />
    <text x={380} y={210} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Each call handles one fixed subtask · programmatic gates stop the chain early on failure
    </text>
  </DiagramFrame>
);

const routingDiagram = (
  <DiagramFrame title="Routing workflow">
    <PlainNode x={16} y={112} label="Input" w={76} />
    <Edge d="M 92 132 H 128" />
    <LlmNode x={132} y={104} w={140} label="Classifier" h={56} />
    <Edge d="M 272 118 C 340 100 360 56 430 52" label="" />
    <Edge d="M 272 132 H 430" />
    <Edge d="M 272 146 C 340 164 360 208 430 212" />
    <LlmNode x={434} y={28} w={170} h={44} label="Path A — specialist" />
    <LlmNode x={434} y={110} w={170} h={44} label="Path B — specialist" />
    <LlmNode x={434} y={192} w={170} h={44} label="Path C — specialist" />
    <text x={352} y={44} textAnchor="middle" fontSize="11" fill="var(--muted)">type A</text>
    <text x={352} y={126} textAnchor="middle" fontSize="11" fill="var(--muted)">type B</text>
    <text x={352} y={206} textAnchor="middle" fontSize="11" fill="var(--muted)">type C</text>
    <text x={380} y={248} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Classify once, then route to a specialized prompt — separation of concerns
    </text>
  </DiagramFrame>
);

const parallelizationDiagram = (
  <DiagramFrame title="Parallelization workflow">
    <PlainNode x={16} y={112} label="Input" w={76} />
    <Edge d="M 92 132 H 122" />
    <PlainNode x={126} y={108} label="Split" w={70} h={48} />
    <Edge d="M 196 120 C 240 104 250 60 300 54" />
    <Edge d="M 196 132 H 300" />
    <Edge d="M 196 144 C 240 160 250 204 300 210" />
    <LlmNode x={304} y={32} w={150} h={44} label="LLM — aspect A" />
    <LlmNode x={304} y={110} w={150} h={44} label="LLM — aspect B" />
    <LlmNode x={304} y={188} w={150} h={44} label="LLM — aspect C" />
    <Edge d="M 454 54 C 520 66 540 104 592 118" />
    <Edge d="M 454 132 H 592" />
    <Edge d="M 454 210 C 520 198 540 160 592 146" />
    <PlainNode x={596} y={108} label="Aggregate" w={110} h={48} />
    <text x={380} y={248} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Sectioning for independent aspects · voting for higher confidence
    </text>
  </DiagramFrame>
);

const orchestratorDiagram = (
  <DiagramFrame title="Orchestrator–workers workflow">
    <LlmNode x={290} y={20} w={180} h={46} label="Orchestrator LLM" />
    <Edge d="M 330 66 C 280 84 220 92 168 102" label="subtask 1" />
    <Edge d="M 380 66 V 100" label="subtask 2" />
    <Edge d="M 430 66 C 480 84 540 92 592 102" label="subtask n" />
    <LlmNode x={90} y={106} w={156} h={42} label="Worker A" />
    <LlmNode x={302} y={106} w={156} h={42} label="Worker B" />
    <LlmNode x={514} y={106} w={156} h={42} label="Worker n" />
    <Edge d="M 168 148 C 220 166 280 176 330 190" />
    <Edge d="M 380 148 V 186" />
    <Edge d="M 592 148 C 540 166 480 176 430 190" />
    <LlmNode x={290} y={194} w={180} h={46} label="Synthesizer" />
    <text x={380} y={252} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Subtasks are decided at runtime by the orchestrator — not predefined like parallelization
    </text>
  </DiagramFrame>
);

const evaluatorDiagram = (
  <DiagramFrame title="Evaluator–optimizer workflow">
    <LlmNode x={90} y={96} w={170} h={56} label="Generator LLM" />
    <Edge d="M 260 124 H 420" label="draft" />
    <LlmNode x={424} y={96} w={170} h={56} label="Evaluator LLM" />
    <Edge d="M 509 152 C 500 200 320 214 205 158" label="reject → feedback" dashed />
    <Edge d="M 594 124 H 656" label="accept" />
    <PlainNode x={660} y={104} w={80} h={40} label="Done" />
    <text x={380} y={244} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Loop until accepted or max iterations — evaluator must be at least as capable as the generator
    </text>
  </DiagramFrame>
);

const agentDiagram = (
  <DiagramFrame title="Autonomous agent loop">
    <PlainNode x={16} y={108} w={86} label="Goal" />
    <Edge d="M 102 128 H 136" />
    <LlmNode x={140} y={94} w={170} h={68} label="Agent (LLM)" />
    <Edge d="M 310 112 H 452" label="tool_use proposal" />
    <PlainNode x={456} y={88} w={180} h={48} label="Environment / tools" />
    <Edge d="M 546 136 C 546 190 400 206 318 162" label="observations" />
    <Edge d="M 546 88 C 600 56 640 56 668 78" dashed label="stop condition?" />
    <Gate cx={700} cy={98} label="done" />
    <text x={380} y={238} textAnchor="middle" fontSize="12" fill="var(--muted)">
      Model directs its own control flow · ground truth from each tool result · budgets cap the exit
    </text>
  </DiagramFrame>
);

const PATTERNS: PatternDef[] = [
  {
    id: "chaining",
    name: "Prompt chaining",
    kind: "workflow",
    tagline: "Fixed sequence of calls with programmatic gates between steps",
    description:
      "Decompose a task into a fixed pipeline where each LLM call processes the previous output. Gates are cheap programmatic checks that halt the chain when an intermediate result is off-track.",
    useWhen: [
      "The task splits cleanly into fixed subtasks",
      "You can trade latency for higher accuracy per step",
      "Each intermediate output can be checked programmatically",
    ],
    watchOut: [
      "Every added step adds end-to-end latency",
      "Errors compound downstream if gates are missing",
    ],
    cost: "Low",
    diagram: chainingDiagram,
  },
  {
    id: "routing",
    name: "Routing",
    kind: "workflow",
    tagline: "Classify input once, dispatch to specialized handlers",
    description:
      "A classifier directs each input to a focused follow-up prompt or model. This separates concerns so optimizing one input type never degrades performance on others.",
    useWhen: [
      "Distinct input categories need clearly different handling",
      "Classification itself is reliable (rules or a small model)",
      "You want per-category prompts you can tune independently",
    ],
    watchOut: [
      "Misclassification sends work down the wrong path entirely",
      "Too many routes dilute each specialist's coverage",
    ],
    cost: "Low",
    diagram: routingDiagram,
  },
  {
    id: "parallelization",
    name: "Parallelization",
    kind: "workflow",
    tagline: "Run independent subtasks concurrently, then aggregate",
    description:
      "Sectioning splits a task into independent aspects handled simultaneously; voting runs the same task multiple times and takes the majority. Both cut latency or raise confidence.",
    useWhen: [
      "Subtasks are independent enough to run concurrently",
      "Multiple perspectives improve confidence (voting)",
      "Latency matters more than per-call cost",
    ],
    watchOut: [
      "Aggregation logic becomes the new failure point",
      "Cost multiplies with every parallel branch",
    ],
    cost: "Medium",
    diagram: parallelizationDiagram,
  },
  {
    id: "orchestrator-workers",
    name: "Orchestrator–workers",
    kind: "workflow",
    tagline: "Central LLM decomposes dynamically, workers execute, results synthesized",
    description:
      "A central LLM breaks the task into subtasks at runtime, delegates to worker LLMs, and synthesizes their results. Unlike parallelization, subtasks are not known in advance.",
    useWhen: [
      "Required subtasks depend on the specific input (e.g., unknown files to edit)",
      "Work naturally partitions across different scopes or tools",
    ],
    watchOut: [
      "The orchestrator is a single point of failure — log its plans and bound plan size",
      "N+1 calls mean real cost; workers may fail and need validation/retries",
    ],
    cost: "High",
    diagram: orchestratorDiagram,
  },
  {
    id: "evaluator-optimizer",
    name: "Evaluator–optimizer",
    kind: "workflow",
    tagline: "One LLM generates, another critiques in a loop until acceptance",
    description:
      "A generator produces a draft; an evaluator scores it against explicit criteria and either accepts it or returns feedback for revision. The loop exits on accept or a max-iteration cap.",
    useWhen: [
      "Clear evaluation criteria exist that a model can articulate",
      "Human-style iterative refinement demonstrably improves output",
    ],
    watchOut: [
      "An evaluator weaker than the generator adds latency without lifting quality",
      "Vague criteria make the loop oscillate instead of converge",
    ],
    cost: "Medium",
    diagram: evaluatorDiagram,
  },
  {
    id: "agent",
    name: "Autonomous agent",
    kind: "agent",
    tagline: "Model-directed loop with environment feedback and budgeted exit",
    description:
      "The LLM dynamically plans, proposes tool calls, and reacts to observations — gaining ground truth from the environment at every step. Humans gate checkpoints or blockers.",
    useWhen: [
      "The path cannot be predicted but progress can be verified",
      "Open-ended action space with bounded blast radius",
      "Latency tolerance covers many iterations",
    ],
    watchOut: [
      "Cost and latency scale with turns — always set turn/token/time budgets",
      "Missing observation wiring causes silent guessing loops",
    ],
    cost: "High",
    diagram: agentDiagram,
  },
];

export function WorkflowPatternsExplorer() {
  const [active, setActive] = useState(PATTERNS[0].id);
  const pattern = PATTERNS.find((p) => p.id === active)!;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel">
      <div className="flex flex-wrap gap-1 border-b border-line bg-panel-2 p-2" role="tablist" aria-label="Agentic workflow patterns">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            onClick={() => setActive(p.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              active === p.id
                ? "bg-accent-strong text-white"
                : "text-muted hover:bg-panel hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div key={pattern.id} className="animate-slide-up p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest ${
              pattern.kind === "agent" ? "bg-accent-soft text-accent" : "bg-panel-2 text-muted"
            }`}
          >
            {pattern.kind}
          </span>
          <h3 className="font-bold">{pattern.name}</h3>
          <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">
            Cost/latency: {pattern.cost}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{pattern.tagline}</p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-background p-3">
          {pattern.diagram}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_1.4fr]">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Use when</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {pattern.useWhen.map((u) => (
                <li key={u.slice(0, 24)} className="flex gap-2">
                  <span aria-hidden>✓</span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400">Watch out</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {pattern.watchOut.map((w) => (
                <li key={w.slice(0, 24)} className="flex gap-2">
                  <span aria-hidden>✕</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">How it works</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pattern.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
