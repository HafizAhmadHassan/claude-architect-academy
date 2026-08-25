import type { ProgressState } from "@/lib/progress";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "learning" | "practice" | "streak" | "special";
  condition: (progress: ProgressState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "01",
    category: "learning",
    condition: (p) => p.completedLessons.length >= 1,
  },
  {
    id: "five-lessons",
    title: "Getting Started",
    description: "Complete 5 lessons",
    icon: "05",
    category: "learning",
    condition: (p) => p.completedLessons.length >= 5,
  },
  {
    id: "ten-lessons",
    title: "Knowledge Seeker",
    description: "Complete 10 lessons",
    icon: "10",
    category: "learning",
    condition: (p) => p.completedLessons.length >= 10,
  },
  {
    id: "all-lessons",
    title: "Domain Master",
    description: "Complete all lessons",
    icon: "★",
    category: "learning",
    condition: (p) => p.completedLessons.length >= 20,
  },
  {
    id: "first-task",
    title: "Task Tackler",
    description: "Complete your first weekly task",
    icon: "✓",
    category: "learning",
    condition: (p) => p.completedTasks.length >= 1,
  },
  {
    id: "ten-tasks",
    title: "Task Master",
    description: "Complete 10 weekly tasks",
    icon: "◆",
    category: "learning",
    condition: (p) => p.completedTasks.length >= 10,
  },
  {
    id: "first-practice",
    title: "Practice Begins",
    description: "Complete your first practice set",
    icon: "P",
    category: "practice",
    condition: (p) => p.practiceRuns.length >= 1,
  },
  {
    id: "practice-pro",
    title: "Practice Pro",
    description: "Complete 5 practice sets",
    icon: "5×",
    category: "practice",
    condition: (p) => p.practiceRuns.length >= 5,
  },
  {
    id: "perfect-practice",
    title: "Flawless",
    description: "Score 100% on a practice set",
    icon: "100",
    category: "practice",
    condition: (p) =>
      p.practiceRuns.some((r) => r.total > 0 && r.correct === r.total),
  },
  {
    id: "first-mock",
    title: "Mock contender",
    description: "Complete your first mock exam",
    icon: "M",
    category: "practice",
    condition: (p) => p.mockRuns.length >= 1,
  },
  {
    id: "mock-pass",
    title: "Exam Ready",
    description: "Pass a mock exam (720+ scaled score)",
    icon: "★",
    category: "practice",
    condition: (p) =>
      p.mockRuns.some((r) => (r.scaledScore ?? 0) >= 720),
  },
  {
    id: "flashcard-first",
    title: "Card Shark",
    description: "Know 10 flashcards",
    icon: "F",
    category: "practice",
    condition: (p) =>
      Object.values(p.flashcards).filter((s) => s === "known").length >= 10,
  },
  {
    id: "flashcard-master",
    title: "Flashcard Master",
    description: "Know all flashcards",
    icon: "🃏",
    category: "practice",
    condition: (p) =>
      Object.values(p.flashcards).filter((s) => s === "known").length >= 30,
  },
  {
    id: "streak-3",
    title: "Consistent",
    description: "Maintain a 3-day study streak",
    icon: "3",
    category: "streak",
    condition: (p) => {
      const streak = computeSimpleStreak(p.activeDays);
      return streak >= 3;
    },
  },
  {
    id: "streak-7",
    title: "Dedicated",
    description: "Maintain a 7-day study streak",
    icon: "7",
    category: "streak",
    condition: (p) => {
      const streak = computeSimpleStreak(p.activeDays);
      return streak >= 7;
    },
  },
  {
    id: "diagnostic-done",
    title: "Self-Aware",
    description: "Complete the diagnostic test",
    icon: "D",
    category: "special",
    condition: (p) => p.diagnostic !== null,
  },
  {
    id: "diagnostic-perfect",
    title: "Natural Talent",
    description: "Score 100% on the diagnostic",
    icon: "★",
    category: "special",
    condition: (p) =>
      p.diagnostic !== null &&
      p.diagnostic.total > 0 &&
      p.diagnostic.correct === p.diagnostic.total,
  },
];

function computeSimpleStreak(activeDays: string[]): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays);
  const today = new Date().toISOString().slice(0, 10);
  let cursor = today;
  if (!set.has(cursor)) {
    const d = new Date(cursor + "T00:00:00");
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
    if (!set.has(cursor)) return 0;
  }
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    const d = new Date(cursor + "T00:00:00");
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return streak;
}

export function getEarnedAchievements(progress: ProgressState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.condition(progress));
}

const ACHIEVED_KEY = "caa-achievements-v1";

export function loadAchievedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACHIEVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAchievedIds(ids: string[]): void {
  try {
    localStorage.setItem(ACHIEVED_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("caa-achievements"));
  } catch {}
}

export function checkNewAchievements(progress: ProgressState): Achievement[] {
  const earned = getEarnedAchievements(progress);
  const known = new Set(loadAchievedIds());
  const newOnes = earned.filter((a) => !known.has(a.id));
  if (newOnes.length > 0) {
    saveAchievedIds([...known, ...newOnes.map((a) => a.id)]);
  }
  return newOnes;
}
