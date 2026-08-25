"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useNotes } from "@/lib/notes-react";
import { deleteNote } from "@/lib/notes";

export default function NotesPage() {
  const notes = useNotes();

  return (
    <>
      <PageHeader
        eyebrow="Notes"
        title="Your Study Notes"
        intro="Personal notes attached to lessons. Review and manage everything in one place."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-line bg-panel p-10 text-center text-muted">
            <p className="text-lg font-medium">No notes yet</p>
            <p className="mt-2 text-sm">
              Open any lesson and use the notes panel to jot down key insights.
            </p>
            <Link
              href="/domains"
              className="mt-4 inline-block rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse lessons
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {notes
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((note) => {
                const parts = note.lessonKey.split("/");
                const domainId = parts[0];
                const lessonId = parts[1];
                return (
                  <li
                    key={note.id}
                    className="rounded-xl border border-line bg-panel p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/domains/${domainId}/lessons/${lessonId}`}
                          className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
                        >
                          {domainId} / {lessonId}
                        </Link>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                          {note.content}
                        </p>
                        <p className="mt-3 text-xs text-muted">
                          Updated {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteNote(note.lessonKey);
                        }}
                        className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:border-red-500/40 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </section>
    </>
  );
}
