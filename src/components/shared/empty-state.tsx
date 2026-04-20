import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  href,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
      {href && actionLabel ? (
        <Link
          href={href}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
