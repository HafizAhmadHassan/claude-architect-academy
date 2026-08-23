import type { Metadata } from "next";
import { PracticeEngine } from "@/components/practice-engine";
import { PageHeader } from "@/components/ui";
import { practiceQuestions } from "@/lib/content/questions/practice-questions";

export const metadata: Metadata = {
  title: "Practice questions",
  description:
    "Original exam-style practice questions for the Claude Certified Architect – Foundations exam with full explanations. Not official Anthropic exam questions.",
};

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice Questions"
        title="Practice question engine"
        intro={
          <>
            Original questions across all five domains and difficulty levels.
            Every answer includes an explanation of every option — including why
            the wrong ones fail.
          </>
        }
      >
        <p className="mt-6 rounded-xl border-l-4 border-accent bg-accent-soft p-4 max-w-2xl text-sm leading-relaxed">
          Practice questions only — not an official Anthropic exam question set,
          and not predictive of your real score. Multiple-response items state
          how many answers to select, matching the official item format.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <PracticeEngine questions={practiceQuestions} />
      </section>
    </>
  );
}
