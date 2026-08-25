import type { DomainId } from "@/lib/content/types";
import { lessons } from "@/lib/content/lessons";
import { patterns } from "@/lib/content/patterns";
import { projects } from "@/lib/content/projects";
import { practiceQuestions } from "@/lib/content/questions/practice-questions";
import { moreQuestions } from "@/lib/content/questions/more-questions";
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

  const allQ = [...practiceQuestions, ...moreQuestions];
  for (const question of allQ) {
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

  return results.slice(0, 25);
}
