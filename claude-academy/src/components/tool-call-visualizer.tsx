"use client";

import { useState } from "react";

const TURNS = [
  {
    role: "user" as const,
    label: "User",
    content: "What's the weather in Paris right now?",
    color: "bg-emerald-500",
  },
  {
    role: "assistant" as const,
    label: "Claude",
    content: "Let me look that up for you.",
    toolUse: { name: "get_weather", args: { city: "Paris", units: "metric" } },
    color: "bg-accent-strong",
  },
  {
    role: "runtime" as const,
    label: "Your runtime",
    content: "Executes get_weather → { temp: 18, condition: 'cloudy', humidity: 72 }",
    color: "bg-amber-500",
  },
  {
    role: "tool_result" as const,
    label: "tool_result",
    content: '→ Appended to messages: { temp: 18, condition: "cloudy", humidity: 72 }',
    color: "bg-blue",
  },
  {
    role: "assistant" as const,
    label: "Claude",
    content:
      "Paris is currently 18°C with cloudy skies and 72% humidity.",
    color: "bg-accent-strong",
  },
  {
    role: "user" as const,
    label: "User",
    content: "Compare that to London.",
    color: "bg-emerald-500",
  },
  {
    role: "assistant" as const,
    label: "Claude",
    content: "Let me check London too.",
    toolUse: { name: "get_weather", args: { city: "London", units: "metric" } },
    color: "bg-accent-strong",
  },
  {
    role: "runtime" as const,
    label: "Your runtime",
    content: "Executes get_weather → { temp: 14, condition: 'rainy', humidity: 88 }",
    color: "bg-amber-500",
  },
  {
    role: "tool_result" as const,
    label: "tool_result",
    content: '→ Appended to messages: { temp: 14, condition: "rainy", humidity: 88 }',
    color: "bg-blue",
  },
  {
    role: "assistant" as const,
    label: "Claude",
    content:
      "London is 14°C with rain and 88% humidity — 4°C cooler and wetter than Paris. No tool calls left, so this is my final answer.",
    stopReason: "end_turn",
    color: "bg-accent-strong",
  },
];

export function ToolCallVisualizer() {
  const [visible, setVisible] = useState(1);

  const reset = () => setVisible(1);
  const next = () => setVisible((v) => Math.min(v + 1, TURNS.length));
  const prev = () => setVisible((v) => Math.max(v - 1, 1));

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Tool-call message sequence</h3>
          <p className="text-sm text-muted">
            Step through the real API message flow — tool_use proposals out, tool_result observations in.
          </p>
        </div>
        <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-mono text-muted">
          Step {visible} / {TURNS.length}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-background">
        {TURNS.slice(0, visible).map((t, i) => (
          <div
            key={i}
            className={`${i === visible - 1 ? "animate-slide-up" : ""} border-b border-line last:border-0 px-4 py-3`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${t.color}`}
              >
                {t.label.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted">
                    {t.label}
                  </span>
                  {t.toolUse && (
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      tool_use
                    </span>
                  )}
                  {t.role === "tool_result" && (
                    <span className="rounded bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                      tool_result
                    </span>
                  )}
                  {t.stopReason && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      stop_reason: {t.stopReason}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{t.content}</p>
                {t.toolUse && (
                  <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 font-mono text-xs">
                    {t.toolUse.name}({JSON.stringify(t.toolUse.args)})
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={visible <= 1}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-panel-2 disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={next}
          disabled={visible >= TURNS.length}
          className="rounded-lg bg-accent-strong px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto text-xs text-muted underline underline-offset-2 hover:text-foreground"
        >
          Reset
        </button>
      </div>

      <p className="mt-4 rounded-lg border border-line bg-background p-3 text-xs leading-relaxed text-muted">
        <strong className="text-foreground">Key pattern:</strong> Every tool_use
        block in Claude&apos;s response receives a tool_result in the next user
        turn. Your runtime executes the call and returns the observation — the
        model never touches your systems directly. The loop ends when
        stop_reason is <code>end_turn</code> (no more tool calls requested).
      </p>
    </div>
  );
}
