"use client";

import { useEffect, useMemo, useState } from "react";

import { DoctorCard } from "@/components/doctors/doctor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/shared/input";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import type { Doctor } from "@/types/doctor";

type DoctorListProps = {
  doctors: Doctor[];
};

const DOCTOR_FETCH_DELAY_MS = 2000;
const SKELETON_CARD_COUNT = 6;

// Lightweight in-memory cache to mimic RTK Query: loading shows once per
// browser session and resets on a full page refresh.
let hasLoadedDoctors = false;

export function DoctorList({ doctors }: DoctorListProps) {
  const [isLoading, setIsLoading] = useState(() => !hasLoadedDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredDoctors = useMemo(() => {
    if (!normalizedSearchTerm) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      const searchableText = `${doctor.name} ${doctor.specialty}`.toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [doctors, normalizedSearchTerm]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timerId = window.setTimeout(() => {
      hasLoadedDoctors = true;
      setIsLoading(false);
    }, DOCTOR_FETCH_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [isLoading]);

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          label="Search doctors"
          name="doctor-search"
          type="search"
          placeholder="Search by name or specialty"
          value={searchTerm}
          disabled={isLoading}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No doctors found"
          description="Try searching for another doctor name or specialty."
        />
      )}
    </div>
  );
}
