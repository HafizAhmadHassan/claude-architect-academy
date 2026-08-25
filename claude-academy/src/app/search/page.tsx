"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { searchContent, type SearchResult } from "@/lib/search";

const typeIcons: Record<SearchResult["type"], string> = {
  lesson: "📖",
  question: "❓",
  pattern: "🔷",
  lab: "🧪",
  project: "📁",
  resource: "🔗",
};

const typeColors: Record<SearchResult["type"], string> = {
  lesson: "text-accent",
  question: "text-blue",
  pattern: "text-emerald-500",
  lab: "text-amber-500",
  project: "text-pink-500",
  resource: "text-muted",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResults(searchContent(query));
    setSearched(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Search the Academy"
        intro="Find lessons, practice questions, patterns, labs, and more."
      />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for topics, patterns, lessons…"
            className="flex-1 rounded-xl border border-line bg-panel px-5 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Search
          </button>
        </form>

        {searched && results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-line bg-panel p-10 text-center text-muted">
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-2 text-sm">
              Try different keywords or browse the{" "}
              <button
                type="button"
                onClick={() => router.push("/domains")}
                className="text-accent hover:underline"
              >
                domains
              </button>{" "}
              directly.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
              {query}&rdquo;
            </p>
            <ul className="mt-4 space-y-3">
              {results.map((r, i) => (
                <li key={`${r.url}-${i}`}>
                  <a
                    href={r.url}
                    className="block rounded-xl border border-line bg-panel p-5 transition-colors hover:border-accent/30"
                  >
                    <div className="flex items-center gap-2">
                      <span>{typeIcons[r.type]}</span>
                      <span
                        className={`text-xs font-bold uppercase ${typeColors[r.type]}`}
                      >
                        {r.type}
                      </span>
                    </div>
                    <p className="mt-2 font-medium">{r.title}</p>
                    <p className="mt-1 text-sm text-muted line-clamp-2">
                      {r.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
