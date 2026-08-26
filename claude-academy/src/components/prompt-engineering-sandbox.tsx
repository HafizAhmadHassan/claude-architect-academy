"use client";

import { useState } from "react";

const LAYERS = [
  {
    id: "role",
    label: "Role",
    placeholder: "You are a financial data extraction assistant.",
    defaultText: "You are a financial data extraction assistant.",
    color: "border-emerald-500/40",
    bg: "bg-emerald-500/5",
    accent: "text-emerald-600 dark:text-emerald-400",
    note: "Sets persona, expertise, behavioral defaults. Place at the top for primacy.",
  },
  {
    id: "rules",
    label: "Immutable rules",
    placeholder: "- Return null for uncertain fields\n- Never invent numeric values\n- Refuse non-financial input",
    defaultText: "- Return null for uncertain fields\n- Never invent numeric values\n- Refuse non-financial input",
    color: "border-red-500/40",
    bg: "bg-red-500/5",
    accent: "text-red-500 dark:text-red-400",
    note: "Hard constraints the model must not override. Top or bottom for attention edges.",
  },
  {
    id: "format",
    label: "Output format",
    placeholder: '{ "vendor": string, "amount": number | null, "currency": string }',
    defaultText: '{ "vendor": string, "amount": number | null, "currency": string }',
    color: "border-amber-500/40",
    bg: "bg-amber-500/5",
    accent: "text-amber-600 dark:text-amber-400",
    note: "Response shape contract. Place at edges (top/bottom) where attention is strongest.",
  },
  {
    id: "context",
    label: "Runtime context",
    placeholder: "Task: extract invoice data from email text.\nToday's date: 2026-08-26",
    defaultText: "Task: extract invoice data from email text.\nToday's date: 2026-08-26",
    color: "border-blue/40",
    bg: "bg-blue/5",
    accent: "text-blue dark:text-[var(--blue)]",
    note: "Task-specific data injected per call. Changes with every invocation.",
  },
];

function tokenCount(text: string): number {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .reduce((acc, word) => {
      if (word.length > 6) return acc + Math.ceil(word.length / 4);
      return acc + 1;
    }, 0);
}

export function PromptSandbox() {
  const [layers, setLayers] = useState(
    Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultText]))
  );
  const [selected, setSelected] = useState<string | null>(null);

  const layerOrder = ["rules", "format", "role", "context"];
  const ordered = layerOrder.map((id) => LAYERS.find((l) => l.id === id)!);
  const totalTokens = tokenCount(
    ordered
      .filter((l) => layers[l.id]?.trim())
      .map((l) => `[${l.label}] ${layers[l.id]}`)
      .join("\n")
  );

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">System prompt layer builder</h3>
          <p className="text-sm text-muted">
            Edit each layer to see how the combined prompt changes. Attention
            favors the top and bottom edges — place hard constraints there.
          </p>
        </div>
        <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-mono text-muted">
          ~{totalTokens} tokens
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {ordered.map((layer, i) => (
            <div
              key={layer.id}
              className={`rounded-lg border ${layer.color} ${layer.bg} p-3 transition-all ${
                selected === layer.id ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-accent">
                  {i + 1}
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${layer.accent}`}
                >
                  {layer.label}
                </span>
                <span className="ml-auto rounded bg-panel-2 px-2 py-0.5 text-[10px] text-muted">
                  {tokenCount(layers[layer.id] || "")} tok
                </span>
              </div>
              <textarea
                value={layers[layer.id]}
                onChange={(e) =>
                  setLayers((prev) => ({
                    ...prev,
                    [layer.id]: e.target.value,
                  }))
                }
                onFocus={() => setSelected(layer.id)}
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-line bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted"
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                {layer.note}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Combined prompt (as Claude sees it)
            </p>
            <pre className="mt-3 max-h-[400px] overflow-auto rounded-lg border border-line bg-panel p-3 font-mono text-xs leading-relaxed text-muted whitespace-pre-wrap">
              {ordered
                .filter((l) => layers[l.id]?.trim())
                .map((l) => {
                  const block = layers[l.id] || "";
                  return `## ${l.label}\n${block}`;
                })
                .join("\n\n")}
            </pre>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Attention placement guide
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted">
              <li className="flex gap-2">
                <span className="text-emerald-500">▲</span>
                <strong>Top:</strong> Role + hard rules (primacy effect)
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">—</span>
                <strong>Middle:</strong> Context data (softest attention)
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">▼</span>
                <strong>Bottom:</strong> Format contract (recency effect)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
