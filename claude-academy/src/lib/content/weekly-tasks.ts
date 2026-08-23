export interface WeeklyTask {
  id: string;
  week: number;
  title: string;
  detail: string;
  href?: string;
  minutes: number;
}

function t(
  week: number,
  n: number,
  title: string,
  detail: string,
  minutes: number,
  href?: string
): WeeklyTask {
  return { id: `w${week}-t${n}`, week, title, detail, minutes, href };
}

export const weeklyTasks: WeeklyTask[] = [
  t(1, 1, "Take the diagnostic", "15-question baseline across all five domains to find your weakest area.", 20, "/diagnostic"),
  t(1, 2, "Study the certification facts", "Memorize duration, item count, passing score, and delivery format.", 20, "/certification"),
  t(1, 3, "Skim the official exam guide", "Read the domain task statements so you know exactly what is measured.", 30),
  t(1, 4, "Set your exam target date", "Pick a date 8–12 weeks out and book a hold with Pearson VUE.", 10),
  t(1, 5, "First flashcard sweep", "Run every deck once; flag cards you do not know for review.", 25, "/flashcards"),

  t(2, 1, "Lesson: The Agentic Loop", "Complete all sections including the hands-on trace exercise.", 45, "/domains/agentic-architecture/lessons/the-agentic-loop"),
  t(2, 2, "Practice: agentic loop basics", "Answer the beginner questions on loop termination and observations.", 20, "/practice"),
  t(2, 3, "Flashcards: architecture patterns", "Drill the D1 cards until Known without hesitation.", 15, "/flashcards"),
  t(2, 4, "Scenario: support agent approval gate", "Commit to an answer before reading the debrief.", 15, "/scenarios"),
  t(2, 5, "Write the loop from memory", "Reproduce the minimal tool-use loop in your editor without reference.", 40),

  t(3, 1, "Lesson: Orchestrator & subagents", "Learn decomposition, scoped tools, and context passing between agents.", 45, "/domains/agentic-architecture/lessons/orchestrator-subagents"),
  t(3, 2, "Lesson: Human-in-the-loop gates", "Design programmatic approval boundaries for irreversible actions.", 35, "/domains/agentic-architecture/lessons/human-in-the-loop-gates"),
  t(3, 3, "Practice: orchestration set", "Filter practice to Domain 1 intermediate/advanced and clear them all.", 30, "/practice"),
  t(3, 4, "Build a two-subagent prototype", "Orchestrator routes research vs writing to scoped subagents.", 60),
  t(3, 5, "Review missed questions", "Redo every question you answered wrong this week.", 20, "/practice"),

  t(4, 1, "Lesson: Tool design contracts", "Descriptions, schemas, and parameter documentation as behavioral contracts.", 40, "/domains/tool-design-mcp/lessons/tool-design-contracts"),
  t(4, 2, "Rewrite three tool descriptions", "Apply the contract checklist: scope, formats, edge cases, do-not-use.", 30),
  t(4, 3, "Practice: tool design set", "Domain 2 questions until scoring above 80%.", 25, "/practice"),
  t(4, 4, "Flashcards: MCP concepts", "Client vs server roles, transports, resources.", 15, "/flashcards"),
  t(4, 5, "Lesson: Structured errors & empty results", "Error taxonomy: transient vs validation vs permission; empty-as-data.", 35, "/domains/tool-design-mcp/lessons/structured-errors-empty-results"),

  t(5, 1, "Lab: Build your first MCP server", "Complete every step through the inspector smoke test.", 60, "/labs/mcp-server"),
  t(5, 2, "Lab extension challenge", "Add a resource, switch transport, wire approvals.", 45, "/labs/mcp-server"),
  t(5, 3, "Lesson: MCP integration architecture", "Clients, servers, resources, auth, permission scoping.", 35, "/domains/tool-design-mcp/lessons/mcp-integration-architecture"),
  t(5, 4, "Connect Claude Code to your server", "Register the server and verify Claude cites empty-result semantics correctly.", 30),
  t(5, 5, "Lesson: MCP auth & permission scoping", "Per-user OAuth, least privilege at the boundary, approval gates.", 35, "/domains/tool-design-mcp/lessons/mcp-auth-permissions"),

  t(6, 1, "Lesson: CLAUDE.md & project memory", "Curate commands, conventions, and caveats per repository.", 35, "/domains/claude-code-workflows/lessons/claudemd-project-memory"),
  t(6, 2, "Author CLAUDE.md for a real repo", "Commands that work, conventions that matter, gotchas that bite.", 30),
  t(6, 3, "Lesson: Permissions, plan mode & hooks", "Programmatic enforcement beats prompt-based rules.", 45, "/domains/claude-code-workflows/lessons/permissions-plan-mode-hooks"),
  t(6, 4, "Practice: Claude Code set", "Clear all Domain 3 questions.", 25, "/practice"),

  t(7, 1, "Automate a review pipeline", "Slash command + JSON schema output in CI on a sample PR.", 50),
  t(7, 2, "Configure three hooks", "PostToolUse normalization, format-on-save guard, blocked-path deny.", 40),
  t(7, 3, "Scenario run-through", "Re-run both scenarios; explain each option aloud before checking.", 25, "/scenarios"),
  t(7, 4, "Flashcards: full sweep", "All decks; reset any card still marked review-later.", 20, "/flashcards"),

  t(8, 1, "Lesson: Few-shot & structured output", "Examples beat prose for format fidelity.", 40, "/domains/prompt-engineering/lessons/few-shot-structured-output"),
  t(8, 2, "Lesson: Validation, retries & evals", "Schema-guided retries and golden sets that catch regressions.", 40, "/domains/prompt-engineering/lessons/validation-retries-evals"),
  t(8, 3, "Build an extraction pipeline", "Messy emails to validated JSON with retry-on-error loop.", 60),
  t(8, 4, "Practice: prompt engineering set", "Domain 4 until consistent 80%+.", 25, "/practice"),

  t(9, 1, "Lesson: Context degradation & summarization", "Checkpoint summaries, compact resumes, provenance.", 40, "/domains/context-reliability/lessons/context-degradation-summarization"),
  t(9, 2, "Lesson: Reliability, escalation & observability", "Error categories, calibrated routing, tracing long-running agents.", 40, "/domains/context-reliability/lessons/reliability-escalation-observability"),
  t(9, 3, "Add summarization checkpoints", "Extend your week-3 prototype with session state compaction.", 50),
  t(9, 4, "Practice: reliability set", "Domain 5 questions plus redo of earlier misses.", 30, "/practice"),

  t(10, 1, "Mock exam attempt #1", "Full timed sitting. No notes. Treat it like test day.", 65, "/mock-exam"),
  t(10, 2, "Post-mortem weak domains", "Review every miss; write down the principle you forgot.", 40, "/progress"),
  t(10, 3, "Repair drills", "Lessons + flashcards for your two weakest domains.", 60),
  t(10, 4, "Mock exam attempt #2", "Target: clear the pass bar comfortably.", 65, "/mock-exam"),
  t(10, 5, "Final review & logistics", "Re-check system requirements, ID rules, and exam-day policy.", 20, "/resources"),
];

export function tasksForWeek(week: number): WeeklyTask[] {
  return weeklyTasks.filter((task) => task.week === week);
}
