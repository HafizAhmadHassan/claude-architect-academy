import type { Lesson } from "../types";

export const stateManagementLesson: Lesson[] = [
  {
    id: "state-management-sessions",
    domainId: "agentic-architecture",
    title: "State Management & Session Isolation",
    summary:
      "Distinguish ephemeral conversation state from durable application state and isolate each agent's context to prevent cross-contamination.",
    objectives: [
      "Separate conversation history (ephemeral) from durable state (database, Redis, filesystem)",
      "Enforce session isolation so subagents never share raw transcripts",
      "Choose structured payloads over conversation replay when passing state between agents",
      "Design cross-session memory using summaries and persistent stores instead of full history replay",
      "Implement state checkpointing for crash recovery and human review of intermediate results",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Every agent session has two kinds of state: ephemeral conversation history that lives in the context window and durable application state that lives outside it. Conversation history grows with every turn and is discarded when the session ends. Durable state — database records, Redis keys, file contents — persists across sessions and must be explicitly managed.",
        "Session isolation means each agent or subagent maintains its own conversation transcript. Sharing raw transcripts between agents pollutes context with irrelevant reasoning chains, tool calls, and false starts. Instead, pass structured results: typed objects containing only the findings, citations, and confidence scores the receiving agent needs.",
        "Cross-session memory avoids replaying full histories by summarizing key facts and storing them in external systems. CLAUDE.md captures project-level knowledge that persists across all sessions. Session-specific facts go to databases or files with explicit schemas. Checkpointing intermediate state before risky tool calls enables crash recovery and offline human review without re-running the entire agent loop.",
      ],
    },
    whyItMatters: [
      "Task Statement 1.1 covers context-window management — understanding what stays in versus outside context is directly tested.",
      "Every extra token of forwarded transcript costs money and dilutes attention; session isolation is the primary cost-control mechanism.",
      "Crash recovery and auditability require persisted intermediate state; without checkpoints, failures mean full replays.",
    ],
    diagram: "workflow-patterns",
    simpleExample: {
      title: "Separating context from durable state",
      body: "The agent keeps only active task context in the conversation window while persisting durable facts to an external store. On session restart, it loads facts back instead of replaying history.",
      code: {
        label: "state-separation.ts",
        language: "typescript",
        code: `interface SessionState {
  conversationHistory: Message[];   // ephemeral — lives in context
  facts: Record<string, unknown>;   // durable — lives in Redis
  checkpoints: Checkpoint[];        // durable — lives in database
}

// Before risky tool call, checkpoint current state
async function checkpoint(state: SessionState) {
  await db.save({
    sessionId: state.conversationHistory[0].sessionId,
    facts: state.facts,
    lastTurn: state.conversationHistory.length,
    timestamp: Date.now(),
  });
}

// On session resume, load facts instead of replaying
async function resumeSession(sessionId: string): Promise<SessionState> {
  const saved = await db.load(sessionId);
  return {
    conversationHistory: [], // start fresh
    facts: saved.facts,      // restore durable state
    checkpoints: saved.checkpoints,
  };
}`,
      },
    },
    productionExample: {
      title: "Multi-agent research pipeline with isolated sessions",
      body: "A research platform spawns three agents — a planner, a crawler, and a summarizer — each with its own session. The planner persists its decomposition plan and progress to a database after each subtask completes. The crawler stores raw page content in object storage and returns only extracted facts as structured payloads. The summarizer receives a typed array of { source, excerpt, relevanceScore } objects and never sees either agent's conversation history. If the crawler crashes mid-run, the planner reads the last checkpoint, identifies which pages were already processed, and resumes without re-crawling. Total cost stays predictable because context window usage is bounded by the current subtask's payload, not the full pipeline history.",
    },
    antiPattern: {
      name: "Transcript replay across sessions",
      wrong:
        "Storing the full conversation history and replaying it into the next agent's context window to maintain continuity.",
      consequence:
        "Context window fills with irrelevant tool calls and reasoning traces from prior agents, reducing available space for the current task and increasing cost per turn.",
      fix:
        "Persist only structured summaries and extracted facts to an external store. On session resume or cross-agent handoff, load the summary — never the raw transcript.",
    },
    tradeOffs: [
      {
        choice: "Keeping state in context vs external store",
        gain: "In-context state requires no infrastructure and is immediately available to the model",
        cost: "Consumes limited context tokens; unbounded growth leads to truncation and lost information",
      },
      {
        choice: "Full transcript persistence vs summary snapshots",
        gain: "Full transcripts preserve every detail for debugging and audit",
        cost: "Storage and replay cost grow linearly; summaries are lossy but bounded",
      },
      {
        choice: "Eager checkpointing vs lazy checkpointing",
        gain: "Eager checkpoints before every tool call maximize crash recovery granularity",
        cost: "High write overhead; lazy checkpoints at subtask boundaries reduce I/O at the cost of coarser recovery",
      },
    ],
    handsOn: {
      title: "Implement session isolation for a subagent pipeline",
      steps: [
        "Define a typed summary interface for inter-agent payloads with fields for findings, sources, and confidence.",
        "Add a checkpoint function that persists agent state to a file or database before each risky tool call.",
        "Modify your orchestrator to pass only the summary object to the next agent, not the conversation history.",
        "Simulate a crash mid-pipeline and verify the system resumes from the last checkpoint without replaying history.",
      ],
    },
    examQuestionId: "q-context-budget-math",
    takeaway:
      "Treat conversation history as ephemeral and bounded; persist durable facts externally; pass structured summaries between agents; and checkpoint before risky operations.",
    tags: ["session isolation", "state management", "context boundaries", "checkpointing"],
  },
];
