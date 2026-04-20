"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    href: "/",
    label: "Doctors",
    isActive: (pathname: string) => pathname === "/" || pathname.startsWith("/book"),
  },
  {
    href: "/appointments",
    label: "Appointments",
    isActive: (pathname: string) => pathname.startsWith("/appointments"),
  },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
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
          <span className="text-xl font-bold tracking-tight">VirtuCare</span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-semibold text-slate-600">
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
      </nav>
    </header>
  );
}
