import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgenticLoopDiagram } from "@/components/agentic-loop-diagram";
import { Badge, CodeBlock } from "@/components/ui";
import { agenticLoopLesson } from "@/lib/content/lessons/agentic-loop";
import type { Lesson } from "@/lib/content/types";

export function generateStaticParams() {
  return [
    {
      domainId: agenticLoopLesson.domainId,
      lessonId: agenticLoopLesson.id,
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainId: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  if (lessonId !== agenticLoopLesson.id) return {};
  return {
    title: agenticLoopLesson.title,
    description: agenticLoopLesson.summary,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ domainId: string; lessonId: string }>;
}) {
  const { domainId, lessonId } = await params;
  if (lessonId !== agenticLoopLesson.id || domainId !== agenticLoopLesson.domainId) {
    notFound();
  }
  const lesson = agenticLoopLesson satisfies Lesson;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/domains" className="hover:text-foreground">Domains</Link>
        {" / "}
        <Link href={`/domains/${lesson.domainId}`} className="hover:text-foreground">
          Domain 1
        </Link>
      </nav>

      <header className="mt-6">
        <Badge tone="accent">Domain 1 · Agentic Architecture</Badge>
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
        {lesson.diagram === "agentic-loop" && <AgenticLoopDiagram />}
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
            Continue to the MCP lab →
          </Link>
        )}
      </Section>

      <section className="mt-12 rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-accent">
          Exam-style question
        </h2>
        <ExamQuestionPreview questionId={lesson.examQuestionId} />
      </section>

      <section className="mt-12 rounded-2xl border-l-4 border-blue bg-blue/10 p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue">
          Architect’s takeaway
        </h2>
        <p className="mt-3 text-lg font-medium leading-relaxed">
          {lesson.takeaway}
        </p>
      </section>

      <footer className="mt-8 flex flex-wrap items-center gap-2 pb-8">
        {lesson.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
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

function ExamQuestionPreview({ questionId }: { questionId: string }) {
  const isAgentic = questionId === "q-agentic-loop-stop";
  return (
    <>
      <p className="mt-3 text-sm italic text-muted">
        Practice question — not an official Anthropic exam question.
      </p>
      <details className="group mt-4">
        <summary className="cursor-pointer list-none rounded-lg border border-line bg-panel p-4 text-sm font-medium marker:hidden hover:border-accent/50">
          In an agentic loop, which event most directly causes normal loop
          termination?{" "}
          <span className="ml-1 text-xs font-normal text-accent">
            Reveal answer
          </span>
        </summary>
        <div className="mt-3 rounded-lg border border-line bg-background p-4 text-sm leading-relaxed text-muted">
          <strong className="text-emerald-500">
            A — stop_reason returns end_turn because no tool_use block was
            emitted.
          </strong>{" "}
          The API&apos;s structured signal ends the loop naturally; budgets are a
          safety net on top.
        </div>
      </details>
      <p className="sr-only">Linked practice question: {questionId}</p>
      {!isAgentic && null}
    </>
  );
}
