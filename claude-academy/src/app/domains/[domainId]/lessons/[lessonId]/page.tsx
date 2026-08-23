import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgenticLoopDiagram } from "@/components/agentic-loop-diagram";
import { MarkCompleteButton } from "@/components/mark-complete";
import { Badge, CodeBlock } from "@/components/ui";
import { getLesson, lessons } from "@/lib/content/lessons";
import { domainMap } from "@/lib/content/domains";

export function generateStaticParams() {
  return lessons.map((l) => ({
    domainId: l.domainId,
    lessonId: l.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainId: string; lessonId: string }>;
}): Promise<Metadata> {
  const { domainId, lessonId } = await params;
  const lesson = getLesson(domainId, lessonId);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ domainId: string; lessonId: string }>;
}) {
  const { domainId, lessonId } = await params;
  const lesson = getLesson(domainId, lessonId);
  if (!lesson || !lessons.some((l) => l.id === lesson.id && l.domainId === domainId)) {
    notFound();
  }
  const domain = domainMap[lesson.domainId];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/domains" className="hover:text-foreground">Domains</Link>
        {" / "}
        <Link href={`/domains/${domain.id}`} className="hover:text-foreground">
          Domain {domain.number}
        </Link>
      </nav>

      <header className="mt-6">
        <Badge tone="accent">Domain {domain.number} · {domain.name}</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{lesson.summary}</p>
      </header>

      <section className="mt-10 rounded-2xl border border-line bg-panel p-6 sm:p-8" aria-labelledby="objectives-h">
        <h2 id="objectives-h" className="text-xs font-bold uppercase tracking-widest text-muted">
          Learning objectives
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
          {lesson.objectives.map((o) => (
            <li key={o} className="flex gap-3">
              <span aria-hidden className="mt-0.5 text-accent">✓</span>
              {o}
            </li>
          ))}
        </ul>
      </section>

      <Section title={lesson.explanation.heading}>
        {lesson.explanation.body.map((p) => (
          <p key={p.slice(0, 32)} className="leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </Section>

      <Section title="Why it matters">
        <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
          {lesson.whyItMatters.map((r) => (
            <li key={r.slice(0, 32)} className="flex gap-3">
              <span aria-hidden className="mt-0.5 text-blue">▸</span>
              {r}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Architecture diagram">
        {lesson.diagram === "agentic-loop" ? (
          <AgenticLoopDiagram />
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-panel p-5 text-sm text-muted">
            Conceptual diagram for this lesson ships with the pattern library —
            see the related patterns on the{" "}
            <Link href="/patterns" className="text-accent hover:underline">
              patterns page
            </Link>
            .
          </p>
        )}
      </Section>

      <Section title={`Simple example — ${lesson.simpleExample.title}`}>
        <p className="leading-relaxed text-muted">{lesson.simpleExample.body}</p>
        {lesson.simpleExample.code && (
          <CodeBlock {...lesson.simpleExample.code} />
        )}
      </Section>

      <section className="mt-12 rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 className="text-lg font-bold">
          Production example — {lesson.productionExample.title}
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          {lesson.productionExample.body}
        </p>
      </section>

      <section className="mt-12 rounded-2xl border border-red-500/40 bg-red-500/5 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-red-500 dark:text-red-400">
          Anti-pattern: {lesson.antiPattern.name}
        </h2>
        <dl className="mt-4 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[11px] text-muted">What people do</dt>
            <dd className="mt-1 text-muted">{lesson.antiPattern.wrong}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[11px] text-muted">Why it hurts</dt>
            <dd className="mt-1 text-muted">{lesson.antiPattern.consequence}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-[11px] text-emerald-500">Do this instead</dt>
            <dd className="mt-1 text-muted">{lesson.antiPattern.fix}</dd>
          </div>
        </dl>
      </section>

      <Section title="Trade-offs">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-panel-2 text-xs uppercase tracking-widest text-muted">
                <th className="px-4 py-3 font-semibold">Architectural choice</th>
                <th className="px-4 py-3 font-semibold">Gain</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {lesson.tradeOffs.map((t) => (
                <tr key={t.choice} className="border-b border-line last:border-0 align-top">
                  <td className="px-4 py-3 font-medium">{t.choice}</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{t.gain}</td>
                  <td className="px-4 py-3 text-muted">{t.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Hands-on exercise — ${lesson.handsOn.title}`}>
        <ol className="space-y-3 text-sm leading-relaxed text-muted">
          {lesson.handsOn.steps.map((s, i) => (
            <li key={s.slice(0, 32)} className="flex gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-panel-2 font-mono text-xs font-bold">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        {lesson.handsOn.linkedLabId && (
          <Link
            href={`/labs/${lesson.handsOn.linkedLabId}`}
            className="mt-5 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue to the linked lab →
          </Link>
        )}
      </Section>

      <section className="mt-12 rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-accent">
          Exam-style question
        </h2>
        <p className="mt-3 text-sm italic text-muted">
          Practice question — not an official Anthropic exam question.
        </p>
        <p className="mt-4 rounded-lg border border-line bg-panel p-4 text-sm font-medium">
          {lesson.examQuestionId.replace(/-/g, " ")} — find it in the{" "}
          <Link href="/practice" className="text-accent hover:underline">
            practice engine
          </Link>{" "}
          and answer before revealing.
        </p>
      </section>

      <section className="mt-12 rounded-2xl border-l-4 border-blue bg-blue/10 p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue">
          Architect’s takeaway
        </h2>
        <p className="mt-3 text-lg font-medium leading-relaxed">
          {lesson.takeaway}
        </p>
      </section>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {lesson.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <MarkCompleteButton storageKey={`${lesson.domainId}/${lesson.id}`} />
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
