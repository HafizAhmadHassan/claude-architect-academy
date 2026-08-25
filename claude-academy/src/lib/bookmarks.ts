export interface Bookmark {
  id: string;
  type: "lesson" | "resource" | "pattern" | "lab";
  title: string;
  url: string;
  domain?: string;
  createdAt: string;
}

const KEY = "caa-bookmarks-v1";

export function loadBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
    window.dispatchEvent(new Event("caa-bookmarks"));
  } catch {}
}

export function addBookmark(
  bookmark: Omit<Bookmark, "id" | "createdAt">
): Bookmark {
  const existing = loadBookmarks();
  if (existing.some((b) => b.url === bookmark.url)) {
    return existing.find((b) => b.url === bookmark.url)!;
  }
  const newBookmark: Bookmark = {
    ...bookmark,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  saveBookmarks([...existing, newBookmark]);
  return newBookmark;
}

export function removeBookmark(url: string): void {
  saveBookmarks(loadBookmarks().filter((b) => b.url !== url));
}

export function isBookmarked(url: string): boolean {
  return loadBookmarks().some((b) => b.url === url);
}
