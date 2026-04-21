"use client";

import { useMemo, useSyncExternalStore } from "react";

import { AppointmentCard } from "@/components/appointments/appointment-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import {
  cancelAppointment,
  getAppointmentsSnapshot,
  parseAppointmentsSnapshot,
  subscribeToAppointments,
} from "@/lib/storage/appointments";

const APPOINTMENTS_LOADING_SNAPSHOT = "__appointments_loading__";

export function AppointmentsList() {
  const appointmentsSnapshot = useSyncExternalStore(
    subscribeToAppointments,
    getAppointmentsSnapshot,
    () => APPOINTMENTS_LOADING_SNAPSHOT,
  );
  const isLoading = appointmentsSnapshot === APPOINTMENTS_LOADING_SNAPSHOT;
  const appointments = useMemo(
    () => (isLoading ? [] : parseAppointmentsSnapshot(appointmentsSnapshot)),
    [appointmentsSnapshot, isLoading],
  );

  function handleCancel(appointmentId: string) {
    cancelAppointment(appointmentId);
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments yet"
        description="Book a doctor from the listing page and it will appear here."
        href="/"
        actionLabel="Browse doctors"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}
