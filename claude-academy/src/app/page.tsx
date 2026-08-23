import Link from "next/link";
import { Badge } from "@/components/ui";
import { certification, siteMetadata } from "@/lib/content/certification";
import { domains } from "@/lib/content/domains";
import { learningLoop } from "@/lib/content/roadmap";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Badge tone="accent">Independent preparation resource</Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Become a{" "}
            <span className="text-accent">Claude Architect</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Learn the architecture patterns, agentic systems, MCP integrations,
            Claude Code workflows, prompt engineering, and reliability practices
            needed to build production-grade Claude applications.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/roadmap"
              className="rounded-xl bg-accent-strong px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start the Roadmap
            </Link>
            <Link
              href="/diagnostic"
              className="rounded-xl border border-line bg-panel px-7 py-3.5 font-semibold transition-colors hover:bg-panel-2"
            >
              Take Diagnostic Test
            </Link>
          </div>
          <p className="mt-8 max-w-xl text-xs leading-relaxed text-muted">
            {certification.positioning} Anthropic is the certification issuer.{" "}
            {certification.verifyNotice}
          </p>
        </div>
      </section>

      <section aria-label="Exam at a glance" className="border-b border-line bg-panel">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            [`${certification.exam.durationMinutes} min`, "Exam duration"],
            [`${certification.exam.itemCount}`, "Scored items"],
            [
              `${certification.exam.passingScore.scaled}`,
              `Passing score (scale ${certification.exam.passingScore.scaleMin}–${certification.exam.passingScore.scaleMax})`,
            ],
            [`$${certification.exam.feeUsd}`, "Exam fee (USD)"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-2">
              <dt className="order-2 mt-1 block text-sm text-muted">{label}</dt>
              <dd className="text-3xl font-bold tracking-tight">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto max-w-6xl px-4 pb-6 text-xs text-muted sm:px-6">
          Source: official Anthropic exam guide, verified {certification.lastVerified}.
        </p>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Master all five exam domains
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <Link
                key={d.id}
                href={`/domains/${d.id}`}
                className="group rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/50"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-widest ${d.accentClass}`}>
                    Domain {d.number}
                  </span>
                  <span className="font-mono text-sm text-muted">{d.weight}%</span>
                </div>
                <h3 className="mt-3 font-semibold leading-snug group-hover:text-accent">
                  {d.name}
                </h3>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-panel-2">
                  <div
                    className={`h-full rounded-full ${d.barClass}`}
                    style={{ width: `${(d.weight / 27) * 100}%` }}
                  />
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
                  {d.tagline}
                </p>
              </Link>
            ))}
            <Link
              href="/certification"
              className="flex flex-col justify-between rounded-2xl border border-accent/40 bg-accent-soft p-6 transition-colors hover:border-accent"
            >
              <p className="text-sm leading-relaxed">
                See the full certification overview, official sources, and how
                scoring works.
              </p>
              <p className="mt-4 font-semibold text-accent">
                Certification details →
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            The learning loop
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Architectural reasoning beats memorization. Every cycle of the
            platform follows one philosophy:
          </p>
          <ol className="mt-10 flex flex-wrap items-stretch gap-3">
            {learningLoop.map((l, i) => (
              <li key={l.step} className="flex min-w-[150px] flex-1 flex-col rounded-xl border border-line bg-background p-4">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 font-bold tracking-wide">{l.step}</span>
                <span className="mt-1 text-xs leading-relaxed text-muted">
                  {l.detail}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/labs/mcp-server",
              title: "Build an MCP server",
              body: "Ship a working Model Context Protocol server with schema-validated tools and structured errors.",
            },
            {
              href: "/scenarios",
              title: "Architecture scenario engine",
              body: "Face realistic production trade-offs and see why every option wins or loses.",
            },
            {
              href: "/practice",
              title: "Practice with explanations",
              body: "30+ original questions across all five domains — every answer fully explained.",
            },
            {
              href: "/mock-exam",
              title: "Timed mock exam",
              body: "60-minute simulation with scaled-score estimate, domain breakdown, and retake recommendations.",
            },
            {
              href: "/flashcards",
              title: "Flashcard drills",
              body: "Flip-rate-repeat recall training across every domain, synced to your progress dashboard.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/50"
            >
              <h3 className="font-semibold group-hover:text-accent">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-panel p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to architect?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            {siteMetadata.name} is free and open. Start where you are weakest.
          </p>
          <Link
            href="/roadmap"
            className="mt-6 inline-block rounded-xl bg-accent-strong px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start the Roadmap
          </Link>
        </div>
      </section>
    </>
  );
}
