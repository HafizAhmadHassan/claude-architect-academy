const box = { fill: "var(--panel-2)", stroke: "var(--line)" };

function PrimitiveRow({ x, y, name, desc, color }: { x: number; y: number; name: string; desc: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="196" height="34" rx="8" fill="var(--background)" stroke="var(--line)" />
      <circle cx={x + 16} cy={y + 17} r="4" fill={color} />
      <text x={x + 30} y={y + 15} fontSize="11.5" fontWeight="700" fill="var(--foreground)">{name}</text>
      <text x={x + 30} y={y + 28} fontSize="9.5" fill="var(--muted)">{desc}</text>
    </g>
  );
}

export function McpArchitectureDiagram() {
  return (
    <figure className="overflow-x-auto rounded-xl border border-line bg-panel p-6">
      <svg
        viewBox="0 0 780 430"
        className="mx-auto min-w-[600px] max-w-full"
        role="img"
        aria-labelledby="mcp-arch-title mcp-arch-desc"
      >
        <title id="mcp-arch-title">MCP host–client–server architecture</title>
        <desc id="mcp-arch-desc">
          An MCP host application such as Claude Code or Claude Desktop creates one MCP client per
          server. Clients speak JSON-RPC over stdio or Streamable HTTP to servers that expose tools,
          resources, and prompts. Clients can also expose elicitation and sampling to servers.
        </desc>

        <defs>
          <marker id="mcp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
          </marker>
          <marker id="mcp-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
          </marker>
        </defs>

        <g fontFamily="inherit">
          {/* Host */}
          <rect x="16" y="60" width="300" height="330" rx="16" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="166" y="88" textAnchor="middle" fontWeight="700" fontSize="14" fill="var(--accent)">
            MCP Host
          </text>
          <text x="166" y="106" textAnchor="middle" fontSize="10.5" fill="var(--muted)">
            Claude Code · Claude Desktop · your IDE / app
          </text>

          {/* Host internals */}
          <rect x="36" y="122" width="120" height="52" rx="10" {...box} />
          <text x="96" y="144" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--foreground)">LLM</text>
          <text x="96" y="160" textAnchor="middle" fontSize="9.5" fill="var(--muted)">reasons &amp; selects tools</text>

          <rect x="176" y="122" width="120" height="52" rx="10" {...box} />
          <text x="236" y="144" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--foreground)">Permissions</text>
          <text x="236" y="160" textAnchor="middle" fontSize="9.5" fill="var(--muted)">consent &amp; policy</text>

          <rect x="36" y="200" width="260" height="64" rx="12" fill="var(--background)" stroke="var(--blue)" />
          <text x="166" y="226" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--blue)">MCP Client A</text>
          <text x="166" y="243" textAnchor="middle" fontSize="9.5" fill="var(--muted)">one stateful session per server</text>
          <text x="166" y="256" textAnchor="middle" fontSize="9.5" fill="var(--muted)">capability negotiation at init</text>

          <rect x="36" y="292" width="260" height="56" rx="12" fill="var(--background)" stroke="var(--blue)" opacity="0.75" />
          <text x="166" y="315" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--blue)">MCP Client B</text>
          <text x="166" y="332" textAnchor="middle" fontSize="9.5" fill="var(--muted)">isolated connection · own security boundary</text>

          {/* Client-exposed primitives */}
          <rect x="36" y="360" width="260" height="24" rx="8" fill="var(--background)" stroke="var(--line)" strokeDasharray="4 3" />
          <text x="166" y={376} textAnchor="middle" fontSize="9.5" fill="var(--muted)">
            clients expose: elicitation · sampling · logging
          </text>

          {/* Server 1 */}
          <rect x="470" y="40" width="290" height="170" rx="16" {...box} strokeWidth="1.5" />
          <text x="615" y="68" textAnchor="middle" fontWeight="700" fontSize="14" fill="var(--foreground)">
            MCP Server — e.g. GitHub
          </text>
          <PrimitiveRow x={486} y={82} name="tools/" desc="executable actions the model invokes" color="var(--accent)" />
          <PrimitiveRow x={486} y={122} name="resources/" desc="read-only context data via URIs" color="var(--blue)" />
          <PrimitiveRow x={486} y={162} name="prompts/" desc="user-controlled templates" color="#d946ef" />

          {/* Server 2 */}
          <rect x="470" y="240" width="290" height="150" rx="16" {...box} strokeWidth="1.5" />
          <text x="615" y="268" textAnchor="middle" fontWeight="700" fontSize="14" fill="var(--foreground)">
            MCP Server — e.g. Postgres
          </text>
          <PrimitiveRow x={486} y={282} name="tools/query" desc="parameterized reads & writes" color="var(--accent)" />
          <PrimitiveRow x={486} y={322} name="resources/schema" desc="database schema as context" color="var(--blue)" />

          {/* Connections */}
          <path d="M 296 232 C 380 220 400 140 462 128" fill="none" stroke="var(--accent)" strokeWidth="2" className="flow-dash" markerEnd="url(#mcp-arrow)" />
          <path d="M 296 320 C 380 330 400 330 462 322" fill="none" stroke="var(--accent)" strokeWidth="2" className="flow-dash" markerEnd="url(#mcp-arrow)" />

          {/* Transport labels */}
          <g>
            <rect x="352" y="86" width="104" height="42" rx="10" fill="var(--background)" stroke="var(--line)" />
            <text x="404" y="103" textAnchor="middle" fontSize="9.5" fill="var(--muted)">stdio (local)</text>
            <text x="404" y="117" textAnchor="middle" fontSize="9.5" fill="var(--muted)">Streamable HTTP</text>
          </g>
          <g>
            <rect x="352" y="306" width="104" height="30" rx="8" fill="var(--background)" stroke="var(--line)" />
            <text x="404" y="325" textAnchor="middle" fontSize="9.5" fill="var(--muted)">JSON-RPC 2.0</text>
          </g>

          {/* Lifecycle note */}
          <path d="M 470 210 H 316" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#mcp-arrow-muted)" />
          <text x="392" y="202" textAnchor="middle" fontSize="9.5" fill="var(--muted)">initialize → capabilities → discover (*&#47;list)</text>

          {/* Legend footer */}
          <text x="390" y={418} textAnchor="middle" fontSize="11" fill="var(--muted)">
            Host coordinates clients and enforces consent · each client keeps one isolated session with its server
          </text>
        </g>
      </svg>
      <figcaption className="mt-4 text-center text-sm text-muted">
        The MCP host–client–server architecture per the official specification.
      </figcaption>
    </figure>
  );
}
