import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://hafizahmadhassan.github.io/claude-architect-academy";
  const routes = [
    "",
    "/certification",
    "/roadmap",
    "/domains",
    "/domains/agentic-architecture",
    "/domains/agentic-architecture/lessons/the-agentic-loop",
    "/practice",
    "/scenarios",
    "/demos",
    "/labs",
    "/labs/mcp-server",
    "/mock-exam",
    "/flashcards",
    "/patterns",
    "/projects",
    "/resources",
    "/progress",
  ];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
}
