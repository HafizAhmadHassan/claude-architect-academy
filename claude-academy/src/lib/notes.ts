export interface Note {
  id: string;
  lessonKey: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const KEY = "caa-notes-v1";

export function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
    window.dispatchEvent(new Event("caa-notes"));
  } catch {}
}

export function getNoteForLesson(lessonKey: string): Note | null {
  return loadNotes().find((n) => n.lessonKey === lessonKey) || null;
}

export function saveNote(lessonKey: string, content: string): Note {
  const notes = loadNotes();
  const existing = notes.findIndex((n) => n.lessonKey === lessonKey);
  const now = new Date().toISOString();

  if (existing !== -1) {
    notes[existing] = {
      ...notes[existing],
      content,
      updatedAt: now,
    };
    saveNotes(notes);
    return notes[existing];
  }

  const note: Note = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    lessonKey,
    content,
    createdAt: now,
    updatedAt: now,
  };
  saveNotes([...notes, note]);
  return note;
}

export function deleteNote(lessonKey: string): void {
  saveNotes(loadNotes().filter((n) => n.lessonKey !== lessonKey));
}
