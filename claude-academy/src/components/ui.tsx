import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "blue";
}) {
  const tones = {
    default: "border-line bg-panel-2 text-muted",
    accent: "border-accent/40 bg-accent-soft text-accent",
    blue: "border-blue/40 bg-blue/10 text-blue",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <div className="mt-4 max-w-2xl leading-relaxed text-muted">{intro}</div>
        )}
        {children}
      </div>
    </header>
  );
}

export function ComingSoon({
  title,
  planned,
}: {
  title: string;
  planned: string[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="rounded-xl border border-line bg-panel p-6 text-sm leading-relaxed text-muted">
        This section ships in phase 2 of the build-out. The features below are
        specified and queued.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {planned.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-line bg-panel p-5 text-sm"
          >
            <span aria-hidden className="mr-2 text-accent">◆</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CodeBlock({
  label,
  language,
  code,
}: {
  label: string;
  language: string;
  code: string;
}) {
  return (
    <figure className="mt-4 overflow-hidden rounded-xl border border-line bg-panel-2">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs">
        <span className="font-mono font-semibold text-muted">{label}</span>
        <span className="uppercase tracking-wide text-muted">{language}</span>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  );
}
