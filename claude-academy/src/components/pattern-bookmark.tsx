"use client";

import { useSyncExternalStore } from "react";
import { isBookmarked as checkBookmarked } from "@/lib/bookmarks";

function subscribe(callback: () => void) {
  window.addEventListener("caa-bookmarks", callback);
  return () => window.removeEventListener("caa-bookmarks", callback);
}

export function PatternBookmark({ patternId, name }: { patternId: string; name: string }) {
  const url = `/patterns#${patternId}`;
  const saved = useSyncExternalStore(
    subscribe,
    () => checkBookmarked(url),
    () => false
  );

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      import("@/lib/bookmarks").then(({ removeBookmark }) => removeBookmark(url));
    } else {
      import("@/lib/bookmarks").then(({ addBookmark }) => addBookmark({ url, title: name, type: "pattern" }));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Bookmark pattern"}
      className={`ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
        saved
          ? "border-accent/40 bg-accent-soft text-accent"
          : "border-line text-muted hover:text-accent"
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
