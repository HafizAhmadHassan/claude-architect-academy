"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SearchModal } from "@/components/search-modal";

const primaryNav = [
  { href: "/certification", label: "Certification" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/domains", label: "Domains" },
  { href: "/labs", label: "Labs" },
  { href: "/practice", label: "Practice Questions" },
];

const secondaryNav = [
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/mock-exam", label: "Mock Exam" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/patterns", label: "Architecture Patterns" },
  { href: "/projects", label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/progress", label: "Progress" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/notes", label: "My Notes" },
  { href: "/achievements", label: "Achievements" },
];

const allNav = [...primaryNav, ...secondaryNav];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label="Claude Architect Academy home"
          >
            <LogoMark />
            <span className="hidden sm:inline">Claude Architect Academy</span>
            <span className="sm:hidden">CAA</span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1 text-sm">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname?.startsWith(item.href) ? "page" : undefined
                    }
                    className={`rounded-md px-3 py-2 transition-colors hover:bg-panel-2 ${
                      pathname?.startsWith(item.href)
                        ? "text-accent"
                        : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="rounded-md px-3 py-2 text-muted transition-colors group-hover:bg-panel-2 group-focus-within:bg-panel-2"
                >
                  More ▾
                </button>
                <div className="invisible absolute right-0 top-full w-56 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="rounded-xl border border-line bg-panel p-1.5 shadow-lg">
                    {secondaryNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-muted transition-colors hover:bg-panel-2 hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-foreground"
              title="Search (⌘K)"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <ThemeToggle />

            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-line px-2 py-1.5 transition-colors hover:bg-panel-2"
                aria-label="Your profile"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? (
                  <>
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-t border-line bg-panel lg:hidden"
          >
            <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-4 sm:px-6">
              {allNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block rounded-lg px-3 py-2.5 ${
                      pathname?.startsWith(item.href)
                        ? "bg-accent-soft text-accent"
                        : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/search"
                  onClick={close}
                  className="block rounded-lg px-3 py-2.5 text-muted"
                >
                  🔍 Search
                </Link>
              </li>
              {!user && (
                <>
                  <li className="mt-2 border-t border-line pt-2">
                    <Link
                      href="/login"
                      onClick={close}
                      className="block rounded-lg bg-accent-soft px-3 py-2.5 text-center font-semibold text-accent"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      onClick={close}
                      className="block rounded-lg border border-line px-3 py-2.5 text-center text-muted"
                    >
                      Create account
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li className="mt-2 border-t border-line pt-2">
                  <Link
                    href="/profile"
                    onClick={close}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-muted"
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1" y="1" width="30" height="30" rx="8" fill="var(--accent-strong)" />
      <path
        d="M22 11.5c-.9-1.9-2.8-3.2-5-3.2a5.7 5.7 0 0 0 0 11.4h.02M10.5 16H8m12 4.5c-.9 1.9-2.8 3.2-5 3.2"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThemeToggle() {
  function toggle() {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("caa-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark or light mode"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-foreground"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="hidden dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
