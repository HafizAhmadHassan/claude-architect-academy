import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { PatternDiagram } from "@/components/pattern-diagram";
import { PatternBookmark } from "@/components/pattern-bookmark";
import { patterns } from "@/lib/content/patterns";
import { domainMap } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "Architecture patterns",
  description:
    "A searchable library of Claude agent architecture patterns with diagrams, trade-offs, and reliability considerations.",
};

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Patterns"
        title="Architecture patterns library"
        intro="Thirteen named patterns with diagrams, applicability guidance, and reliability notes. Exam questions rarely name patterns directly — they describe situations where choosing the right one is the answer."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-line bg-panel p-5 text-sm text-muted">
          <strong className="text-foreground">How to study these:</strong> for
          each pattern, internalize the{" "}
          <em>when-NOT-to-use</em> list — exam distractors are almost always
          correct patterns applied in the wrong situation.
        </div>

        <div className="mt-8 space-y-3">
          {patterns.map((p, i) => (
            <details
              key={p.id}
              id={p.id}
              className="group rounded-2xl border border-line bg-panel open:border-accent/40"
            >
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold group-open:text-accent">
                  {p.name}
                </span>
                <ComplexityBadge level={p.complexity} />
                <span className="ml-auto text-xs text-muted">
                  D{p.domainIds.map((d) => domainMap[d].number).join(" · ")}
                </span>
                <PatternBookmark patternId={p.id} name={p.name} />
              </summary>

              <div className="border-t border-line p-5 sm:p-6">
                <p className="leading-relaxed text-muted">{p.summary}</p>

                <div className="mt-5">
                  <PatternDiagram nodes={p.diagram.nodes} edges={p.diagram.edges} />
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <UseList title="Use when" items={p.whenToUse} tone="good" />
                  <UseList title="Do NOT use when" items={p.whenNotToUse} tone="bad" />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <UseList title="Benefits" items={p.benefits} tone="good" />
                  <UseList title="Drawbacks" items={p.drawbacks} tone="bad" />
                </div>

                <div className="mt-5 rounded-xl border border-blue/30 bg-blue/10 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue">
                    Reliability considerations
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed">{p.reliability}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.domainIds.map((d) => {
                    const dom = domainMap[d];
                    return (
                      <Link
                        key={d}
                        href={`/domains/${dom.id}`}
                        className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted hover:border-accent/50 hover:text-accent"
                      >
                        Domain {dom.number} lessons →
                      </Link>
                    );
                  })}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function ComplexityBadge({ level }: { level: "low" | "medium" | "high" }) {
  const cls =
    level === "low"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : level === "medium"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-red-500/10 text-red-600 dark:text-red-400";
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {level} complexity
    </span>
  );
}

function UseList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  return (
    <div>
      <h4
        className={`text-xs font-bold uppercase tracking-widest ${
          tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
        }`}
      >
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item.slice(0, 32)} className="flex gap-2">
            <span aria-hidden>{tone === "good" ? "✓" : "✗"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
