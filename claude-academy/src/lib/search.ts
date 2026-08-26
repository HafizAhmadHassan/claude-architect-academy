import type { DomainId } from "@/lib/content/types";
import { lessons } from "@/lib/content/lessons";
import { patterns } from "@/lib/content/patterns";
import { projects } from "@/lib/content/projects";
import { practiceQuestions } from "@/lib/content/questions/practice-questions";
import { labs } from "@/lib/content/labs/labs";
import { labsCoreExtra } from "@/lib/content/labs/labs-core-extra";
import { labsAdvanced } from "@/lib/content/labs/labs-advanced";

export interface SearchResult {
  type: "lesson" | "question" | "pattern" | "lab" | "project" | "resource";
  title: string;
  description: string;
  url: string;
  domain?: DomainId;
  tags?: string[];
}

export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const lesson of lessons) {
    if (
      lesson.title.toLowerCase().includes(q) ||
      lesson.summary.toLowerCase().includes(q) ||
      lesson.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "lesson",
        title: lesson.title,
        description: lesson.summary,
        url: `/domains/${lesson.domainId}/lessons/${lesson.id}`,
        domain: lesson.domainId,
        tags: lesson.tags,
      });
    }
  }

  for (const question of practiceQuestions) {
    if (
      question.question.toLowerCase().includes(q) ||
      question.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "question",
        title: question.question.slice(0, 80) + (question.question.length > 80 ? "…" : ""),
        description: `Practice question · ${question.domainId}`,
        url: "/practice",
        domain: question.domainId,
        tags: question.tags,
      });
    }
  }

  for (const p of patterns) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q)
    ) {
      results.push({
        type: "pattern",
        title: p.name,
        description: p.summary,
        url: `/patterns#${p.id}`,
      });
    }
  }

  const allLabs = [...labs, ...labsCoreExtra, ...labsAdvanced];
  for (const lab of allLabs) {
    if (
      lab.title.toLowerCase().includes(q) ||
      lab.objective.toLowerCase().includes(q)
    ) {
      results.push({
        type: "lab",
        title: lab.title,
        description: lab.objective,
        url: `/labs/${lab.id}`,
        tags: lab.domainIds,
      });
    }
  }

  for (const p of projects) {
    if (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: "project",
        title: p.title,
        description: p.description,
        url: "/projects",
      });
    }
  }

  const demoEntries: SearchResult[] = [
    {
      type: "resource",
      title: "Interactive demos",
      description: "Visual, hands-on walkthroughs of the core exam concepts.",
      url: "/demos",
    },
    {
      type: "resource",
      title: "Workflow patterns explorer",
      description:
        "Animated diagrams of chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, and agents.",
      url: "/demos",
    },
    {
      type: "resource",
      title: "Context window simulator",
      description:
        "Watch a session fill a context window and apply checkpoint compaction.",
      url: "/demos",
    },
    {
      type: "resource",
      title: "MCP architecture diagram",
      description:
        "Host, clients, servers, primitives, and transports per the MCP specification.",
      url: "/demos",
    },
    {
      type: "resource",
      title: "Workflow vs. agent decision helper",
      description:
        "Rehearse choosing the least complex architecture that meets the requirement.",
      url: "/demos",
    },
  ];
  const demoTerms = [
    "demo",
    "demos",
    "visual",
    "workflow",
    "pattern explorer",
    "context window",
    "mcp architecture",
    "decision",
    "orchestrator",
    "compaction",
  ];
  if (demoTerms.some((t) => q.includes(t))) {
    results.push(...demoEntries);
  }

  return results.slice(0, 25);
}
