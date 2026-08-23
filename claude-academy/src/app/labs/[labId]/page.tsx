import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, CodeBlock } from "@/components/ui";
import { labs } from "@/lib/content/labs/labs";

export function generateStaticParams() {
  return labs.map((lab) => ({ labId: lab.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ labId: string }>;
}): Promise<Metadata> {
  const { labId } = await params;
  const lab = labs.find((l) => l.id === labId);
  if (!lab) return {};
  return {
    title: `Lab: ${lab.title}`,
    description: lab.objective,
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId } = await params;
  const lab = labs.find((l) => l.id === labId);
  if (!lab) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/labs" className="hover:text-foreground">Labs</Link>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Live lab</Badge>
          <Badge>~{lab.estimatedMinutes} minutes</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {lab.title}
        </h1>
      </header>

      <section className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-accent">Objective</h2>
        <p className="mt-3 leading-relaxed text-muted">{lab.objective}</p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Prerequisites</h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
            {lab.prerequisites.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue">Architecture</h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
            {lab.architecture.map((a) => (
              <li key={a.slice(0, 32)}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Steps</h2>
        <ol className="mt-6 space-y-10">
          {lab.steps.map((step, i) => (
            <li key={step.title} className="relative pl-14">
              <span
                aria-hidden
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-strong font-mono text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="pt-1.5 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
              {step.code && <CodeBlock {...step.code} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-panel p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500">
          Expected output
        </h2>
        <p className="mt-3 rounded-lg bg-panel-2 p-4 font-mono text-[13px] leading-relaxed">
          {lab.expectedOutput}
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
          Validation checklist
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm">
          {lab.validationChecklist.map((c) => (
            <li key={c.slice(0, 32)} className="flex gap-3">
              <span aria-hidden className="text-accent">☐</span>
              <span className="text-muted">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 mb-8 rounded-2xl border-l-4 border-blue bg-blue/10 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue">
          Extension challenge
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {lab.extensionChallenge}
        </p>
      </section>
    </article>
  );
}
