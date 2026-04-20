"use client";

import { useMemo, useState } from "react";

import { DoctorCard } from "@/components/doctors/doctor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/shared/input";
import type { Doctor } from "@/types/doctor";

type DoctorListProps = {
  doctors: Doctor[];
};

export function DoctorList({ doctors }: DoctorListProps) {
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

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          label="Search doctors"
          name="doctor-search"
          type="search"
          placeholder="Search by name or specialty"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {filteredDoctors.length > 0 ? (
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
