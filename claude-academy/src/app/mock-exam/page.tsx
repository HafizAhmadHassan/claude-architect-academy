import type { Metadata } from "next";
import { ComingSoon, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mock exam",
  description:
    "Timed exam-style practice for the Claude Certified Architect – Foundations certification. Exam-style practice — does not reproduce the official Anthropic exam.",
};

export default function MockExamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mock Exam"
        title="Timed mock examination"
        intro="Exam-style practice. This simulation will not reproduce the actual Anthropic exam and is not affiliated with Anthropic's testing program."
      />
      <ComingSoon
        title="Planned features"
        planned={[
          "Countdown timer with pause-free pacing",
          "Question navigation grid",
          "Flag questions for review",
          "Answer selection with change tracking",
          "Progress indicator",
          "Submit and score flow",
          "Domain-weighted score breakdown",
          "Weak-area analysis",
          "Recommended lessons per weak domain",
        ]}
      />
    </>
  );
}
