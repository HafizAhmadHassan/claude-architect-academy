"use client";

import { useSyncExternalStore, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  addComment,
  deleteComment,
  type Comment,
} from "@/lib/discussions";

function subscribeDiscussions(callback: () => void) {
  window.addEventListener("caa-discussions", callback);
  return () => window.removeEventListener("caa-discussions", callback);
}

function getCommentsSnapshot(lessonKey: string): string {
  try {
    const all: Comment[] = JSON.parse(localStorage.getItem("caa-discussions-v1") || "[]");
    return JSON.stringify(
      all
        .filter((c) => c.lessonKey === lessonKey)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  } catch {
    return "[]";
  }
}

export function CommentsSection({ lessonKey }: { lessonKey: string }) {
  const { user } = useAuth();
  const raw = useSyncExternalStore(
    subscribeDiscussions,
    () => getCommentsSnapshot(lessonKey),
    () => "[]"
  );
  const comments: Comment[] = JSON.parse(raw);
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    addComment(lessonKey, user.name, user.avatarColor, content);
    setContent("");
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
        Discussion ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts or ask a question…"
            rows={3}
            className="w-full resize-y rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="mt-2 rounded-xl bg-accent-strong px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            Post comment
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Sign in to join the discussion.
        </p>
      )}

      <ul className="mt-5 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: c.authorAvatarColor }}
            >
              {c.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{c.authorName}</span>
                <span className="text-xs text-muted">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
                {user && user.name === c.authorName && (
                  <button
                    type="button"
                    onClick={() => deleteComment(c.id)}
                    className="text-xs text-muted hover:text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {c.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
