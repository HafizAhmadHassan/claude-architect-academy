import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ExamEngine } from "@/components/exam-engine";
import { practiceQuestions } from "@/lib/content/questions/practice-questions";

const DIAGNOSTIC_IDS = [
  // D1 — agentic architecture
  "q-agentic-loop-stop",
  "q-orphaned-results",
  "q-monolith-agent-refactor",
  "q-subagent-context-passing",
  // D2 — tool design & MCP
  "q-tool-description-quality",
  "q-mcp-client-server",
  "q-empty-vs-error",
  "q-mcp-resource-vs-tool",
  // D3 — Claude Code workflows
  "q-claude-md-purpose",
  "q-plan-mode-choice",
  "q-hook-posttooluse",
  // D4 — prompt engineering
  "q-fewshot-extraction",
  "q-schema-fabrication",
  // D5 — context & reliability
  "q-long-session-degradation",
  "q-tagged-sections-provenance",
];

export const metadata: Metadata = {
  title: "Diagnostic test",
  description:
    "15-question weighted diagnostic to locate your weak domains before you start studying.",
};

export default function DiagnosticPage() {
  const picked = DIAGNOSTIC_IDS.map(
    (id) => practiceQuestions.find((q) => q.id === id)!
  ).filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Diagnostic"
        title="Find your starting point"
        intro="A short weighted sample across all five domains. Your result recommends which domain to study first."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ExamEngine questions={picked} variant="diagnostic" />
      </section>
    </>
  );
}
