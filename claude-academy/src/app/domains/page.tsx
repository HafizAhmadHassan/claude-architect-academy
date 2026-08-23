import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { certification } from "@/lib/content/certification";
import { domains } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "The five exam domains",
  description:
    "All five Claude Certified Architect – Foundations domains with official weights: agentic architecture, MCP integration, Claude Code workflows, prompt engineering, and context reliability.",
};

export default function DomainsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Domains"
        title="Five domains, one architectural mindset"
        intro={
          <>
            The CCA-F blueprint measures five content domains. Weights below are
            official ({certification.verifyNotice.toLowerCase()})
          </>
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <Link
              key={d.id}
              href={`/domains/${d.id}`}
              className="group flex flex-col rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/50"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-widest ${d.accentClass}`}>
                  Domain {d.number}
                </span>
                <span className="font-mono text-sm text-muted">{d.weight}%</span>
              </div>
              <h2 className="mt-3 font-semibold leading-snug group-hover:text-accent">
                {d.name}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {d.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.topics.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">
                  +{d.topics.length - 4} more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
