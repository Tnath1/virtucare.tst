import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({
  className,
  id,
  label,
  name,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name;

  return (
    <label className="grid gap-2 text-sm font-medium text-slate-900">
      <span>{label}</span>
      <textarea
        id={textareaId}
        name={name}
        className={cn(
          "min-h-28 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20",
          className,
        )}
        {...props}
      />
    </label>
  );
}
