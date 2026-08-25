"use client";

import { useState, useRef, useCallback, useSyncExternalStore } from "react";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

function subscribeStudyTime(callback: () => void) {
  window.addEventListener("caa-study-time", callback);
  return () => window.removeEventListener("caa-study-time", callback);
}

function getStudyTimeSnapshot(): number {
  try {
    return parseInt(localStorage.getItem("caa-study-time") || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function StudyTimer() {
  const [seconds, setSeconds] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const totalStudyTime = useSyncExternalStore(subscribeStudyTime, getStudyTimeSnapshot, () => 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  function startTimer() {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          stopTimer();
          setIsRunning(false);
          if (mode === "focus") {
            try {
              const total = (parseInt(localStorage.getItem("caa-study-time") || "0", 10) || 0) + FOCUS_MINUTES * 60;
              localStorage.setItem("caa-study-time", String(total));
              window.dispatchEvent(new Event("caa-study-time"));
            } catch {}
            setMode("break");
            return BREAK_MINUTES * 60;
          }
          setMode("focus");
          return FOCUS_MINUTES * 60;
        }
        return prev - 1;
      });
    }, 1000);
    setIsRunning(true);
  }

  function toggle() {
    if (isRunning) {
      stopTimer();
      setIsRunning(false);
    } else {
      startTimer();
    }
  }

  function reset() {
    stopTimer();
    setIsRunning(false);
    setSeconds(FOCUS_MINUTES * 60);
    setMode("focus");
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalMinutes = Math.floor(totalStudyTime / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      <h2 className="text-lg font-bold">Study Timer</h2>
      <p className="mt-1 text-sm text-muted">
        Focus mode — 25 min study, 5 min break (Pomodoro technique)
      </p>

      <div className="mt-6 text-center">
        <div
          className={`inline-flex items-center gap-1 rounded-2xl px-8 py-4 font-mono text-5xl font-bold tracking-tight ${
            mode === "focus"
              ? "bg-accent-soft text-accent"
              : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <p className="mt-2 text-sm text-muted">
          {mode === "focus" ? "🎯 Focus time" : "☕ Break time"}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${
            isRunning ? "bg-amber-500" : "bg-accent-strong"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-line px-5 py-2.5 text-sm text-muted hover:bg-panel-2"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-panel-2 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Total study time
        </p>
        <p className="mt-1 text-2xl font-bold">
          {totalHours > 0 ? `${totalHours}h ` : ""}{remainingMinutes}m
        </p>
      </div>
    </div>
  );
}
