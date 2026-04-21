"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    href: "/",
    label: "Doctors",
    isActive: (pathname: string) =>
      pathname === "/" || pathname.startsWith("/book"),
  },
  {
    href: "/appointments",
    label: "Appointments",
    isActive: (pathname: string) => pathname.startsWith("/appointments"),
  },
];

export function SiteNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-slate-900"
            aria-label="VirtuCare home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-600 text-sm font-bold text-white shadow-sm transition group-hover:bg-teal-700">
              VC
            </span>
            <span className="hidden text-xl font-bold tracking-tight sm:inline">
              VirtuCare
            </span>
          </Link>

          <div className="hidden items-center gap-5 text-sm font-semibold text-slate-600 sm:flex">
            {navItems.map((item) => {
              const isActive = item.isActive(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative inline-flex h-10 items-center px-1 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-teal-600 after:transition-transform after:duration-200 hover:text-teal-700 hover:after:scale-x-100",
                    isActive && "text-teal-700 after:scale-x-100",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            className="relative z-70 flex h-10 w-10 items-center justify-center text-slate-900 transition hover:text-teal-700 sm:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="relative h-4 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  isMenuOpen && "translate-y-1.75 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.75 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                  isMenuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  isMenuOpen && "-translate-y-1.75 -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-55 min-h-dvh bg-slate-900/20 opacity-0 backdrop-blur-sm transition-opacity duration-200 sm:hidden",
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none",
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-60 h-dvh w-[80vw] max-w-sm border-l border-slate-200 bg-white px-6 pb-6 pt-24 shadow-2xl transition-transform duration-300 ease-out sm:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="absolute right-4 top-3 flex h-10 w-10 items-center justify-center text-slate-900 transition hover:text-teal-700"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="sr-only">Close menu</span>
          <span className="relative h-4 w-5">
            <span className="absolute left-0 top-1.75 h-0.5 w-5 rotate-45 rounded-full bg-current" />
            <span className="absolute left-0 top-1.75 h-0.5 w-5 -rotate-45 rounded-full bg-current" />
          </span>
        </button>

        <div className="grid gap-2">
          {navItems.map((item) => {
            const isActive = item.isActive(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-12 items-center text-base font-semibold text-slate-700 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-20 after:origin-left after:scale-x-0 after:rounded-full after:bg-teal-600 after:transition-transform after:duration-200 hover:text-teal-700 hover:after:scale-x-100",
                  isActive && "text-teal-700 after:scale-x-100",
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
