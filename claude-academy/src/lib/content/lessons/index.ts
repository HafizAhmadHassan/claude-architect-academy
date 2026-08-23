import type { DomainId, Lesson } from "../types";
import { agenticLoopLesson } from "./agentic-loop";
import { domain1Lessons } from "./domain1-extra";
import { domain2Lessons } from "./domain2";
import { domain3Lessons } from "./domain3";
import { domain4Lessons } from "./domain4";
import { domain5Lessons } from "./domain5";

export const lessons: Lesson[] = [
  agenticLoopLesson,
  ...domain1Lessons,
  ...domain2Lessons,
  ...domain3Lessons,
  ...domain4Lessons,
  ...domain5Lessons,
];

export function getLesson(
  domainId: string,
  lessonId: string
): Lesson | undefined {
  return (
    lessons.find((l) => l.id === lessonId && l.domainId === domainId) ??
    lessons.find((l) => l.id === lessonId)
  );
}

export function getLessonsForDomain(domainId: DomainId): Lesson[] {
  return lessons.filter((l) => l.domainId === domainId);
}

export const lessonCountByDomain = lessons.reduce(
  (acc, l) => {
    acc[l.domainId] = (acc[l.domainId] ?? 0) + 1;
    return acc;
  },
  {} as Record<DomainId, number>
);
