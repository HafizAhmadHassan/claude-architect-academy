"use client";

import { useMemo, useState } from "react";

const BASELINE = 3200;
const DOCS_TOKENS = 24000;
const PER_TURN_CONV = 450;
const PER_TOOL_RESULT = 5200;

interface Segment {
  key: string;
  label: string;
  tokens: number;
  className: string;
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(Math.round(n));
}

export function ContextWindowVisualizer() {
  const [windowK, setWindowK] = useState(200);
  const [turns, setTurns] = useState(14);
  const [toolResultsPerTurn, setToolResultsPerTurn] = useState(1);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [compacted, setCompacted] = useState(false);

  const model = useMemo(() => {
    const windowTokens = windowK * 1000;
    const liveTurns = compacted ? Math.max(2, Math.ceil(turns * 0.25)) : turns;
    const archivedTurns = turns - liveTurns;

    const conversation = liveTurns * PER_TURN_CONV + archivedTurns * PER_TURN_CONV * 0.15;
    const toolResults =
      liveTurns * toolResultsPerTurn * PER_TOOL_RESULT +
      archivedTurns * toolResultsPerTurn * PER_TOOL_RESULT * 0.12;
    const summaryBlock = compacted && archivedTurns > 0 ? Math.max(600, archivedTurns * 220) : 0;
    const docs = includeDocs ? DOCS_TOKENS : 0;

    const segments: Segment[] = [
      { key: "sys", label: "System prompt + tool schemas", tokens: BASELINE, className: "bg-[var(--panel-2)]" },
      ...(docs > 0
        ? [{ key: "docs", label: "Retrieved documents", tokens: docs, className: "bg-amber-500" }]
        : []),
      { key: "conv", label: "Conversation history", tokens: conversation, className: "bg-blue" },
      { key: "tools", label: "Tool results", tokens: toolResults, className: "bg-emerald-500" },
      ...(summaryBlock > 0
        ? [{ key: "sum", label: "Checkpoint summary", tokens: summaryBlock, className: "bg-fuchsia-500" }]
        : []),
    ];

    const used = segments.reduce((a, s) => a + s.tokens, 0);
    const pct = (used / windowTokens) * 100;
    const status =
      pct < 60
        ? { label: "Healthy", tone: "text-emerald-500", note: "Full attention fidelity across the window." }
        : pct < 85
          ? { label: "Degrading risk", tone: "text-amber-500", note: "Mid-window recall starts to slip — pin critical facts early." }
          : { label: "Critical", tone: "text-red-500", note: "Compaction or context handoff required before the next turn." };

    return { windowTokens, segments, used, pct, status };
  }, [windowK, turns, toolResultsPerTurn, includeDocs, compacted]);

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Context window simulator</h3>
          <p className="text-sm text-muted">See how a long agent session fills up — then compact it.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="cw-window" className="text-muted">Window</label>
          <select
            id="cw-window"
            value={windowK}
            onChange={(e) => setWindowK(Number(e.target.value))}
            className="rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-sm"
          >
            <option value={100}>100k</option>
            <option value={200}>200k</option>
            <option value={1000}>1M</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4 rounded-lg border border-line bg-background p-4">
          <SliderRow
            id="cw-turns"
            label="Conversation turns"
            value={turns}
            min={1}
            max={40}
            onChange={setTurns}
          />
          <SliderRow
            id="cw-tools"
            label="Tool results / turn"
            value={toolResultsPerTurn}
            min={0}
            max={4}
            onChange={setToolResultsPerTurn}
          />
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={includeDocs}
              onChange={(e) => setIncludeDocs(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent-strong)]"
            />
            <span>Retrieve documents into context ({fmt(DOCS_TOKENS)} tok)</span>
          </label>
          <button
            type="button"
            onClick={() => setCompacted((v) => !v)}
            aria-pressed={compacted}
            className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              compacted
                ? "bg-accent-strong text-white"
                : "border border-line bg-panel-2 hover:bg-panel"
            }`}
          >
            {compacted ? "✓ Compaction active — summarize old turns" : "Compact old messages"}
          </button>
          <p className="text-xs leading-relaxed text-muted">
            Compaction replaces stale turns with a structured checkpoint summary,
            trading fine-grained detail for headroom — exactly what
            summarize-and-resume architectures do in production.
          </p>
        </div>

        <div className="min-w-0 space-y-4">
          <div
            className="relative flex h-16 w-full overflow-hidden rounded-xl border border-line bg-background"
            role="img"
            aria-label={`Context window usage: ${Math.round(model.pct)} percent`}
          >
            {model.segments.map((s) => (
              <div
                key={s.key}
                className={`${s.className} h-full transition-all duration-500`}
                style={{ width: `${(s.tokens / model.windowTokens) * 100}%` }}
                title={`${s.label}: ~${fmt(s.tokens)} tokens`}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-red-500/70 transition-all duration-500"
              style={{ left: `${Math.min(model.pct, 99.5)}%` }}
            />
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3">
            {model.segments.map((s) => (
              <li key={s.key} className="flex items-center gap-2 text-muted">
                <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-sm ${s.className}`} />
                <span className="truncate">{s.label}</span>
                <span className="ml-auto shrink-0 font-mono">{fmt(s.tokens)}</span>
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Used" value={`${fmt(model.used)} tok`} />
            <Stat label="Window" value={`${windowK}k`} />
            <Stat label="Utilization" value={`${model.pct.toFixed(1)}%`} />
            <div className="rounded-lg border border-line bg-background px-3 py-2">
              <dt className="text-[11px] uppercase tracking-widest text-muted">Status</dt>
              <dd className={`text-sm font-bold ${model.status.tone}`}>{model.status.label}</dd>
            </div>
          </dl>

          <p className="rounded-lg border border-line bg-background p-3 text-xs leading-relaxed text-muted">
            <strong className="text-foreground">{model.status.label}:</strong> {model.status.note} Tool
            results are usually the fastest-growing segment in real traces — audit them before
            blaming the conversation.
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="text-muted">{label}</label>
        <span className="rounded bg-panel-2 px-2 py-0.5 font-mono text-xs">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-[var(--accent-strong)]"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-background px-3 py-2">
      <dt className="text-[11px] uppercase tracking-widest text-muted">{label}</dt>
      <dd className="font-mono text-sm font-bold">{value}</dd>
    </div>
  );
}
