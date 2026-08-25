"use client";

import { useEffect, useMemo, useState } from "react";
import type { DomainId } from "@/lib/content/types";
import { domainMap, domains } from "@/lib/content/domains";
import type { Flashcard } from "@/lib/content/flashcards";
import { loadProgress, updateProgress } from "@/lib/progress";
import { Badge } from "@/components/ui";

type Filter = "all" | DomainId;
type Mode = "all" | "review";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [domainFilter, setDomainFilter] = useState<Filter>("all");
  const [mode, setMode] = useState<Mode>("all");
  const [known, setKnown] = useState<string[]>([]);
  const [reviewLater, setReviewLater] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deckKey = `${domainFilter}|${mode}`;
  const [renderedKey, setRenderedKey] = useState(deckKey);
  if (renderedKey !== deckKey) {
    setRenderedKey(deckKey);
    setOrder([]);
    setIndex(0);
    setFlipped(false);
  }

  useEffect(() => {
    function sync() {
      const state = loadProgress();
      setKnown(
        Object.entries(state.flashcards)
          .filter(([, v]) => v === "known")
          .map(([k]) => k)
      );
      setReviewLater(
        Object.entries(state.flashcards)
          .filter(([, v]) => v === "review")
          .map(([k]) => k)
      );
    }
    sync();
    window.addEventListener("caa-progress", sync);
    return () => window.removeEventListener("caa-progress", sync);
  }, []);

  const pool = useMemo(
    () =>
      cards.filter(
        (c) =>
          (domainFilter === "all" || c.domainId === domainFilter) &&
          (mode !== "review" || reviewLater.includes(c.id))
      ),
    [cards, domainFilter, mode, reviewLater]
  );

  const activeOrder = useMemo(() => {
    if (
      order.length === pool.length &&
      order.every((id) => pool.some((c) => c.id === id))
    ) {
      return order;
    }
    // Deterministic until the mount/shuffle effect runs — keeps SSR and
    // first client render identical (avoids hydration mismatch).
    return pool.map((c) => c.id);
  }, [order, pool]);

  useEffect(() => {
    // Async so the deterministic SSR/first-render order stays intact until
    // after hydration; then each new deck gets a fresh shuffle.
    const t = setTimeout(() => setOrder(shuffle(pool.map((c) => c.id))), 0);
    return () => clearTimeout(t);
  }, [pool]);

  const cardMap = useMemo(
    () => new Map(cards.map((c) => [c.id, c])),
    [cards]
  );

  if (pool.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-panel p-10 text-center">
        <p className="font-medium">No cards in this pile.</p>
        <p className="mt-2 text-sm text-muted">
          Mark cards “Review later” while studying and they will queue up here.
        </p>
        <button
          type="button"
          onClick={() => setMode("all")}
          className="mt-5 rounded-xl border border-line px-4 py-2 text-sm hover:border-accent/60"
        >
          Back to full deck
        </button>
      </div>
    );
  }

  const current = cardMap.get(activeOrder[index % activeOrder.length])!;

  function rate(kind: "known" | "reviewLater" | "again") {
    updateProgress((s) => {
      if (kind === "again") return s;
      const next = { ...s.flashcards };
      next[current.id] = kind === "known" ? "known" : "review";
      return { ...s, flashcards: next };
    });
    setFlipped(false);
    setIndex((i) => (i + 1) % activeOrder.length);
  }

  const domain = domainMap[current.domainId];
  const isKnown = known.includes(current.id);
  const deckProgress = Math.round(
    ((index + 1) / activeOrder.length) * 100
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={domainFilter === "all"} onClick={() => setDomainFilter("all")}>
            All domains ({cards.length})
          </FilterChip>
          {domains.map((d) => (
            <FilterChip
              key={d.id}
              active={domainFilter === d.id}
              onClick={() => setDomainFilter(d.id)}
            >
              D{d.number}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-2">
          <FilterChip active={mode === "all"} onClick={() => setMode("all")}>
            Full deck
          </FilterChip>
          <FilterChip active={mode === "review"} onClick={() => setMode("review")}>
            Review pile ({reviewLater.length})
          </FilterChip>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-panel-2">
        <div
          className="h-full rounded-full bg-accent-strong transition-all"
          style={{ width: `${deckProgress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question side" : "Reveal answer"}
        className={`mt-6 block w-full rounded-2xl border p-8 text-left transition-colors sm:p-10 ${
          flipped
            ? "border-blue/60 bg-panel-2"
            : "border-accent/50 bg-panel hover:bg-panel-2"
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Card {(index % activeOrder.length) + 1} of {activeOrder.length} ·{" "}
          {isKnown ? "Known ✓" : flipped ? "Answer" : "Question"}
        </span>
        <p className="mt-4 text-xl font-semibold leading-relaxed sm:text-2xl">
          {flipped ? current.back : current.front}
        </p>
        <span className="mt-6 block text-sm text-muted">
          {flipped ? "Click to flip back" : "Think, then click to reveal"}
        </span>
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="accent">D{domain.number}</Badge>
        <Badge>{domain.name}</Badge>
        {current.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => rate("reviewLater")}
          className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-600 transition-opacity hover:opacity-85 dark:text-amber-400"
        >
          ⟳ Review later
        </button>
        <button
          type="button"
          onClick={() => rate("again")}
          className="rounded-xl border border-line bg-panel px-4 py-3 text-sm font-semibold transition-colors hover:border-accent/60"
        >
          ↻ Again
        </button>
        <button
          type="button"
          onClick={() => rate("known")}
          className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 transition-opacity hover:opacity-85 dark:text-emerald-400"
        >
          ✓ Known
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Known overall:{" "}
        <strong className="text-emerald-600 dark:text-emerald-400">
          {known.length}
        </strong>{" "}
        / {cards.length} cards
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-muted hover:border-accent/50"
      }`}
    >
      {children}
    </button>
  );
}
