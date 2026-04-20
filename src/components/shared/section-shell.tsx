import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

export function SectionShell({ children, className }: SectionShellProps) {
  return (
    <section className={cn("mx-auto w-full max-w-5xl px-4 py-8 sm:px-6", className)}>
      {children}
    </section>
  );
}
