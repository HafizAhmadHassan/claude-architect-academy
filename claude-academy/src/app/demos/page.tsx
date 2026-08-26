import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { WorkflowPatternsExplorer } from "@/components/workflow-patterns-explorer";
import { ContextWindowVisualizer } from "@/components/context-window-visualizer";
import { McpArchitectureDiagram } from "@/components/mcp-architecture-diagram";
import { DesignDecisionHelper } from "@/components/design-decision-helper";

export const metadata: Metadata = {
  title: "Interactive Demos",
  description:
    "Learn agentic architecture visually: explore Anthropic's workflow patterns, simulate context window pressure, study the MCP architecture, and practice architecture decisions.",
};

const sources = [
  {
    label: "Anthropic Engineering — Building Effective Agents",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
  },
  {
    label: "Model Context Protocol — Architecture specification",
    url: "https://modelcontextprotocol.io/docs/learn/architecture",
  },
  {
    label: "Claude Code Docs — Best practices",
    url: "https://code.claude.com/docs/en/best-practices",
  },
];

export default function DemosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Visual learning"
        title="Interactive demos & visualizations"
        intro="Study the exam domains by interacting with them: step through workflow patterns, watch a context window fill up and compact it, trace MCP message flows, and rehearse architecture decisions."
      />

      <section className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
        <div>
          <DemoHeading
            index="01"
            title="The six agentic patterns"
            domainLink={{ href: "/domains/agentic-architecture", label: "Domain 1" }}
            blurb="Anthropic's canonical taxonomy from Building Effective Agents: five composable workflows plus the autonomous agent. Every exam scenario about orchestration maps onto one of these shapes."
          />
          <WorkflowPatternsExplorer />
        </div>

        <div>
          <DemoHeading
            index="02"
            title="Context window pressure & compaction"
            domainLink={{ href: "/domains/context-reliability", label: "Domain 5" }}
            blurb="Long sessions degrade as tool results and history pile up. Push the sliders past healthy utilization, then apply checkpoint compaction — the summarize-and-resume move production systems rely on."
          />
          <ContextWindowVisualizer />
        </div>

        <div>
          <DemoHeading
            index="03"
            title="MCP host–client–server architecture"
            domainLink={{ href: "/domains/tool-design-mcp", label: "Domain 2" }}
            blurb="One client per server, JSON-RPC over stdio or Streamable HTTP, capability negotiation at init, and the three server primitives — tools, resources, prompts. Clients expose elicitation and sampling in return."
          />
          <McpArchitectureDiagram />
        </div>

        <div>
          <DemoHeading
            index="04"
            title="Architecture decision rehearsal"
            domainLink={{ href: "/patterns", label: "Pattern library" }}
            blurb="Exam items love the boundary between 'add a workflow' and 'build an agent'. Rehearse the decision flow until the least-complex-sufficient-system instinct is automatic."
          />
          <DesignDecisionHelper />
        </div>

        <aside className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Primary sources</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            These visualizations are original educational material grounded in public documentation.
            Always verify current exam details against{" "}
            <Link href="/certification" className="text-accent hover:underline">
              the official certification page
            </Link>
            .
          </p>
        </aside>
      </section>
    </>
  );
}

function DemoHeading({
  index,
  title,
  blurb,
  domainLink,
}: {
  index: string;
  title: string;
  blurb: string;
  domainLink: { href: string; label: string };
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <p className="font-mono text-xs text-accent">{index}</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{blurb}</p>
      </div>
      <Link
        href={domainLink.href}
        className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        {domainLink.label} →
      </Link>
    </div>
  );
}
