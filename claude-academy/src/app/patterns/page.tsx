import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Architecture patterns",
  description:
    "A searchable library of Claude agent architecture patterns with diagrams, trade-offs, and reliability considerations.",
};

const patterns = [
  "Single agent",
  "Agentic loop",
  "Orchestrator / subagents",
  "Sequential workflow",
  "Parallel agents",
  "Human-in-the-loop",
  "Tool gateway",
  "MCP integration",
  "Validation / retry",
  "Evaluator pattern",
  "Multi-pass review",
  "Context compression",
  "Escalation pattern",
];

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Patterns"
        title="Architecture patterns library"
        intro="Each pattern entry will ship a diagram, when-to-use and when-NOT-to-use guidance, benefits, drawbacks, complexity rating, and reliability considerations."
      />
      <ComingSoon
        title="Planned pattern entries"
        planned={patterns}
      />
    </>
  );
}
