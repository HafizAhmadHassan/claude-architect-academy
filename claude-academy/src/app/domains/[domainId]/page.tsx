import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, PageHeader } from "@/components/ui";
import { domains } from "@/lib/content/domains";
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

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  if (!DOMAIN_IDS.includes(domainId as DomainId)) notFound();
  const domain = domains.find((d) => d.id === domainId)!;

  return (
    <>
      <PageHeader
        eyebrow={`Domain ${domain.number} · ${domain.weight}% of the exam`}
        title={domain.name}
        intro={domain.tagline}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-lg font-bold">Topics</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {domain.topics.map((t) => (
              <li key={t}>
                <Badge>{t}</Badge>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-lg font-bold">Lessons</h2>
          {domain.lessons.length === 0 ? (
            <p className="mt-3 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
              Lessons for this domain are being generated in phase 2 of the
              content pipeline.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {domain.lessons.map((lessonId) => (
                <li key={lessonId}>
                  <Link
                    href={`/domains/${domain.id}/lessons/${lessonId}`}
                    className="block rounded-xl border border-line bg-panel p-5 transition-colors hover:border-accent/50"
                  >
                    <span className="text-xs uppercase tracking-widest text-accent">
                      Lesson
                    </span>
                    <p className="mt-1 font-semibold">
                      {lessonTitle(lessonId)}
                    </p>
                  </Link>
                </li>
              ))}
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
        </div>

        <aside className="space-y-4 self-start rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">
            Domain at a glance
          </h2>
          <div>
            <p className="text-xs text-muted">Exam weight</p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel-2">
              <div
                className={`h-full rounded-full ${domain.barClass}`}
                style={{ width: `${domain.weight * 3}%` }}
              />
            </div>
            <p className="mt-1 text-right font-mono text-sm">{domain.weight}%</p>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted">Topics</dt>
              <dd>{domain.topics.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Live lessons</dt>
              <dd>{domain.lessons.length}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}

function lessonTitle(id: string) {
  return id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
