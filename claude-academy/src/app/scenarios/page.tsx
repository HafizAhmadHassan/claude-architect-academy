import type { Metadata } from "next";
import { ScenarioPlayer } from "@/components/scenario-player";
import { Badge, PageHeader } from "@/components/ui";
import { scenarios } from "@/lib/content/scenarios/scenarios";
import { domainMap } from "@/lib/content/domains";

export const metadata: Metadata = {
  title: "Interactive architecture scenarios",
  description:
    "Scenario-based architecture decision practice for the Claude Certified Architect – Foundations exam, with trade-off analysis of every option.",
};

export default function ScenariosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Scenarios"
        title="Architecture scenario engine"
        intro={
          <>
            The real exam is scenario-driven. Each briefing gives you a business
            requirement and hard constraints — commit to a choice, then study
            why every option lands where it does.
          </>
        }
      />
      <section className="mx-auto max-w-4xl space-y-16 px-4 py-14 sm:px-6">
        {scenarios.map((s) => (
          <div key={s.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{domainMap[s.domainId].name}</Badge>
              <Badge>{s.difficulty}</Badge>
              {s.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <h2 className="mt-3 text-xl font-bold tracking-tight">{s.title}</h2>
            <div className="mt-6">
              <ScenarioPlayer scenario={s} />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
