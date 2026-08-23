import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { certification } from "@/lib/content/certification";
import { domainMap } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "Certification overview",
  description:
    "Exam facts for the Anthropic Claude Certified Architect – Foundations (CCA-F) certification, sourced from official Anthropic pages. Independent Claude Certified Architect preparation resource.",
};

export default function CertificationPage() {
  const e = certification.exam;
  return (
    <>
      <PageHeader
        eyebrow="Certification"
        title={certification.name}
        intro={
          <>
            Validates that practitioners can make informed decisions about
            trade-offs when implementing real-world solutions with Claude,
            across Claude Code, the Agent SDK, the Claude API, and MCP.
          </>
        }
      >
        <p className="mt-6 max-w-2xl rounded-xl border-l-4 border-accent bg-accent-soft p-4 text-sm leading-relaxed">
          {certification.verifyNotice} Facts below were verified{" "}
          {certification.lastVerified} from official Anthropic sources listed at
          the bottom of this page.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold">Exam facts</h2>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          <Fact label="Duration" value={`${e.durationMinutes} minutes`} />
          <Fact label="Number of items" value={`${e.itemCount}`} />
          <Fact label="Item format" value={e.itemFormat} />
          <Fact
            label="Passing score"
            value={`${e.passingScore.scaled} scaled (range ${e.passingScore.scaleMin}–${e.passingScore.scaleMax})`}
          />
          <Fact label="Delivery" value={e.delivery} />
          <Fact label="Results" value={e.resultsReporting} />
          <Fact label="Fee" value={`$${e.feeUsd} USD`} />
          <Fact
            label="Validity"
            value={`${e.validityMonths} months from award · ${e.renewal}`}
          />
          <Fact label="Question style" value={e.scenarioFormat} />
        </dl>

        <h2 className="mt-16 text-xl font-bold">Domain weights</h2>
        <ul className="mt-6 space-y-4">
          {certification.domainWeights.map((w) => {
            const d = domainMap[w.domainId];
            return (
              <li key={w.domainId}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">
                    <span className="mr-2 font-mono text-muted">{d.number}.</span>
                    {d.name}
                  </span>
                  <span className="font-mono text-muted">{w.weight}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel-2">
                  <div
                    className={`h-full rounded-full ${d.barClass}`}
                    style={{ width: `${w.weight * 3}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <h2 className="mt-16 text-xl font-bold">Official sources</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          For current certification facts, prefer these official Anthropic
          resources. Community material — including this site — is supplemental.
        </p>
        <ul className="mt-5 space-y-3">
          {certification.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-3 text-sm transition-colors hover:border-accent/50"
              >
                <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  Official
                </span>
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-12 rounded-xl border border-line bg-panel p-5 text-xs leading-relaxed text-muted">
          {certification.positioning} This platform does not reproduce official
          exam questions and makes no claim of access to confidential Anthropic
          exam material.
        </p>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel p-5">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}
