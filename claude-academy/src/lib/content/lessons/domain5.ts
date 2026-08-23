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
];
