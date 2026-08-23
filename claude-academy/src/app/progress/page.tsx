import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { ProgressDashboard } from "@/components/progress-dashboard";

export const metadata: Metadata = {
  title: "Progress dashboard",
  description:
    "Track your Claude Architect readiness across lessons, labs, practice scores, and domain mastery.",
};

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Your Claude Architect Readiness"
        intro="Everything you complete — lessons, weekly tasks, practice sets, mock exams, flashcards — feeds these numbers. Stored locally in your browser; no account needed."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ProgressDashboard />
      </section>
    </>
  );
}
