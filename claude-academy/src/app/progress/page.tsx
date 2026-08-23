import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon, PageHeader } from "@/components/ui";
import { domains } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "Progress dashboard",
  description:
    "Track your Claude Architect readiness across lessons, labs, practice scores, and domain mastery.",
};

const sampleReadiness: Record<string, number> = {
  "agentic-architecture": 82,
  "tool-design-mcp": 67,
  "claude-code-workflows": 74,
  "prompt-engineering": 88,
  "context-reliability": 61,
};

export default function ProgressPage() {
  const weakest = domains.reduce((a, b) =>
    sampleReadiness[a.id] < sampleReadiness[b.id] ? a : b
  );
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Your Claude Architect Readiness"
        intro={
          <>
            Example dashboard below with sample data — live persistence via
            local storage and accounts arrives in phase 2.
          </>
        }
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ul className="space-y-4">
          {domains.map((d) => (
            <li key={d.id} className="flex items-center gap-4">
              <span className="w-52 shrink-0 truncate text-sm font-medium">
                {d.name}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-2">
                <div
                  className={`h-full rounded-full ${d.barClass}`}
                  style={{ width: `${sampleReadiness[d.id]}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-sm">
                {sampleReadiness[d.id]}%
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-2xl border border-accent/40 bg-accent-soft p-6">
          <h2 className="font-semibold">Recommended next lesson</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your weakest area in this sample is{" "}
            <strong>{weakest.name}</strong>. Start there:
          </p>
          <Link
            href={`/domains/${weakest.id}`}
            className="mt-4 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Open Domain {weakest.number} →
          </Link>
        </div>

        <div className="mt-12">
          <ComingSoon
            title="Planned tracking"
            planned={[
              "Completed lessons & labs",
              "Practice score history",
              "Mock exam scores",
              "Domain mastery estimates",
              "Study streaks",
              "Weak-domain alerts",
            ]}
          />
        </div>
      </section>
    </>
  );
}
