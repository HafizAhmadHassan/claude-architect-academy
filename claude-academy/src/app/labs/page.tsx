import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { labs, plannedLabs } from "@/lib/content/labs/labs";

export const metadata: Metadata = {
  title: "Hands-on labs",
  description:
    "Hands-on Claude architecture labs: build an MCP server, structured API applications, tool-use apps, multi-agent systems, and production workflows.",
};

export default function LabsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Learn by building"
        intro={
          <>
            Every lab ships with objective, prerequisites, architecture, steps,
            starter code, expected output, and a validation checklist. Build
            first, read second.
          </>
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-lg font-bold">Available now</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {labs.map((lab) => (
            <li key={lab.id}>
              <Link
                href={`/labs/${lab.id}`}
                className="group block h-full rounded-2xl border border-accent/40 bg-panel p-6 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Live
                  </span>
                  <span className="text-xs text-muted">
                    ~{lab.estimatedMinutes} min
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold group-hover:text-accent">
                  {lab.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {lab.objective}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-lg font-bold">Coming in phase 2</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plannedLabs.map((lab) => (
            <li
              key={lab.id}
              className="rounded-2xl border border-line bg-panel p-5 text-sm text-muted opacity-70"
            >
              <span aria-hidden className="mr-2">🔒</span>
              {lab.title}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
