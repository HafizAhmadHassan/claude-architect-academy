import type { DomainId } from "./types";

export interface Domain {
  id: DomainId;
  number: number;
  name: string;
  weight: number;
  tagline: string;
  topics: string[];
  lessons: string[];
  accentClass: string;
  barClass: string;
}

export const domains: Domain[] = [
  {
    id: "agentic-architecture",
    number: 1,
    name: "Agentic Architecture & Orchestration",
    weight: 27,
    tagline:
      "Design agentic loops, orchestrators, subagents, and stateful workflows that finish the job reliably.",
    topics: [
      "agentic loops",
      "orchestration",
      "multi-agent systems",
      "subagents",
      "task decomposition",
      "workflows",
      "handoffs",
      "hooks",
      "sessions",
      "state management",
      "production trade-offs",
    ],
    lessons: ["the-agentic-loop", "orchestrator-subagents", "human-in-the-loop-gates", "state-management-sessions"],
    accentClass: "text-violet-400 dark:text-violet-300",
    barClass: "bg-violet-500",
  },
  {
    id: "tool-design-mcp",
    number: 2,
    name: "Tool Design & MCP Integration",
    weight: 18,
    tagline:
      "Model tools as clean interfaces and connect Claude to external systems safely with MCP.",
    topics: [
      "tool design",
      "tool schemas",
      "tool descriptions",
      "structured errors",
      "tool selection",
      "MCP clients",
      "MCP servers",
      "MCP resources",
      "authentication",
      "permissions",
      "failure handling",
    ],
    lessons: ["tool-design-contracts", "mcp-integration-architecture", "structured-errors-empty-results", "mcp-auth-permissions"],
    accentClass: "text-fuchsia-400 dark:text-fuchsia-300",
    barClass: "bg-fuchsia-500",
  },
  {
    id: "claude-code-workflows",
    number: 3,
    name: "Claude Code Configuration & Workflows",
    weight: 20,
    tagline:
      "Configure projects, permissions, plan mode, hooks, and CI automation so Claude Code works like a teammate.",
    topics: [
      "CLAUDE.md",
      "project instructions",
      "commands",
      "skills",
      "hooks",
      "permissions",
      "plan mode",
      "iterative development",
      "codebase exploration",
      "CI/CD",
      "automation",
    ],
    lessons: ["claudemd-project-memory", "permissions-plan-mode-hooks", "skills-commands-automation", "ci-cd-integration"],
    accentClass: "text-sky-400 dark:text-sky-300",
    barClass: "bg-sky-500",
  },
  {
    id: "prompt-engineering",
    number: 4,
    name: "Prompt Engineering & Structured Output",
    weight: 20,
    tagline:
      "Write explicit instructions and get validated, schema-conforming output you can build on.",
    topics: [
      "system prompts",
      "explicit instructions",
      "few-shot prompting",
      "structured outputs",
      "JSON schemas",
      "tool use",
      "validation",
      "retries",
      "evaluation",
      "multi-pass review",
    ],
    lessons: ["few-shot-structured-output", "validation-retries-evals", "system-prompt-architecture", "multi-pass-review"],
    accentClass: "text-indigo-400 dark:text-indigo-300",
    barClass: "bg-indigo-500",
  },
  {
    id: "context-reliability",
    number: 5,
    name: "Context Management & Reliability",
    weight: 15,
    tagline:
      "Keep long-running agents coherent with context strategy, escalation paths, and observability.",
    topics: [
      "context windows",
      "context degradation",
      "long-running agents",
      "summarization",
      "session management",
      "error propagation",
      "provenance",
      "human review",
      "escalation",
      "reliability",
      "observability",
    ],
    lessons: ["context-degradation-summarization", "reliability-escalation-observability", "context-window-strategies", "monitoring-alerting"],
    accentClass: "text-cyan-400 dark:text-cyan-300",
    barClass: "bg-cyan-500",
  },
];

export const domainMap: Record<DomainId, Domain> = Object.fromEntries(
  domains.map((d) => [d.id, d])
) as Record<DomainId, Domain>;
