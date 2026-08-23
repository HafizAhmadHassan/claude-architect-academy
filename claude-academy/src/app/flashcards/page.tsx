import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Flashcards",
  description:
    "Spaced-repetition flashcards covering architecture patterns, MCP concepts, Claude Code, prompt engineering, and reliability.",
};

export default function FlashcardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Flashcards"
        title="Flip, rate, repeat"
        intro="Rapid-recall cards across every domain, driven by your practice results."
      />
      <ComingSoon
        title="Planned decks"
        planned={[
          "Architecture patterns deck",
          "MCP concepts deck",
          "Claude Code concepts deck",
          "Prompt engineering deck",
          "Context management deck",
          "Reliability deck",
          "Common anti-patterns deck",
          "Flip / known / review-later states",
          "Domain filtering + difficulty tracking",
        ]}
      />
    </>
  );
}
