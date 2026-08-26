import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgenticLoopDiagram } from "@/components/agentic-loop-diagram";
import { WorkflowPatternsExplorer } from "@/components/workflow-patterns-explorer";
import { McpArchitectureDiagram } from "@/components/mcp-architecture-diagram";
import { ContextWindowVisualizer } from "@/components/context-window-visualizer";
import type { Lesson } from "@/lib/content/types";
import { MarkCompleteButton } from "@/components/mark-complete";
import { BookmarkButton } from "@/components/bookmark-button";
import { NotesPanel } from "@/components/notes-panel";
import { CommentsSection } from "@/components/comments-section";
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
  const lessonUrl = `/domains/${domain.id}/lessons/${lesson.id}`;

  const domainLessons = lessons.filter((l) => l.domainId === lesson.domainId);
  const currentIdx = domainLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? domainLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < domainLessons.length - 1 ? domainLessons[currentIdx + 1] : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <span className="text-sm text-muted">
          <Link href="/domains" className="hover:text-foreground">Domains</Link>
          {" / "}
          <Link href={`/domains/${domain.id}`} className="hover:text-foreground">
            Domain {domain.number}
          </Link>
        </span>
        <BookmarkButton
          url={lessonUrl}
          title={lesson.title}
          type="lesson"
          domain={domain.name}
        />
      </nav>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <Badge tone="accent">Domain {domain.number} · {domain.name}</Badge>
          <span className="text-xs text-muted">
            Lesson {currentIdx + 1} of {domainLessons.length}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{lesson.summary}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ~{Math.max(3, Math.ceil((lesson.explanation.body.join(" ").split(/\s+/).length + lesson.takeaway.split(/\s+/).length) / 200))} min read
          </span>
          <span>·</span>
          <span>{lesson.objectives.length} objectives</span>
          <span>·</span>
          <span>{lesson.tradeOffs.length} trade-offs</span>
        </div>
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
        {lesson.diagram && lesson.diagram in DIAGRAMS ? (
          (() => {
            const Diagram = DIAGRAMS[lesson.diagram as NonNullable<Lesson["diagram"]>];
            return <Diagram />;
          })()
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
            <dt className="font-semibold uppercase tracking-wide text-[11px] text-muted text-emerald-500">Do this instead</dt>
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
          Architect&apos;s takeaway
        </h2>
        <p className="mt-3 text-lg font-medium leading-relaxed">
          {lesson.takeaway}
        </p>
      </section>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {lesson.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <MarkCompleteButton storageKey={`${lesson.domainId}/${lesson.id}`} />
      </footer>

      <nav className="mt-12 flex items-center justify-between border-t border-line pt-8" aria-label="Lesson navigation">
        {prevLesson ? (
          <Link
            href={`/domains/${domain.id}/lessons/${prevLesson.id}`}
            className="group flex items-center gap-3 text-sm text-muted hover:text-foreground"
          >
            <svg className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <span className="text-xs text-muted">Previous lesson</span>
              <p className="font-medium">{prevLesson.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/domains/${domain.id}/lessons/${nextLesson.id}`}
            className="group flex items-center gap-3 text-right text-sm text-muted hover:text-foreground"
          >
            <div>
              <span className="text-xs text-muted">Next lesson</span>
              <p className="font-medium">{nextLesson.title}</p>
            </div>
            <svg className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      <div className="mt-6 space-y-6 pb-8">
        <NotesPanel lessonKey={`${lesson.domainId}/${lesson.id}`} />
        <CommentsSection lessonKey={`${lesson.domainId}/${lesson.id}`} />
      </div>
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

const DIAGRAMS: Record<NonNullable<Lesson["diagram"]>, React.ComponentType> = {
  "agentic-loop": AgenticLoopDiagram,
  "workflow-patterns": WorkflowPatternsExplorer,
  "mcp-architecture": McpArchitectureDiagram,
  "context-window": ContextWindowVisualizer,
};
