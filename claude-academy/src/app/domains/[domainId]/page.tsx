import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, PageHeader } from "@/components/ui";
import { domains, domainMap } from "@/lib/content/domains";
import { getLessonsForDomain } from "@/lib/content/lessons";
import { DOMAIN_IDS, type DomainId } from "@/lib/content/types";

export function generateStaticParams() {
  return domains.map((d) => ({ domainId: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainId: string }>;
}): Promise<Metadata> {
  const { domainId } = await params;
  const domain = domains.find((d) => d.id === domainId);
  if (!domain) return {};
  return {
    title: `Domain ${domain.number}: ${domain.name}`,
    description: domain.tagline,
  };
}

function estimateReadingMinutes(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

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

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  if (!DOMAIN_IDS.includes(domainId as DomainId)) notFound();
  const domain = domains.find((d) => d.id === domainId)!;
  const domainLessons = getLessonsForDomain(domain.id);

  const nextDomainIdx = domains.findIndex((d) => d.id === domain.id) + 1;
  const nextDomain = nextDomainIdx < domains.length ? domains[nextDomainIdx] : null;
  const prevDomainIdx = domains.findIndex((d) => d.id === domain.id) - 1;
  const prevDomain = prevDomainIdx >= 0 ? domains[prevDomainIdx] : null;

  return (
    <>
      <PageHeader
        eyebrow={`Domain ${domain.number} · ${domain.weight}% of the exam`}
        title={domain.name}
        intro={domain.tagline}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-lg font-bold">Topics covered</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {domain.topics.map((t) => (
              <li key={t}>
                <Badge>{t}</Badge>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-lg font-bold">
            Lessons
            <span className="ml-2 text-sm font-normal text-muted">
              ({domainLessons.length})
            </span>
          </h2>
          {domainLessons.length === 0 ? (
            <p className="mt-3 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
              Lessons for this domain are being generated in phase 2 of the
              content pipeline.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {domainLessons.map((lesson, idx) => {
                const readMin = estimateReadingMinutes(
                  lesson.explanation.body.join(" ") + lesson.takeaway
                );
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/domains/${domain.id}/lessons/${lesson.id}`}
                      className={`group block rounded-xl border border-l-4 ${accentBorders[domain.id]} bg-panel p-5 transition-all hover:border-accent/50 hover:shadow-md hover:shadow-accent/5`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-accent">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-accent">
                              Lesson
                            </span>
                          </div>
                          <p className="mt-1.5 font-semibold group-hover:text-accent">
                            {lesson.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted">
                            {lesson.summary}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {lesson.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 pt-1">
                          <span className="rounded-full bg-panel-2 px-2.5 py-0.5 text-[11px] font-medium text-muted">
                            ~{readMin} min
                          </span>
                          <svg
                            className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="mt-12 text-lg font-bold">Practice this domain</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Practice questions →
            </Link>
            <Link
              href="/scenarios"
              className="rounded-xl border border-line px-5 py-3 text-sm font-semibold hover:bg-panel-2"
            >
              Architecture scenarios →
            </Link>
            {domain.id === "tool-design-mcp" && (
              <Link
                href="/labs/mcp-server"
                className="rounded-xl border border-line px-5 py-3 text-sm font-semibold hover:bg-panel-2"
              >
                MCP server lab →
              </Link>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
            {prevDomain ? (
              <Link
                href={`/domains/${prevDomain.id}`}
                className="group flex items-center gap-2 text-sm text-muted hover:text-foreground"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <span className="text-xs text-muted">Previous</span>
                  <p className="font-medium">{prevDomain.name}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextDomain ? (
              <Link
                href={`/domains/${nextDomain.id}`}
                className="group flex items-center gap-2 text-right text-sm text-muted hover:text-foreground"
              >
                <div>
                  <span className="text-xs text-muted">Next</span>
                  <p className="font-medium">{nextDomain.name}</p>
                </div>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <aside className="space-y-6 self-start rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">
            Domain at a glance
          </h2>

          <div>
            <div className="flex items-end justify-between">
              <p className="text-xs text-muted">Exam weight</p>
              <p className="font-mono text-lg font-bold">{domain.weight}%</p>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-panel-2">
              <div
                className={`h-full rounded-full ${domain.barClass}`}
                style={{ width: `${domain.weight * 3.3}%` }}
              />
            </div>
          </div>

          <dl className="space-y-4 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted">Topics</dt>
              <dd className="font-mono font-medium">{domain.topics.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted">Lessons</dt>
              <dd className="font-mono font-medium">{domainLessons.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted">Est. study time</dt>
              <dd className="font-mono font-medium">
                ~{domainLessons.length * 12} min
              </dd>
            </div>
          </dl>

          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Key topics
            </p>
            <ul className="mt-3 space-y-1.5">
              {domain.topics.slice(0, 5).map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <span className={`h-1.5 w-1.5 rounded-full ${domain.barClass}`} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-4">
            <Link
              href="/roadmap"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:bg-panel-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Study roadmap
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
