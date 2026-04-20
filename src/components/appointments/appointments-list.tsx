"use client";

import { useMemo, useSyncExternalStore } from "react";

import { AppointmentCard } from "@/components/appointments/appointment-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  cancelAppointment,
  getAppointmentsSnapshot,
  parseAppointmentsSnapshot,
  subscribeToAppointments,
} from "@/lib/storage/appointments";

export function AppointmentsList() {
  const appointmentsSnapshot = useSyncExternalStore(
    subscribeToAppointments,
    getAppointmentsSnapshot,
    () => "[]",
  );
  const appointments = useMemo(
    () => parseAppointmentsSnapshot(appointmentsSnapshot),
    [appointmentsSnapshot],
  );

  function handleCancel(appointmentId: string) {
    cancelAppointment(appointmentId);
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
