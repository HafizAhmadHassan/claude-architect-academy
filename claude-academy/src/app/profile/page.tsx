"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { logout, updateProfile } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { loadProgress, computeStreak } from "@/lib/progress";
import { useBookmarks } from "@/lib/bookmarks-react";
import { useNotes } from "@/lib/notes-react";
import { useAchievedIds } from "@/lib/achievements-react";

const AVATAR_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#d97706",
  "#dc2626", "#0891b2", "#4f46e5", "#be185d",
];

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const bookmarks = useBookmarks();
  const notes = useNotes();
  const achievements = useAchievedIds();

  const stats = useMemo(() => {
    if (!user) return null;
    const progress = loadProgress();
    return {
      lessons: progress.completedLessons.length,
      tasks: progress.completedTasks.length,
      streak: computeStreak(progress.activeDays),
      bookmarks: bookmarks.length,
      notes: notes.length,
      achievements: achievements.size,
      practiceRuns: progress.practiceRuns.length,
      mockRuns: progress.mockRuns.length,
    };
  }, [user, bookmarks, notes, achievements]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted">
        Loading…
      </div>
    );
  }

  function handleNameSave(name: string) {
    if (name.trim().length < 2) return;
    updateProfile({ name: name.trim() });
    refresh();
  }

  function handleColorChange(color: string) {
    updateProfile({ avatarColor: color });
    refresh();
  }

  function handleLogout() {
    logout();
    refresh();
    router.push("/");
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your Profile"
        intro="Manage your account settings and view your study statistics."
      />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <ProfileCard
          user={user}
          onNameSave={handleNameSave}
          onColorChange={handleColorChange}
        />

        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Lessons" value={stats.lessons} />
            <StatCard label="Tasks" value={stats.tasks} />
            <StatCard label="Streak" value={`${stats.streak}d`} />
            <StatCard label="Achievements" value={stats.achievements} />
            <StatCard label="Bookmarks" value={stats.bookmarks} />
            <StatCard label="Notes" value={stats.notes} />
            <StatCard label="Practice sets" value={stats.practiceRuns} />
            <StatCard label="Mock exams" value={stats.mockRuns} />
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/5"
          >
            Sign out
          </button>
        </div>
      </section>
    </>
  );
}

function ProfileCard({
  user,
  onNameSave,
  onColorChange,
}: {
  user: { name: string; email: string; avatarColor: string };
  onNameSave: (name: string) => void;
  onColorChange: (color: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);

  return (
    <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      <div className="flex items-center gap-5">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: user.avatarColor }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border border-line bg-panel-2 px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => { onNameSave(name); setEditing(false); }}
                className="rounded-xl bg-accent-strong px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setName(user.name); }}
                className="rounded-xl border border-line px-4 py-2 text-sm text-muted hover:bg-panel-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted">{user.email}</p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-1 text-xs font-medium text-accent hover:underline"
              >
                Edit name
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Avatar color
        </p>
        <div className="mt-2 flex gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColorChange(c)}
              className={`h-8 w-8 rounded-full transition-transform ${
                user.avatarColor === c ? "scale-125 ring-2 ring-foreground" : ""
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
