import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { labs } from "@/lib/content/labs/labs";
import { domainMap } from "@/lib/content/domains";

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
            Six labs take you from a first MCP server to a production-grade
            enterprise support agent. Every lab ships with objective,
            prerequisites, architecture notes, starter code, expected output, and
            a validation checklist. Build first, read second.
          </>
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ol className="grid gap-4 md:grid-cols-2">
          {labs.map((lab, i) => (
            <li key={lab.id}>
              <Link
                href={`/labs/${lab.id}`}
                className="group block h-full rounded-2xl border border-accent/40 bg-panel p-6 transition-colors hover:border-accent"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Lab {i + 1}
                  </span>
                  <span className="text-xs text-muted">
                    ~{lab.estimatedMinutes} min
                  </span>
                  {i === labs.length - 1 && (
                    <span className="rounded bg-blue/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue">
                      Capstone
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold group-hover:text-accent">
                  {lab.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {lab.objective}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {lab.domainIds.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-muted"
                    >
                      D{domainMap[d].number} · {domainMap[d].name}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-10 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
          Recommended order: MCP server → tool-use loop → structured outputs →
          Claude Code workflow → multi-agent research → capstone. Each
          lab&rsquo;s validation checklist tells you when it is genuinely done.
        </p>
      </section>
    </>
  );
}
