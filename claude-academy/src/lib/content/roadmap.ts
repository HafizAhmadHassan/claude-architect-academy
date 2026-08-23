export const roadmapWeeks = [
  {
    week: 1,
    theme: "Foundations & diagnostic baseline",
    focus: ["All domains"],
    outcome:
      "Take the diagnostic, set your target date, and skim the official exam guide.",
  },
  {
    week: 2,
    theme: "Agentic loop fundamentals",
    focus: ["Agentic Architecture & Orchestration"],
    outcome: "Trace a tool-use loop end-to-end and implement turn budgets.",
  },
  {
    week: 3,
    theme: "Orchestration & subagents",
    focus: ["Agentic Architecture & Orchestration"],
    outcome:
      "Build an orchestrator with two scoped subagents and explicit context handoffs.",
  },
  {
    week: 4,
    theme: "Tool design principles",
    focus: ["Tool Design & MCP Integration"],
    outcome: "Rewrite three tool descriptions against the contract checklist.",
  },
  {
    week: 5,
    theme: "MCP servers & clients",
    focus: ["Tool Design & MCP Integration"],
    outcome: "Ship the MCP server lab and connect it to Claude Code.",
  },
  {
    week: 6,
    theme: "Claude Code configuration",
    focus: ["Claude Code Configuration & Workflows"],
    outcome:
      "Author CLAUDE.md, custom commands, and permission rules for a real repo.",
  },
  {
    week: 7,
    theme: "Hooks, plan mode & CI automation",
    focus: ["Claude Code Configuration & Workflows"],
    outcome: "Automate a review pipeline with hooks and JSON output flags.",
  },
  {
    week: 8,
    theme: "Prompting & structured output",
    focus: ["Prompt Engineering & Structured Output"],
    outcome: "Build a validated extraction pipeline with schema-guided retries.",
  },
  {
    week: 9,
    theme: "Context management & reliability",
    focus: ["Context Management & Reliability"],
    outcome:
      "Add checkpoint summarization and escalation routing to a long-running agent.",
  },
  {
    week: 10,
    theme: "Mock exam & weak-area repair",
    focus: ["All domains"],
    outcome:
      "Sit the mock exam, drill your two weakest domains, and re-review missed scenarios.",
  },
] as const;

export const learningLoop = [
  { step: "LEARN", detail: "Concept-first lessons with diagrams" },
  { step: "BUILD", detail: "Hands-on labs with real code" },
  { step: "TEST", detail: "Original practice questions" },
  { step: "EXPLAIN", detail: "Justify every trade-off out loud" },
  { step: "REVIEW", detail: "Scenario debriefs and anti-patterns" },
  { step: "REPEAT", detail: "Spaced revisits of weak domains" },
] as const;
