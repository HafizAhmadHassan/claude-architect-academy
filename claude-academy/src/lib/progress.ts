import type { DomainId } from "@/lib/content/types";

export interface RunRecord {
  date: string;
  correct: number;
  total: number;
  kind?: "mock" | "diagnostic";
  scaledScore?: number;
  byDomain: Partial<Record<DomainId, { correct: number; total: number }>>;
}

/** Card ID → status. Legacy string[] arrays are migrated on load. */
export type FlashcardMap = Record<string, "known" | "review">;

export interface ProgressState {
  completedTasks: string[];
  completedLessons: string[];
  practiceRuns: RunRecord[];
  mockRuns: RunRecord[];
  diagnostic: RunRecord | null;
  flashcards: FlashcardMap;
  activeDays: string[];
}

const KEY = "caa-progress-v1";

const emptyState: ProgressState = {
  completedTasks: [],
  completedLessons: [],
  practiceRuns: [],
  mockRuns: [],
  diagnostic: null,
  flashcards: {},
  activeDays: [],
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function migrateFlashcards(raw: unknown): FlashcardMap {
  const out: FlashcardMap = {};
  if (Array.isArray(raw)) {
    // legacy: { known: string[], reviewLater: string[] }
    for (const id of raw as string[]) out[id] = "known";
    return out;
  }
  if (raw && typeof raw === "object") {
    for (const [id, status] of Object.entries(
      raw as Record<string, unknown>
    )) {
      if (status === "known" || status === "review") out[id] = status;
      else if (Array.isArray(status)) {
        const mapped = id === "known" ? "known" : "review";
        for (const inner of status as string[]) out[inner] = mapped;
      } else if (typeof status === "string") {
        out[id] = status === "known" ? "known" : "review";
      }
    }
  }
  return out;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<ProgressState> & {
      flashcards?: unknown;
    };
    return { ...emptyState, ...parsed, flashcards: migrateFlashcards(parsed.flashcards) };
  } catch {
    return emptyState;
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("caa-progress"));
  } catch {}
}

export function updateProgress(
  mutate: (state: ProgressState) => ProgressState
): ProgressState {
  const next = mutate(loadProgress());
  if (!next.activeDays.includes(todayIso())) {
    next.activeDays = [...next.activeDays, todayIso()];
  }
  saveProgress(next);
  return next;
}

function addDays(dateIso: string, delta: number): string {
  const d = new Date(dateIso + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function computeStreak(activeDays: string[]): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays);
  let cursor = todayIso();
  if (!set.has(cursor)) {
    cursor = addDays(cursor, -1);
    if (!set.has(cursor)) return 0;
  }
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface DomainReadiness {
  domainId: DomainId;
  pct: number | null;
  signals: number;
}

export function computeReadiness(
  state: ProgressState,
  domainIds: DomainId[],
  lessonCountByDomain: Record<DomainId, number>
): DomainReadiness[] {
  function latestByDomain(runs: RunRecord[]) {
    const map: Partial<Record<DomainId, { c: number; t: number }>> = {};
    for (const run of runs) {
      for (const [id, s] of Object.entries(run.byDomain) as [DomainId, { correct: number; total: number }][]) {
        map[id] = { c: s.correct, t: s.total };
      }
    }
    return map;
  }

  const diag = state.diagnostic ? latestByDomain([state.diagnostic]) : {};
  const practice = latestByDomain(state.practiceRuns.slice(-5));
  const mock = latestByDomain(state.mockRuns);

  return domainIds.map((domainId) => {
    const signals: number[] = [];
    const d = diag[domainId];
    if (d && d.t > 0) signals.push((d.c / d.t) * 100);
    const p = practice[domainId];
    if (p && p.t > 0) signals.push((p.c / p.t) * 100);
    const m = mock[domainId];
    if (m && m.t > 0) signals.push((m.c / m.t) * 100);
    const total = lessonCountByDomain[domainId] ?? 0;
    if (total > 0) {
      const done = state.completedLessons.filter((l) => l.startsWith(domainId)).length;
      signals.push((done / total) * 100);
    }
    if (signals.length === 0) {
      return { domainId, pct: null, signals: 0 };
    }
    const avg = Math.round(signals.reduce((a, b) => a + b, 0) / signals.length);
    return { domainId, pct: Math.max(0, Math.min(100, avg)), signals: signals.length };
  });
}
