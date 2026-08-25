/* Content integrity checks: run with `npx tsx scripts/verify-content.ts` */
import { domains } from "../src/lib/content/domains";
import { lessons } from "../src/lib/content/lessons";
import { labs } from "../src/lib/content/labs/labs";
import { practiceQuestions } from "../src/lib/content/questions/practice-questions";
import { scenarios } from "../src/lib/content/scenarios/scenarios";
import { flashcards } from "../src/lib/content/flashcards";
import { weeklyTasks } from "../src/lib/content/weekly-tasks";
import { roadmapWeeks } from "../src/lib/content/roadmap";
import { patterns } from "../src/lib/content/patterns";
import { DOMAIN_IDS, type DomainId } from "../src/lib/content/types";

const errors: string[] = [];
const warn = (msg: string) => errors.push(msg);

const domainIds = new Set<string>(DOMAIN_IDS);
const questionIds = new Set(practiceQuestions.map((q) => q.id));
const labIds = new Set(labs.map((l) => l.id));
const lessonIds = new Set(lessons.map((l) => l.id));
const patternIds = new Set(patterns.map((p) => p.id));

// Domains
for (const d of domains) {
  if (!domainIds.has(d.id)) warn(`domains: unknown id ${d.id}`);
}

// Questions
for (const q of practiceQuestions) {
  if (!domainIds.has(q.domainId)) warn(`question ${q.id}: bad domainId ${q.domainId}`);
  const optIds = new Set(q.options.map((o) => o.id));
  for (const c of q.correctOptionIds) {
    if (!optIds.has(c)) warn(`question ${q.id}: correctOptionId ${c} not in options`);
  }
  for (const o of q.options) {
    if (!(o.id in q.optionExplanations)) {
      warn(`question ${q.id}: missing optionExplanations[${o.id}]`);
    }
  }
  for (const k of Object.keys(q.optionExplanations)) {
    if (!optIds.has(k)) warn(`question ${q.id}: stale optionExplanations key ${k}`);
  }
  if (q.correctOptionIds.length === 0) warn(`question ${q.id}: no correct options`);
}
const dupQ = practiceQuestions.length - questionIds.size;
if (dupQ > 0) warn(`${dupQ} duplicate question ids`);

// Lessons
for (const l of lessons) {
  if (!domainIds.has(l.domainId)) warn(`lesson ${l.id}: bad domainId ${l.domainId}`);
  if (!questionIds.has(l.examQuestionId)) {
    warn(`lesson ${l.id}: examQuestionId "${l.examQuestionId}" not found in question bank`);
  }
  if (l.handsOn.linkedLabId && !labIds.has(l.handsOn.linkedLabId)) {
    warn(`lesson ${l.id}: linkedLabId "${l.handsOn.linkedLabId}" not found in labs`);
  }
  if (lessonIds.size && l.tradeOffs.length === 0) warn(`lesson ${l.id}: empty tradeOffs`);
}
const dupL = lessons.length - lessonIds.size;
if (dupL > 0) warn(`${dupL} duplicate lesson ids`);

// Labs
for (const lb of labs) {
  for (const d of lb.domainIds) {
    if (!domainIds.has(d)) warn(`lab ${lb.id}: bad domainId ${d}`);
  }
  if (lb.steps.length === 0) warn(`lab ${lb.id}: no steps`);
}
const dupLab = labs.length - labIds.size;
if (dupLab > 0) warn(`${dupLab} duplicate lab ids`);

// Scenarios
for (const s of scenarios) {
  const choiceIds = new Set(s.choices.map((c) => c.id));
  if (!choiceIds.has(s.correctChoiceId)) {
    warn(`scenario ${s.id}: correctChoiceId ${s.correctChoiceId} not in choices`);
  }
  for (const c of s.choices) {
    if (!(c.id in s.choiceExplanations)) {
      warn(`scenario ${s.id}: missing choiceExplanations[${c.id}]`);
    }
  }
  if (!domainIds.has(s.domainId)) warn(`scenario ${s.id}: bad domainId ${s.domainId}`);
}

// Flashcards
const flashIds = new Set(flashcards.map((f) => f.id));
if (flashIds.size !== flashcards.length) warn("duplicate flashcard ids");
for (const f of flashcards) {
  if (!domainIds.has(f.domainId)) warn(`flashcard ${f.id}: bad domainId ${f.domainId}`);
}

// Weekly tasks + roadmap weeks
const taskWeeks = new Set(weeklyTasks.map((t) => t.week));
for (const w of roadmapWeeks) {
  if (!taskWeeks.has(w.week)) warn(`roadmap week ${w.week}: no weekly tasks defined`);
}
for (const t of weeklyTasks) {
  if (!taskWeeks.has(t.week)) continue;
}
for (const t of weeklyTasks) {
  if (t.href?.startsWith("/") && !/^\/(certification|diagnostic|domains|labs|mock-exam|patterns|practice|projects|resources|roadmap|scenarios|flashcards|progress)(\/|$)/.test(t.href)) {
    warn(`weekly task ${t.id}: suspicious internal href ${t.href}`);
  }
}

// Patterns
if (patternIds.size !== patterns.length) warn("duplicate pattern ids");

// Diagnostic ids used on /diagnostic page are checked via grep separately.

// Per-domain coverage summary
console.log("\nCoverage:");
for (const id of DOMAIN_IDS as readonly DomainId[]) {
  console.log(
    `  D${domains.find((d) => d.id === id)?.number}: lessons=${lessons.filter((l) => l.domainId === id).length} questions=${practiceQuestions.filter((q) => q.domainId === id).length} labs=${labs.filter((l) => l.domainIds.includes(id)).length} flashcards=${flashcards.filter((f) => f.domainId === id).length}`
  );
}

console.log(`\nTotals: lessons=${lessons.length} questions=${practiceQuestions.length} labs=${labs.length} scenarios=${scenarios.length} flashcards=${flashcards.length} tasks=${weeklyTasks.length} patterns=${patterns.length}`);

if (errors.length) {
  console.error(`\n${errors.length} content error(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("\nAll content integrity checks passed.");
