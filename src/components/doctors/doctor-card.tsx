import Link from "next/link";

import type { Doctor } from "@/types/doctor";

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-teal-700">{doctor.specialty}</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          {doctor.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {doctor.availableSlots.length} appointment times available this week.
        </p>
      </div>
      <Link
        href={`/book/${doctor.id}`}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        Book appointment
      </Link>
    </article>
  );
}
