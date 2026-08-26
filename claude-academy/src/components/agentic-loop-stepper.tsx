"use client";

import { useState } from "react";

const STATES = [
  {
    id: "user",
    label: "User input",
    color: "bg-emerald-500",
    borderColor: "border-emerald-500/50",
    msg: "Messages: [{ role: 'user', content: 'Refactor the auth module and run tests' }]",
    toolCalls: 0,
    loop: false,
    note: "The session starts with the user's instruction. Claude never sees prior turns from other sessions.",
  },
  {
    id: "reason",
    label: "Claude reasons",
    color: "bg-accent-strong",
    borderColor: "border-accent/50",
    msg: "Messages: [..., { role: 'assistant', content: \"I'll start by reading the auth module.\" }]",
    toolCalls: 0,
    loop: false,
    note: "Claude analyzes the request, decides a plan. Often produces a text response first before tool calls.",
  },
  {
    id: "propose",
    label: "Propose tool call",
    color: "bg-amber-500",
    borderColor: "border-amber-500/50",
    msg: "Messages: [..., { tool_use: { name: 'Read', input: { file_path: 'src/auth.ts' } } }]",
    toolCalls: 1,
    loop: true,
    note: "Claude emits tool_use blocks. Your runtime intercepts these — Claude cannot call tools directly.",
  },
  {
    id: "execute",
    label: "Runtime executes",
    color: "bg-blue",
    borderColor: "border-blue/50",
    msg: "Runtime: runs Bash('cat src/auth.ts') → returns 847 lines",
    toolCalls: 1,
    loop: true,
    note: "Your code runs the tool (file read, API call, database query). Claude never touches your systems.",
  },
  {
    id: "observe",
    label: "Observation appended",
    color: "bg-violet-500",
    borderColor: "border-violet-500/50",
    msg: "Messages: [..., { role: 'user', tool_result: 'module auth.ts: { ... }' }]",
    toolCalls: 1,
    loop: true,
    note: "Tool result appears as a user message. Claude sees the observation and decides what to do next.",
  },
  {
    id: "decide",
    label: "Loop or stop?",
    color: "bg-panel-2",
    borderColor: "border-line",
    msg: "stop_reason: 'end_turn' ← done | 'tool_use' ← loop again",
    toolCalls: 1,
    loop: true,
    note: "The critical decision point: if Claude emits more tool_use, loop back to execute. If stop_reason='end_turn', the turn is complete.",
  },
  {
    id: "done",
    label: "Final answer",
    color: "bg-emerald-500",
    borderColor: "border-emerald-500/50",
    msg: "Messages: [..., { role: 'assistant', content: 'Auth refactored. All 23 tests passing.' }]",
    toolCalls: 0,
    loop: false,
    stop: true,
    note: "stop_reason='end_turn': Claude has finished. No more tool calls. Ready for the next user input.",
  },
];

const LOOP_STATES = ["propose", "execute", "observe", "decide"];

export function AgenticLoopStepper() {
  const [current, setCurrent] = useState(0);
  const [toolCallCount, setToolCallCount] = useState(0);

  const state = STATES[current];

  const advance = () => {
    if (state.id === "decide") {
      if (toolCallCount < 3) {
        setToolCallCount((c) => c + 1);
        setCurrent(2);
      } else {
        setToolCallCount(0);
        setCurrent(6);
      }
    } else {
      setCurrent((c) => Math.min(c + 1, 6));
    }
  };

  const reset = () => {
    setCurrent(0);
    setToolCallCount(0);
  };

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Agentic loop state machine</h3>
          <p className="text-sm text-muted">
            Step through the runtime loop — each cycle proposes a tool, executes
            it, observes the result, and decides whether to continue or stop.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-mono text-muted">
            Step {current + 1} / {STATES.length}
          </span>
          {toolCallCount > 0 && (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-600 dark:text-amber-400">
              {toolCallCount} tool call{toolCallCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* State diagram */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted">
        {STATES.map((s, i) => {
          const active = i === current;
          const inLoop = LOOP_STATES.includes(s.id);
          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-all ${
                  active
                    ? `${s.borderColor} ${s.color} text-white scale-110`
                    : inLoop
                      ? "border-dashed border-line text-muted/60"
                      : "border-line bg-background text-muted"
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                {s.label}
              </div>
              {i < STATES.length - 1 && (
                <span className="mx-1 text-muted/40">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Current state detail */}
      <div
        key={state.id}
        className="mt-5 rounded-xl border border-line bg-background p-4 animate-slide-up"
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${state.color}`}
          >
            {current + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold">{state.label}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {state.note}
            </p>
            <pre className="mt-2 rounded-lg border border-line bg-panel p-3 font-mono text-[11px] leading-relaxed text-muted whitespace-pre-wrap break-all">
              {state.msg}
            </pre>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-panel-2 disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={state.stop}
          className="rounded-lg bg-accent-strong px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {state.id === "decide" && toolCallCount < 3
            ? "Loop again →"
            : state.id === "decide"
              ? "Stop (end_turn) →"
              : "Next →"}
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
        <strong className="text-foreground">Exam tip:</strong> The agentic loop
        is:
        <code>user → Claude → [tool_use → execute → observe]* → end_turn</code>.
        Recognizing where a scenario sits in this loop is key to choosing the
        right intervention (hook, human gate, subagent delegation, etc.).
      </p>
    </div>
  );
}
