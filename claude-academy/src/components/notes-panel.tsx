"use client";

import { useSyncExternalStore, useState } from "react";
import { getNoteForLesson, saveNote, deleteNote } from "@/lib/notes";

function subscribeNotes(callback: () => void) {
  window.addEventListener("caa-notes", callback);
  return () => window.removeEventListener("caa-notes", callback);
}

export function NotesPanel({ lessonKey }: { lessonKey: string }) {
  const existing = useSyncExternalStore(
    subscribeNotes,
    () => {
      const note = getNoteForLesson(lessonKey);
      return note ? note.content : "";
    },
    () => ""
  );

  const [note, setNote] = useState(existing);
  const [saved, setSaved] = useState(false);

  // Sync from external store when lessonKey changes
  if (existing && !note && !saved) {
    setNote(existing);
  }

  function handleSave() {
    if (!note.trim()) return;
    saveNote(lessonKey, note);
    setSaved(true);
  }

  function handleDelete() {
    deleteNote(lessonKey);
    setNote("");
    setSaved(false);
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted">
          Your Notes
        </h3>
        {(existing || saved) && (
          <span className="text-xs text-accent">Saved locally</span>
        )}
      </div>
      <textarea
        value={note}
        onChange={(e) => { setNote(e.target.value); setSaved(false); }}
        placeholder="Jot down key insights, questions, or connections…"
        rows={4}
        className="mt-3 w-full resize-y rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-accent"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!note.trim()}
          className="rounded-xl bg-accent-strong px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          {saved ? "Saved ✓" : "Save note"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-line px-4 py-2 text-xs text-muted hover:border-red-500/40 hover:text-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
