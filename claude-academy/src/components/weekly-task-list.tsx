"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { weeklyTasks, type WeeklyTask } from "@/lib/content/weekly-tasks";
import { loadProgress, updateProgress } from "@/lib/progress";

export function WeeklyTaskList() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    function sync() {
      setDone(loadProgress().completedTasks);
    }
    sync();
    window.addEventListener("caa-progress", sync);
    return () => window.removeEventListener("caa-progress", sync);
  }, []);

  const byWeek = useMemo(() => {
    const map = new Map<number, WeeklyTask[]>();
    for (const t of weeklyTasks) {
      map.set(t.week, [...(map.get(t.week) ?? []), t]);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  function toggle(id: string) {
    const isDone = done.includes(id);
    updateProgress((s) => ({
      ...s,
      completedTasks: isDone
        ? s.completedTasks.filter((t) => t !== id)
        : [...s.completedTasks, id],
    }));
  }

  return (
    <div>
      {byWeek.map(([week, tasks]) => {
        const weekDone = tasks.filter((t) => done.includes(t.id)).length;
        return (
          <section key={week} className="mt-8 first:mt-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Week {week}</h2>
              <span className="font-mono text-sm text-muted">
                {weekDone}/{tasks.length}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {tasks.map((task) => {
                const checked = done.includes(task.id);
                return (
                  <li key={task.id}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                        checked
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-line bg-panel hover:border-accent/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(task.id)}
                        className="mt-0.5 h-4 w-4 accent-emerald-500"
                      />
                      <span>
                        <span
                          className={`text-sm font-medium ${
                            checked ? "line-through opacity-60" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.minutes > 0 && (
                          <span className="ml-2 text-xs text-muted">
                            ~{task.minutes} min
                          </span>
                        )}
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {task.detail}
                        </p>
                        {task.href?.startsWith("/") && (
                          <Link
                            href={task.href}
                            className="mt-2 inline-block text-xs font-semibold text-accent hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open in academy →
                          </Link>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
