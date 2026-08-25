export interface Comment {
  id: string;
  lessonKey: string;
  authorName: string;
  authorAvatarColor: string;
  content: string;
  createdAt: string;
}

const KEY = "caa-discussions-v1";

export function loadComments(lessonKey: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const all: Comment[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    return all
      .filter((c) => c.lessonKey === lessonKey)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function addComment(
  lessonKey: string,
  authorName: string,
  authorAvatarColor: string,
  content: string
): Comment {
  const all: Comment[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  })();

  const comment: Comment = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    lessonKey,
    authorName,
    authorAvatarColor,
    content,
    createdAt: new Date().toISOString(),
  };

  all.push(comment);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("caa-discussions"));
  } catch {}

  return comment;
}

export function deleteComment(commentId: string): void {
  try {
    const all: Comment[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(
      KEY,
      JSON.stringify(all.filter((c) => c.id !== commentId))
    );
    window.dispatchEvent(new Event("caa-discussions"));
  } catch {}
}
