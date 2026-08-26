import type { Lesson } from "../types";

export const domain5Lessons: Lesson[] = [
  {
    id: "context-degradation-summarization",
    domainId: "context-reliability",
    title: "Context Degradation & Summarization",
    summary:
      "Long sessions decay: attention dilutes, early details fade, cost compounds. Fight back with checkpoint summaries and compact resumes.",
    objectives: [
      "Recognize degradation symptoms: contradictions, forgotten constraints, super-linear cost",
      "Design checkpoint summarization that preserves durable state",
      "Choose between session resumption and fresh start with carried state",
      "Preserve provenance so compressed context stays verifiable",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Context windows are not free memory. As conversations grow, models weight recency heavily; instructions from turn 3 compete with 80 later turns for attention. Symptoms surface gradually: the agent re-asks answered questions, contradicts earlier commitments, or cites details that were never provided.",
        "The countermeasure is active context management. At checkpoints — resolved threads, completed subtasks — compress history into structured state (open items, decisions, user preferences with source references). Resume from compact state plus recent turns instead of the full transcript. When prior context is mostly still valid, resume it and prune; when it is mostly stale or compromised, start fresh but carry forward the distilled state object.",
      ],
    },
    whyItMatters: [
      "Context degradation, summarization, and session management headline Domain 5's task statements.",
      "Blueprint scenarios test resumption-vs-restart judgment under realistic support-desk conditions.",
      "Provenance requirements connect compression to auditability — you may not cite what you discarded without keeping its source.",
    ],
    simpleExample: {
      title: "Checkpoint compaction",
      body: "Every N turns, fold resolved threads into a state document and restart context from it:",
      code: {
        label: "compaction.ts",
        language: "typescript",
        code: `interface SessionState {
  openItems: { id: string; summary: string; owner: string }[];
  decisions: { decision: string; basis: string; source: string }[];
  userPrefs: { key: string; value: string; learnedAt: number }[];
}

async function checkpoint(history: Message[]): Promise<SessionState> {
  const { state } = await extract(JSON.stringify(history), stateSchema);
  return mergeWithPrior(priorState, state);
}

// New session seed = compact state + last K raw turns`,
      },
    },
    productionExample: {
      title: "Six-hour support marathon",
      body: "A helpdesk agent checkpoints every ten exchanges: resolved tickets collapse into two-line entries with ticket IDs preserved as provenance anchors. Late in a six-hour session the agent still quotes the customer's original constraint verbatim — because the checkpoint stored the quote and its source turn, not a vague paraphrase. Token spend per exchange dropped 55% versus full-transcript operation while contradiction incidents went to zero over four weeks of shadow traffic.",
    },
    antiPattern: {
      name: "Sentiment-triggered escalation",
      wrong:
        "Escalating to humans when the customer sounds angry, or trusting the agent's self-reported certainty.",
      consequence:
        "Angry-but-simple tickets waste human time while calmly-stated complex failures churn unsolved; self-assessment correlates weakly with actual error rates.",
      fix:
        "Escalate on structural signals: policy category, monetary thresholds, repeated failed tool calls, and confidence scores calibrated against labeled outcomes.",
    },
    tradeOffs: [
      {
        choice: "Full-transcript fidelity",
        gain: "Nothing explicitly lost",
        cost: "Attention dilution and costs grow until quality collapses",
      },
      {
        choice: "Aggressive summarization",
        gain: "Stable performance across long sessions",
        cost: "Lossy by design; provenance discipline required to stay auditable",
      },
      {
        choice: "Fresh start with state carry-over",
        gain: "Clean attention; removes poisoned context after failures",
        cost: "Reseeding logic must capture everything users expect remembered",
      },
    ],
    handsOn: {
      title: "Feel the decay",
      steps: [
        "Hold a 40-turn conversation with any assistant; note facts from turn 3 and re-verify them at turn 35.",
        "Add checkpointing to your multi-agent prototype at every fifth turn.",
        "Measure token spend and answer accuracy before vs after on a scripted long task.",
        "Write your merge policy: which state fields always survive compaction?",
      ],
      linkedLabId: "enterprise-support-agent",
    },
    examQuestionId: "q-session-resume-vs-fresh",
    takeaway:
      "Treat context as a cache you actively manage: checkpoint, compress with provenance, and resume deliberately.",
    tags: ["context degradation", "summarization", "session management"],
  },
  {
    id: "reliability-escalation-observability",
    domainId: "context-reliability",
    title: "Reliability, Escalation & Observability",
    summary:
      "Production agents need typed failure paths, calibrated human routing, and traces that make every iteration debuggable after the fact.",
    objectives: [
      "Propagate errors with categories that drive deterministic next actions",
      "Route human review using calibrated confidence from labeled validation sets",
      "Instrument agents with per-iteration traces linking inputs, outputs, cost",
      "Explain provenance chains from final answer back to source documents",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Reliability is designed at three layers. Failure typing: every tool result distinguishes transient errors (timeout, 503 — retry with backoff), validation errors (bad input — fix input, never retry blindly), and permission errors (escalate, do not retry). Review routing: field-level confidence scores calibrated on labeled sets direct borderline outputs to humans, with thresholds tuned to review capacity. Observability: each loop iteration logs inputs, outputs, latency, token spend, and trace IDs so any answer can be replayed.",
        "Provenance stitches it together: every factual claim in an agent's output should resolve through citations or state records back to a source document or tool response. Without that chain, postmortems become guesswork and audits become impossible.",
      ],
    },
    whyItMatters: [
      "Error propagation, human review, escalation, and observability are all named Domain 5 topics.",
      "Blueprint guidance explicitly calls out calibrated field-level scores over sentiment proxies.",
      "Crash recovery and structured state persistence appear in Domain 1/5 crossover scenarios.",
    ],
    simpleExample: {
      title: "Typed error handling + tracing",
      body: "Category determines destiny:",
      code: {
        label: "failure-taxonomy.ts",
        language: "typescript",
        code: `switch (result.errorCategory) {
  case "transient":
    await backoffRetry(result.traceId); break;
  case "validation":
    return correctInputAndContinue(result.details);
  case "permission":
    return queueForHuman({ reason: result, provenance });
  default:
    return failClosed(result.traceId);
}
trace.emit("agent.iteration", { spanId, inputHash,
  outputHash, tokens, latencyMs });`,
      },
    },
    productionExample: {
      title: "Claims triage with calibrated routing",
      body: "An insurer's intake agent outputs per-field confidence for extracted claim data. Thresholds were set from a labeled validation set of 2,000 historical claims so that auto-approved fields run at 99.5% precision; anything below threshold flows to adjusters sorted by confidence ascending. Every extraction writes a trace linking email → extraction span → validator results → final JSON. When a bug surfaced in date parsing, engineers replayed affected traces in minutes and identified exactly which claims needed reprocessing — no log archaeology required.",
    },
    antiPattern: {
      name: "Stringly-typed failures",
      wrong:
        "Returning 'Error: something went wrong' from every failure path and letting the model improvise next steps.",
      consequence:
        "Transient outages cause infinite blind retries; permission walls get hammered; nothing distinguishable reaches dashboards.",
      fix:
        "Adopt the taxonomy (transient / validation / permission / empty) in every tool contract, and branch on the category in code — not in prose.",
    },
    tradeOffs: [
      {
        choice: "Auto-retry transient errors",
        gain: "Self-healing during blips",
        cost: "Amplifies load during real outages without caps and jittered backoff",
      },
      {
        choice: "Calibrated confidence routing",
        gain: "Human attention lands where error risk actually lives",
        cost: "Requires labeled data and periodic recalibration as distribution drifts",
      },
      {
        choice: "Per-iteration tracing",
        gain: "Replayable postmortems; precise cost attribution",
        cost: "Storage volume and potential PII exposure requiring redaction layers",
      },
    ],
    handsOn: {
      title: "Make one agent auditable",
      steps: [
        "Classify every error path in your MCP server with the four-category taxonomy.",
        "Emit one structured trace line per loop iteration (input/output hashes, tokens, latency).",
        "Fabricate a labeled mini-set (20 examples) and compute precision at two confidence thresholds.",
        "Trace one final answer back to its sources; note where the chain breaks.",
      ],
      linkedLabId: "enterprise-support-agent",
    },
    examQuestionId: "q-error-taxonomy-routing",
    takeaway:
      "Type your failures, calibrate your routing, and trace every hop — reliability is what remains when you can replay any decision.",
    tags: ["reliability", "observability", "escalation", "provenance"],
  },
  {
    id: "context-window-strategies",
    domainId: "context-reliability",
    title: "Context Window Optimization Strategies",
    summary:
      "Maximize signal per token: hierarchical context loading, progressive disclosure, semantic search retrieval, and dynamic context assembly.",
    objectives: [
      "Design hierarchical context loading: summary → detail on demand",
      "Use retrieval-augmented generation to inject only relevant context",
      "Apply progressive disclosure to keep early context lightweight",
      "Balance context completeness against attention dilution",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Context windows are expensive real estate. Every token competes for attention, so the goal is maximizing information density: put the most relevant context first, defer details to on-demand retrieval, and never include context 'just in case.'",
        "Three strategies compound: hierarchical loading starts with a compact summary and drills into detail only when the task requires it. Retrieval-augmented generation (RAG) fetches relevant documents by semantic similarity rather than dumping the entire corpus. Progressive disclosure feeds context in stages — system prompt for identity and rules, initial context for the task, then expanding context as the model requests or the workflow requires.",
      ],
    },
    whyItMatters: [
      "Context management is Domain 5's core topic — the exam tests whether you can keep agents coherent at scale.",
      "RAG integration patterns appear across multiple domain blueprints.",
      "Cost optimization through context management is a real-world architectural concern.",
    ],
    diagram: "context-window",
    simpleExample: {
      title: "Hierarchical context loading",
      body: "Load summary first, expand on demand:",
      code: {
        label: "context-loader.ts",
        language: "typescript",
        code: `interface ContextLayer {
  summary: string;        // Always loaded (~200 tokens)
  details: string[];      // Loaded on task match (~500 tokens each)
  fullDoc: () => Promise<string>; // Loaded on demand
}

async function assembleContext(task: string, layers: ContextLayer[]) {
  const context = layers.map(l => l.summary).join("\\n");
  const relevant = layers.filter(l =>
    l.details.some(d => task.includes(keyword(d)))
  );
  return context + "\\n" + relevant.map(r => r.details.join("\\n")).join("\\n");
}`,
      },
    },
    productionExample: {
      title: "Customer support agent with RAG",
      body: "A support agent loads three context layers: (1) a 200-token company policy summary always present, (2) product-specific FAQs matched by ticket topic via embedding search, and (3) the customer's recent interaction history (last 5 messages). Full policy documents are available via a 'read more' tool the model can invoke when FAQ entries are insufficient. Token usage dropped 62% compared to loading all policies upfront, while first-contact resolution rate improved because the model focused on relevant context instead of drowning in noise.",
    },
    antiPattern: {
      name: "Load everything, hope attention handles it",
      wrong:
        "Dumping the entire knowledge base into context because 'the model can handle 200k tokens'.",
      consequence:
        "Key instructions diluted across thousands of tokens; model cites irrelevant documents; cost balloons with no quality improvement.",
      fix:
        "Implement retrieval. Start with keyword matching, graduate to semantic search. Always have a summary layer that fits in the system prompt.",
    },
    tradeOffs: [
      {
        choice: "RAG-based retrieval",
        gain: "Relevant context only; scalable to large corpora",
        cost: "Retrieval quality determines everything; embedding infrastructure needed",
      },
      {
        choice: "Hierarchical loading",
        gain: "Progressive detail; predictable token budget",
        cost: "Summary quality is critical; poor summaries cause missed context",
      },
      {
        choice: "Full context upfront",
        gain: "Zero retrieval latency; simple architecture",
        cost: "Attention dilution; cost scales linearly with corpus size",
      },
    ],
    handsOn: {
      title: "Optimize a context budget",
      steps: [
        "Audit a production prompt: how many tokens are loaded? How many are used?",
        "Implement a two-layer system: summary always + detail on match.",
        "Measure token usage and task quality before vs after.",
        "Add a tool that lets the model request specific documents on demand.",
      ],
    },
    examQuestionId: "q-context-optimization",
    takeaway:
      "Context is a cache you actively manage. Load the minimum, retrieve the relevant, and summarize the rest.",
    tags: ["context windows", "RAG", "optimization", "retrieval"],
  },
  {
    id: "monitoring-alerting",
    domainId: "context-reliability",
    title: "Production Monitoring & Alerting for Agents",
    summary:
      "Instrument agentic systems with metrics, traces, and alerts that catch degradation before users do — and make every failure root-causeable.",
    objectives: [
      "Define key metrics: latency, token cost, success rate, escalation rate per domain",
      "Implement structured tracing that links user request → agent iterations → tool calls → final output",
      "Design alerting rules based on metric thresholds and anomaly detection",
      "Build dashboards that surface agent health at a glance",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Production agents need observability across four pillars: metrics (aggregate health signals), traces (individual request journeys), logs (debugging detail), and alerts (automated threshold violations). Without these, teams discover problems from user complaints rather than dashboards.",
        "The most critical metrics for agentic systems are: p95 latency (how long users wait), token cost per request (budget compliance), success rate (task completion without escalation), and escalation rate (human intervention frequency). Each metric needs domain-level breakdowns so you can spot which domain is degrading.",
      ],
    },
    whyItMatters: [
      "Observability is explicitly named in Domain 5's exam topics.",
      "Production monitoring separates toy demos from deployable systems.",
      "Alert design requires understanding both the metrics and the agent architecture to set meaningful thresholds.",
    ],
    simpleExample: {
      title: "Agent trace structure",
      body: "Every request produces a structured trace for debugging:",
      code: {
        label: "tracing.ts",
        language: "typescript",
        code: `interface AgentTrace {
  requestId: string;
  userId: string;
  domain: string;
  startTime: number;
  iterations: {
    step: number;
    toolCalls: { tool: string; latencyMs: number; ok: boolean }[];
    tokensUsed: number;
  }[];
  outcome: "completed" | "escalated" | "failed";
  totalLatencyMs: number;
  totalTokens: number;
}

function emitTrace(trace: AgentTrace) {
  metrics.increment("agent.request", { domain: trace.domain, outcome: trace.outcome });
  metrics.histogram("agent.latency", trace.totalLatencyMs, { domain: trace.domain });
  metrics.histogram("agent.tokens", trace.totalTokens, { domain: trace.domain });
  traces.export(trace); // to OpenTelemetry, Datadog, etc.
}`,
      },
    },
    productionExample: {
      title: "Alerting on agent degradation",
      body: "A team monitors their support agent with three alert tiers: Info (escalation rate exceeds 15% for 10 minutes — investigate domain-specific degradation), Warning (p95 latency exceeds 30 seconds for 5 minutes — possible upstream slowdown), Critical (success rate drops below 80% for 5 minutes — page on-call). Alerts are domain-scoped so the team knows whether it's a billing-agent problem or a general infrastructure issue. During a vector database outage, the RAG retrieval alert fired first, before user complaints arrived.",
    },
    antiPattern: {
      name: "Alert on everything",
      wrong:
        "Setting alerts on every metric at low thresholds because 'coverage is safety'.",
      consequence:
        "Alert fatigue; real issues buried in noise; team stops responding to pages.",
      fix:
        "Three tiers (info/warning/critical) with domain-scoped thresholds tuned to actual baseline metrics. Start wide, narrow after two weeks of data.",
    },
    tradeOffs: [
      {
        choice: "Per-domain metric breakdowns",
        gain: "Precise diagnosis; domain-specific SLAs",
        cost: "More metrics to manage; higher storage costs",
      },
      {
        choice: "Structured tracing on every request",
        gain: "Full replayability; root-cause analysis in minutes",
        cost: "Storage volume; PII redaction required",
      },
      {
        choice: "Anomaly-based alerting",
        gain: "Catches novel failure modes without manual threshold tuning",
        cost: "Requires baseline data; can produce false positives during traffic spikes",
      },
    ],
    handsOn: {
      title: "Instrument an agent",
      steps: [
        "Add structured tracing to one agent loop (request → iterations → outcome).",
        "Define three metrics: latency, token count, success rate — with domain labels.",
        "Set up one alert at a realistic threshold based on observed baselines.",
        "Simulate a failure and verify the alert fires before you would have noticed manually.",
      ],
    },
    examQuestionId: "q-agent-monitoring",
    takeaway:
      "You cannot improve what you cannot measure. Instrument first, optimize second, alert on what matters.",
    tags: ["monitoring", "alerting", "observability", "tracing", "metrics"],
  },
];
