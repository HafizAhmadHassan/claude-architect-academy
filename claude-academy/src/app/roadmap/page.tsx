import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { roadmapWeeks } from "@/lib/content/roadmap";
import { certification } from "@/lib/content/certification";

export const metadata: Metadata = {
  title: "10-week study roadmap",
  description:
    "A structured ten-week study plan for the Claude Certified Architect – Foundations exam covering all five domains with hands-on milestones.",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="Your 10-week path to CCA-F readiness"
        intro={
          <>
            One focus per week, one shipped artifact per week. Weights follow
            the official blueprint, so time allocation tracks what the exam
            actually measures.
          </>
        }
      >
        <p className="mt-6 text-sm text-muted">
          {certification.verifyNotice}
        </p>
      </PageHeader>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ol className="relative space-y-4 border-l border-line pl-6">
          {roadmapWeeks.map((w) => (
            <li key={w.week} className="relative">
              <span
                aria-hidden
                className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-background"
              />
              <article className="rounded-xl border border-line bg-panel p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                    Week {w.week}
                  </span>
                  <h2 className="font-semibold">{w.theme}</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <strong className="text-foreground">Milestone:</strong>{" "}
                  {w.outcome}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-line bg-panel p-8 text-center">
          <h2 className="font-semibold">Personalize this plan</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            The study planner (choose 4–12 weeks, hours per week, and a target
            exam date) arrives in phase 2. Until then, compress or extend each
            weekly block proportionally.
          </p>
          <Link
            href="/domains"
            className="mt-6 inline-block rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Browse domains
          </Link>
        </div>
      </section>
    </>
  );
}
