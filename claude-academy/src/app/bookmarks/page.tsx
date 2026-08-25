"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { useBookmarks } from "@/lib/bookmarks-react";
import { removeBookmark, type Bookmark } from "@/lib/bookmarks";

const typeLabels: Record<Bookmark["type"], string> = {
  lesson: "Lesson",
  resource: "Resource",
  pattern: "Pattern",
  lab: "Lab",
};

const typeColors: Record<Bookmark["type"], string> = {
  lesson: "text-accent",
  resource: "text-blue",
  pattern: "text-emerald-500",
  lab: "text-amber-500",
};

export default function BookmarksPage() {
  const bookmarks = useBookmarks();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? bookmarks : bookmarks.filter((b) => b.type === filter);

  return (
    <>
      <PageHeader
        eyebrow="Bookmarks"
        title="Your Saved Items"
        intro="Quick access to lessons, resources, patterns, and labs you've saved for later."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {["all", "lesson", "resource", "pattern", "lab"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === t
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:bg-panel-2"
              }`}
            >
              {t === "all" ? "All" : typeLabels[t as Bookmark["type"]]}
              {t !== "all" && (
                <span className="ml-1.5">
                  {bookmarks.filter((b) => b.type === t).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-panel p-10 text-center text-muted">
            <p className="text-lg font-medium">No bookmarks yet</p>
            <p className="mt-2 text-sm">
              Click the bookmark icon on any lesson, pattern, or resource to save
              it here.
            </p>
            <Link
              href="/domains"
              className="mt-4 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse domains
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {filtered.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-panel p-4 transition-colors hover:border-accent/30"
              >
                <Link href={b.url} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase ${typeColors[b.type]}`}
                    >
                      {typeLabels[b.type]}
                    </span>
                    {b.domain && (
                      <span className="text-xs text-muted">· {b.domain}</span>
                    )}
                  </div>
                  <p className="mt-1 truncate font-medium">{b.title}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    removeBookmark(b.url);
                  }}
                  className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:border-red-500/40 hover:text-red-500"
                  aria-label={`Remove bookmark for ${b.title}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
