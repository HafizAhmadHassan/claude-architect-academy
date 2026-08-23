import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { projects } from "@/lib/content/projects";
import { domainMap } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Capstone projects for Claude architects: production-grade agent systems, MCP integrations, and reliability tooling.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Portfolio projects"
        intro="Bigger than labs: multi-week builds that become portfolio pieces proving you can architect, not just answer. Each ships with a rubric — if you can check every box, the project is done."
      />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="space-y-6">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className="rounded-2xl border border-line bg-panel p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  Project {i + 1}
                </span>
                <span className="text-xs text-muted">
                  ~{p.durationWeeks} week{p.durationWeeks > 1 ? "s" : ""}
                </span>
                <span className="text-xs text-muted">
                  · D{p.domainIds.map((d) => domainMap[d].number).join(" · ")}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold">{p.title}</h2>
              <p className="mt-0.5 text-sm italic text-accent">{p.tagline}</p>
              <p className="mt-4 leading-relaxed text-muted">{p.description}</p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ProjectList title="Skills proven" items={p.skillsProven} />
                <ProjectList title="Deliverables" items={p.deliverables} />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
                    Done means
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                    {p.rubric.map((r) => (
                      <li key={r.slice(0, 32)} className="flex gap-2">
                        <span aria-hidden className="mt-0.5 text-emerald-500">
                          ☑
                        </span>
                        <span className="text-muted">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {p.startFromLabId && (
                <Link
                  href={`/labs/${p.startFromLabId}`}
                  className="mt-6 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Start from the matching lab →
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProjectList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item.slice(0, 32)} className="flex gap-2">
            <span aria-hidden className="mt-0.5 text-accent">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
