import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { flashcards } from "@/lib/content/flashcards";

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
        intro="Rapid-recall cards across every domain. Rate each card — known cards drop out of rotation, review-later cards queue up in the review pile."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <FlashcardDeck cards={flashcards} />
        <p className="mt-10 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
          Ratings persist locally in your browser and feed the{" "}
          <Link href="/progress" className="text-accent hover:underline">
            progress dashboard
          </Link>
          .
        </p>
      </section>
    </>
  );
}
