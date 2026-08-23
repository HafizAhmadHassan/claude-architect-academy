import type { Lab } from "../types";

export const labs: Lab[] = [
  {
    id: "mcp-server",
    domainIds: ["tool-design-mcp", "agentic-architecture"],
    title: "Build your first MCP server",
    estimatedMinutes: 60,
    objective:
      "Stand up a working Model Context Protocol server in TypeScript that exposes a customer-lookup tool and a compliant resource, connect it to an MCP client, and observe how tool schemas, descriptions, and structured errors drive Claude's behavior.",
    prerequisites: [
      "Node.js 20+ and npm installed",
      "Working knowledge of async TypeScript",
      "An Anthropic API key if you also want to call the API from a test client",
    ],
    architecture: [
      "Your MCP server is a standalone process exposing capabilities over a transport.",
      "stdio transport: the host application spawns your server as a child process and communicates over stdin/stdout — ideal for local tools.",
      "Each registered tool declares a name, a description, and a JSON-schema-validated input. Validation happens at the protocol layer before your handler runs.",
      "Tool handlers return content blocks; errors should be returned as structured results carrying an errorCategory so clients can branch deterministically.",
    ],
    steps: [
      {
        title: "Scaffold the project",
        detail:
          "Create the package, install the MCP SDK and Zod, and configure TypeScript module resolution for ESM.",
        code: {
          label: "terminal",
          language: "bash",
          code: `mkdir crm-mcp-server && cd crm-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init --target es2022 --module nodenext --moduleResolution nodenext
mkdir src`,
        },
      },
      {
        title: "Declare the server and transport",
        detail:
          "Create the server instance and wire it to stdio. The server registers capabilities explicitly so clients can discover them.",
        code: {
          label: "src/server.ts",
          language: "typescript",
          code: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCrmTools } from "./tools.js";

const server = new McpServer({
  name: "crm-mcp-server",
  version: "0.1.0",
});

registerCrmTools(server);

await server.connect(new StdioServerTransport());`,
        },
      },
      {
        title: "Register a well-described tool",
        detail:
          "The description is the contract Claude reasons over: state when to use the tool, parameter formats, and what happens when nothing matches. Zod validates input before your handler executes.",
        code: {
          label: "src/tools.ts",
          language: "typescript",
          code: `import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const customers = [
  { id: "cus_101", name: "Acme Corp", region: "eu", tier: "enterprise" },
  { id: "cus_102", name: "Globex", region: "us", tier: "growth" },
];

export function registerCrmTools(server: McpServer) {
  server.registerTool(
    "search_customers",
    {
      title: "Search customers",
      description:
        "Look up customers by free-text name query. Returns matching customers with id, name, region, and tier. Returns an empty list when no customer matches — do not invent IDs. Use customer ids from this list for any follow-up record lookups.",
      inputSchema: {
        query: z
          .string()
          .min(2)
          .describe("Case-insensitive substring of the customer name"),
      },
    },
    async ({ query }) => {
      const q = query.toLowerCase();
      const matches = customers.filter((c) =>
        c.name.toLowerCase().includes(q)
      );

      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ matches }) },
        ],
      };
    }
  );
}`,
        },
      },
      {
        title: "Add a permission-gated write tool",
        detail:
          "Write operations must be distinguishable from reads. Here the handler refuses to mutate and instead returns a structured proposal payload plus an errorCategory, which a host would surface in an approval queue.",
        code: {
          label: "src/tools.ts (append inside registerCrmTools)",
          language: "typescript",
          code: `server.registerTool(
  "update_customer_tier",
  {
    title: "Update customer tier",
    description:
      "Propose a tier change for a customer. This tool never mutates data directly: it returns a change proposal that requires human approval through the support workflow.",
    inputSchema: {
      customerId: z.string().startsWith("cus_"),
      tier: z.enum(["starter", "growth", "enterprise"]),
    },
  },
  async ({ customerId, tier }) => {
    const known = customers.some((c) => c.id === customerId);
    if (!known) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              errorCategory: "validation",
              message: \`Unknown customerId \${customerId}\`,
            }),
          },
        ],
      };
    }

    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            errorCategory: "permission",
            message: "Tier changes require human approval",
            proposal: { customerId, tier, status: "pending_approval" },
          }),
        },
      ],
    };
  }
);`,
        },
      },
      {
        title: "Smoke-test with the MCP Inspector",
        detail:
          "Run the official inspector to connect as a client, list tools, and invoke search_customers before ever wiring Claude in.",
        code: {
          label: "terminal",
          language: "bash",
          code: `npx @modelcontextprotocol/inspector npx tsx src/server.ts

# In the inspector UI:
#   1. Connect
#   2. Tools -> List Tools  (verify descriptions render)
#   3. Call search_customers with {"query": "acme"}
#   4. Call update_customer_tier and confirm the structured permission error`,
        },
      },
    ],
    expectedOutput:
      "search_customers returns {\"matches\":[{\"id\":\"cus_101\",\"name\":\"Acme Corp\",\"region\":\"eu\",\"tier\":\"enterprise\"}]} for the query 'acme', and update_customer_tier returns an errorCategory=permission payload containing a pending_approval proposal.",
    validationChecklist: [
      "Inspector lists both tools with their full descriptions visible",
      "Calling search_customers with a non-matching query returns an empty matches array rather than an error",
      "update_customer_tier with a valid ID returns errorCategory permission with a structured proposal",
      "update_customer_tier with cus_999 returns errorCategory validation",
      "Server starts cleanly via stdio with no stray console.log output polluting the protocol stream",
    ],
    extensionChallenge:
      "Add a customers:// list resource, switch the transport to Streamable HTTP behind authentication, and wrap update_customer_tier so approved proposals from a mock queue actually apply. Then connect Claude Code to your server and verify the model cites empty-result semantics correctly when a search misses.",
  },
];

export const plannedLabs = [
  { id: "structured-api-app", title: "Structured Claude API application" },
  { id: "tool-use-app", title: "Tool-use application" },
  { id: "multi-agent-research", title: "Multi-agent research system" },
  { id: "claude-code-workflow-lab", title: "Claude Code development workflow" },
  { id: "enterprise-support-agent", title: "Production enterprise support agent" },
];
