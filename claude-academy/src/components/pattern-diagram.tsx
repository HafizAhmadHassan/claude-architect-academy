import type { DiagramEdge, DiagramNode } from "@/lib/content/patterns";

const NODE_W = 148;
const NODE_H = 42;
const VIEW_W = 660;

export function PatternDiagram({
  nodes,
  edges,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}) {
  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W));
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H)) + 8;
  const scale = Math.min(1, VIEW_W / maxX);
  const height = Math.round(maxY * scale);

  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${height}`}
      className="w-full rounded-xl border border-line bg-panel-2"
      role="img"
      aria-label="Architecture pattern diagram"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--accent)" />
        </marker>
      </defs>

      {edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const x1 = (a.x + NODE_W / 2) * scale;
        const y1 = (a.y + NODE_H / 2) * scale;
        const x2 = (b.x + NODE_W / 2) * scale;
        const y2 = (b.y + NODE_H / 2) * scale;

        // trim line to node borders
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const trimA = ((NODE_H / 2 + 4) * scale) / len;
        const trimB = ((NODE_H / 2 + 4) * scale) / len;
        const sx = x1 + dx * trimA;
        const sy = y1 + dy * trimA;
        const tx = x2 - dx * trimB;
        const ty = y2 - dy * trimB;

        return (
          <g key={`${e.from}-${e.to}-${e.label ?? ""}`}>
            <line
              x1={sx}
              y1={sy}
              x2={tx}
              y2={ty}
              stroke="var(--accent)"
              strokeWidth={1.6}
              markerEnd="url(#arrow)"
              opacity={0.85}
            />
            {e.label && (
              <text
                x={(sx + tx) / 2}
                y={(sy + ty) / 2 - 4}
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted)"
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x * scale}
            y={n.y * scale}
            width={NODE_W * scale}
            height={NODE_H * scale}
            rx={8}
            fill="var(--panel)"
            stroke="var(--line)"
          />
          <text
            x={(n.x + NODE_W / 2) * scale}
            y={(n.y + NODE_H / 2 + 3.5) * scale}
            textAnchor="middle"
            fontSize={11.5}
            fontWeight={600}
            fill="var(--foreground)"
          >
            {n.label.length > 24 ? `${n.label.slice(0, 23)}…` : n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
