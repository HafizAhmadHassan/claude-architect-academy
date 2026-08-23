import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Capstone projects for Claude architects: production-grade agent systems, MCP integrations, and reliability tooling.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Portfolio projects"
        intro="Bigger than labs: multi-week builds that become portfolio pieces proving you can architect, not just answer."
      />
      <ComingSoon
        title="Planned builds"
        planned={[
          "Production enterprise support agent",
          "Multi-agent research pipeline",
          "MCP gateway with permission broker",
          "Evaluation harness for structured output",
          "Observability dashboard for long-running agents",
        ]}
      />
    </>
  );
}
