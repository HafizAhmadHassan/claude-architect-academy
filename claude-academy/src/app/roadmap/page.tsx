import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { WeeklyTaskList } from "@/components/weekly-task-list";
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
            One focus per week, one shipped artifact per week. Check off tasks as
            you go — your ticks feed the progress dashboard.
          </>
        }
      >
        <p className="mt-6 text-sm text-muted">
          {certification.verifyNotice}
        </p>
      </PageHeader>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <WeeklyTaskList />

        <div className="mt-12 rounded-2xl border border-line bg-panel p-8">
          <h2 className="font-semibold">Week-by-week themes</h2>
          <ol className="mt-5 space-y-3">
            {roadmapWeeks.map((w) => (
              <li key={w.week} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  W{w.week}
                </span>
                <span>
                  <strong>{w.theme}</strong>{" "}
                  <span className="text-muted">— {w.outcome}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link
            href="/diagnostic"
            className="mt-8 inline-block rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Not started? Take the diagnostic first →
          </Link>
        </div>
      </section>
    </>
  );
}
