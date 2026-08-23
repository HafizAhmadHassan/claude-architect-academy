import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { certification } from "@/lib/content/certification";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Curated official Anthropic resources for Claude certification preparation: Anthropic Academy, Claude docs, MCP resources, and engineering articles.",
};

const official = [
  {
    label: "Official CCA-F certification page",
    url: certification.officialUrls.certificationPage,
    note: "Registration, exam guide, policies — the source of truth.",
  },
  {
    label: "Anthropic Learn / Academy",
    url: certification.officialUrls.learn,
    note: "Free courses on Claude fundamentals, tool use, and agents.",
  },
  {
    label: "Claude documentation",
    url: "https://docs.anthropic.com/en/docs/intro",
    note: "API reference, tool use guides, prompt engineering, Agent SDK.",
  },
  {
    label: "Claude Code documentation",
    url: "https://docs.anthropic.com/en/docs/claude-code/overview",
    note: "CLAUDE.md, hooks, permissions, plan mode, CI automation.",
  },
  {
    label: "Model Context Protocol",
    url: "https://modelcontextprotocol.io/",
    note: "Protocol spec, SDKs, server examples, inspector tooling.",
  },
  {
    label: "Anthropic Engineering blog",
    url: "https://www.anthropic.com/engineering",
    note: "Building effective agents, context engineering, multi-agent research.",
  },
];

const community = [
  {
    label: "MCP servers gallery (community)",
    url: "https://github.com/modelcontextprotocol/servers",
    note: "Reference implementations to study alongside this site's lab.",
  },
  {
    label: "Anthropic cookbook (community mirror of examples)",
    url: "https://github.com/anthropics/anthropic-cookbook",
    note: "Runnable notebooks covering tool use, evaluation, and agents.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Curated resource library"
        intro={
          <>
            Official Anthropic sources come first; community material is
            clearly separated and supplemental. {certification.verifyNotice}
          </>
        }
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-accent">
          Official Anthropic resources
        </h2>
        <ul className="mt-5 space-y-3">
          {official.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-line bg-panel p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{r.label}</span>
                  <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Official ↗
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">{r.note}</p>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-sm font-bold uppercase tracking-widest text-muted">
          Community resources
        </h2>
        <ul className="mt-5 space-y-3">
          {community.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-line bg-panel p-5 transition-colors hover:border-muted"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{r.label}</span>
                  <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                    Community ↗
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted">{r.note}</p>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-12 rounded-xl border border-line bg-panel p-5 text-xs leading-relaxed text-muted">
          Third-party resources are never presented as official Anthropic
          material. When certification details change, update the centralized
          metadata in <code className="font-mono">src/lib/content/certification.ts</code>{" "}
          with source attribution.
        </p>
      </section>
    </>
  );
}
