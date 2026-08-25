"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { searchContent, type SearchResult } from "@/lib/search";

const typeIcons: Record<SearchResult["type"], string> = {
  lesson: "📖",
  question: "❓",
  pattern: "🔷",
  lab: "🧪",
  project: "📁",
  resource: "🔗",
};

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef(query);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const doSearch = useCallback(() => {
    if (!queryRef.current.trim()) {
      setResults([]);
      return;
    }
    setResults(searchContent(queryRef.current));
  }, []);

  useEffect(() => {
    queryRef.current = query;
    const timer = setTimeout(doSearch, 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-auto mt-20 max-w-xl px-4">
        <div className="rounded-2xl border border-line bg-panel shadow-2xl">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0 text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, patterns, questions…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:inline">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-muted hover:text-foreground lg:hidden"
            >
              ✕
            </button>
          </div>

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.slice(0, 10).map((r, i) => (
                <li key={`${r.url}-${i}`}>
                  <Link
                    href={r.url}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-panel-2"
                  >
                    <span>{typeIcons[r.type]}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {r.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {r.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim() && results.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              No results found
            </p>
          )}

          {!query.trim() && (
            <p className="px-5 py-8 text-center text-sm text-muted">
              Start typing to search across all content…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
