import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { certification } from "@/lib/content/certification";
import { domains } from "@/lib/content/domains";
import { lessonCountByDomain } from "@/lib/content/lessons";

export const metadata: Metadata = {
  title: "The five exam domains",
  description:
    "All five Claude Certified Architect – Foundations domains with official weights: agentic architecture, MCP integration, Claude Code workflows, prompt engineering, and context reliability.",
};

const accentBorders: Record<string, string> = {
  "agentic-architecture": "border-l-violet-500",
  "tool-design-mcp": "border-l-fuchsia-500",
  "claude-code-workflows": "border-l-sky-500",
  "prompt-engineering": "border-l-indigo-500",
  "context-reliability": "border-l-cyan-500",
};

const accentBgs: Record<string, string> = {
  "agentic-architecture": "bg-violet-500/10",
  "tool-design-mcp": "bg-fuchsia-500/10",
  "claude-code-workflows": "bg-sky-500/10",
  "prompt-engineering": "bg-indigo-500/10",
  "context-reliability": "bg-cyan-500/10",
};

export default function DomainsPage() {
  const totalLessons = Object.values(lessonCountByDomain).reduce((a, b) => a + b, 0);
  const totalTopics = domains.reduce((a, d) => a + d.topics.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Domains"
        title="Five domains, one architectural mindset"
        intro={
          <>
            The CCA-F blueprint measures five content domains. Weights below are
            official ({certification.verifyNotice.toLowerCase()}).{" "}
            <span className="text-foreground font-medium">
              {totalLessons} lessons across {totalTopics} topics.
            </span>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {domains.map((d) => (
            <div
              key={d.id}
              className={`rounded-xl border border-line ${accentBgs[d.id]} px-4 py-3 text-center`}
            >
              <p className={`text-2xl font-bold ${d.accentClass}`}>{d.weight}%</p>
              <p className="mt-0.5 text-xs text-muted">
                {lessonCountByDomain[d.id] ?? 0} lessons
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="space-y-4">
          {domains.map((d) => {
            const lessonCount = lessonCountByDomain[d.id] ?? 0;
            return (
              <Link
                key={d.id}
                href={`/domains/${d.id}`}
                className={`group block rounded-2xl border border-line border-l-4 ${accentBorders[d.id]} bg-panel p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 sm:p-8`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${accentBgs[d.id]} ${d.accentClass}`}
                      >
                        {d.number}
                      </span>
                      <div>
                        <h2 className="font-semibold leading-snug group-hover:text-accent sm:text-lg">
                          {d.name}
                        </h2>
                        <p className="text-xs text-muted">
                          {lessonCount} lesson{lessonCount !== 1 ? "s" : ""} · {d.topics.length} topics
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                      {d.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {d.topics.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 text-[11px] text-muted transition-colors group-hover:border-accent/30"
                        >
                          {t}
                        </span>
                      ))}
                      {d.topics.length > 6 && (
                        <span className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 text-[11px] text-muted">
                          +{d.topics.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:min-w-[100px]">
                    <span className="font-mono text-2xl font-bold text-foreground">
                      {d.weight}%
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-panel-2">
                      <div
                        className={`h-full rounded-full ${d.barClass}`}
                        style={{ width: `${d.weight * 3.3}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">exam weight</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
