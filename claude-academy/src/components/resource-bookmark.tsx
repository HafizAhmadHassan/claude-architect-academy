"use client";

import { useSyncExternalStore } from "react";
import { isBookmarked as checkBookmarked } from "@/lib/bookmarks";

function subscribe(callback: () => void) {
  window.addEventListener("caa-bookmarks", callback);
  return () => window.removeEventListener("caa-bookmarks", callback);
}

function ResourceBookmark({ url, label }: { url: string; label: string }) {
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
      import("@/lib/bookmarks").then(({ addBookmark }) => addBookmark({ url, title: label, type: "resource" }));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Bookmark resource"}
      className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase transition-colors ${
        saved
          ? "border-accent/40 bg-accent-soft text-accent"
          : "border-line text-muted hover:text-accent"
      }`}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}

export { ResourceBookmark };
