"use client";

import { useSyncExternalStore } from "react";
import { isBookmarked as checkBookmarked } from "@/lib/bookmarks";

function subscribe(callback: () => void) {
  window.addEventListener("caa-bookmarks", callback);
  return () => window.removeEventListener("caa-bookmarks", callback);
}

function getSnapshot(url: string): boolean {
  return checkBookmarked(url);
}

export function BookmarkButton({
  url,
  title,
  type,
  domain,
}: {
  url: string;
  title: string;
  type: "lesson" | "resource" | "pattern" | "lab";
  domain?: string;
}) {
  const saved = useSyncExternalStore(
    subscribe,
    () => getSnapshot(url),
    () => false
  );

  function toggle() {
    if (saved) {
      import("@/lib/bookmarks").then(({ removeBookmark }) => removeBookmark(url));
    } else {
      import("@/lib/bookmarks").then(({ addBookmark }) => addBookmark({ url, title, type, domain }));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      title={saved ? "Remove bookmark" : "Bookmark this"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        saved
          ? "border-accent/40 bg-accent-soft text-accent"
          : "border-line text-muted hover:border-accent/30 hover:text-accent"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
