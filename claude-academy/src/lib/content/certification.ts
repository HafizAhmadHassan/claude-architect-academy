import type { DomainId } from "./types";

export const certification = {
  name: "Claude Certified Architect – Foundations",
  abbreviation: "CCA-F",
  issuer: "Anthropic",
  positioning:
    "Claude Architect Academy is an independent educational preparation platform. It is not operated, owned, or endorsed by Anthropic.",
  verifyNotice:
    "Always verify current exam information with Anthropic's official certification page.",
  officialUrls: {
    certificationPage:
      "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification",
    learn: "https://www.anthropic.com/learn",
    examGuide:
      "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification",
  },
  lastVerified: "2026-08-23",
  exam: {
    durationMinutes: 120,
    itemCount: 60,
    itemFormat:
      "Multiple-choice and multiple-response items. Each item states how many answers to select.",
    delivery: "Proctored: online proctoring and/or Pearson VUE test center",
    passingScore: {
      scaled: 720,
      scaleMin: 100,
      scaleMax: 1000,
    },
    resultsReporting:
      "Pass/fail with a scaled score (100–1,000), plus percent-correct by domain on the score report.",
    feeUsd: 125,
    validityMonths: 12,
    renewal:
      "Renew by completing a free, non-proctored renewal assessment before the credential expires.",
    scenarioFormat:
      "Scenario-based items grounded in realistic production use cases. Four scenarios are presented, selected at random from the blueprint.",
  },
  domainWeights: [
    { domainId: "agentic-architecture", weight: 27 },
    { domainId: "tool-design-mcp", weight: 18 },
    { domainId: "claude-code-workflows", weight: 20 },
    { domainId: "prompt-engineering", weight: 20 },
    { domainId: "context-reliability", weight: 15 },
  ] satisfies { domainId: DomainId; weight: number }[],
  sources: [
    {
      label: "Anthropic Partner Academy – CCA-F certification page",
      url: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification",
    },
    {
      label: "Claude Certified Architect – Foundations Exam Guide (official PDF)",
      url: "https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542750%2FClaude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf",
    },
  ],
} as const;

export const siteMetadata = {
  name: "Claude Architect Academy",
  tagline: "Independent Claude Certified Architect preparation resource",
  description:
    "A free interactive learning platform for the Anthropic Claude Certified Architect – Foundations (CCA-F) exam: agentic architecture, MCP integration, Claude Code workflows, prompt engineering, and reliability.",
};
