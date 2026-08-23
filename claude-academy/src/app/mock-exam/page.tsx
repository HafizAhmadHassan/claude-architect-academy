import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ExamEngine } from "@/components/exam-engine";
import { practiceQuestions } from "@/lib/content/questions/practice-questions";

export const metadata: Metadata = {
  title: "Mock exam",
  description:
    "Timed full-length CCA-F simulation with scaled scoring, domain breakdown, and targeted recommendations.",
};

export default function MockExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mock exam"
        title="Simulate test day"
        intro="Full bank, 60-minute clock, no feedback until you submit. Scaled-score estimate against the 720 pass line."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ExamEngine questions={practiceQuestions} variant="mock" />
      </section>
    </>
  );
}
