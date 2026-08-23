export function AgenticLoopDiagram() {
  return (
    <figure className="overflow-x-auto rounded-xl border border-line bg-panel p-6">
      <svg
        viewBox="0 0 720 300"
        className="mx-auto min-w-[560px] max-w-full"
        role="img"
        aria-labelledby="agentic-loop-title agentic-loop-desc"
      >
        <title id="agentic-loop-title">The agentic loop</title>
        <desc id="agentic-loop-desc">
          A goal enters the loop, Claude reasons and proposes a tool call, the
          runtime executes the tool and returns an observation, Claude updates
          its plan, and this repeats until a stop condition produces the final
          result.
        </desc>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
          </marker>
          <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
          </marker>
        </defs>

        <g fontFamily="inherit" fontSize="14">
          <rect x="20" y="120" width="110" height="60" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
          <text x="75" y="155" textAnchor="middle" fill="var(--foreground)" fontWeight="600">Goal</text>

          <line x1="130" y1="150" x2="196" y2="150" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />

          <rect x="200" y="100" width="170" height="100" rx="16" fill="var(--accent-strong)" opacity="0.92" />
          <text x="285" y="142" textAnchor="middle" fill="#fff" fontWeight="700">Claude</text>
          <text x="285" y="164" textAnchor="middle" fill="#fff" fontSize="11" opacity="0.85">reason · decide · plan</text>

          <path d="M 370 128 H 520" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrow-accent)" fill="none"/>
          <text x="445" y="118" textAnchor="middle" fontSize="11" fill="var(--accent)">tool_use proposal</text>

          <rect x="524" y="96" width="160" height="64" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
          <text x="604" y="122" textAnchor="middle" fill="var(--foreground)" fontWeight="600">Your runtime</text>
          <text x="604" y="141" textAnchor="middle" fontSize="11" fill="var(--muted)">executes tools</text>

          <path d="M 604 162 V 224 H 285 V 204" stroke="var(--blue)" strokeWidth="2" markerEnd="url(#arrow-accent)" fill="none" />
          <text x="445" y="214" textAnchor="middle" fontSize="11" fill="var(--blue)">tool_result observation</text>

          <path d="M 285 100 C 285 46 420 46 480 70" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#arrow)" fill="none" />

          <rect x="484" y="52" width="200" height="36" rx="18" fill="none" stroke="var(--muted)" strokeDasharray="5 5" />
          <text x="584" y="75" textAnchor="middle" fontSize="12" fill="var(--muted)">stop condition met?</text>

          <line x1="684" y1="70" x2="716" y2="70" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <rect x="588" y="252" width="116" height="36" rx="12" fill="var(--panel-2)" stroke="var(--line)" />
          <text x="646" y="275" textAnchor="middle" fontSize="12" fill="var(--foreground)" fontWeight="600">Final result</text>
          <path d="M 684 78 C 700 140 700 220 652 250" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#arrow)" fill="none" />

          <text x="285" y="238" textAnchor="middle" fontSize="11" fill="var(--muted)">repeat until stop condition or budget</text>
        </g>
      </svg>
      <figcaption className="mt-4 text-center text-sm text-muted">
        The agent loop: proposals out, observations in, budgets on the exit.
      </figcaption>
    </figure>
  );
}
