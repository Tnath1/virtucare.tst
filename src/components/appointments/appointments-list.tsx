"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { AppointmentCard } from "@/components/appointments/appointment-card";
import { Button } from "@/components/shared/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import {
  cancelAppointment,
  getAppointmentsSnapshot,
  parseAppointmentsSnapshot,
  subscribeToAppointments,
} from "@/lib/storage/appointments";
import { formatAppointmentDate } from "@/lib/utils/date";
import { delay } from "@/lib/utils/delay";
import type { Appointment } from "@/types/appointment";

const APPOINTMENTS_LOADING_SNAPSHOT = "__appointments_loading__";
const CANCEL_MUTATION_DELAY_MS = 1000;

export function AppointmentsList() {
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
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
    const selectedAppointment = appointments.find(
      (appointment) => appointment.id === appointmentId,
    );

    if (selectedAppointment) {
      setAppointmentToCancel(selectedAppointment);
    }
  }

  async function handleConfirmCancel() {
    if (!appointmentToCancel || isCanceling) {
      return;
    }

    setIsCanceling(true);

    await delay(CANCEL_MUTATION_DELAY_MS);
    cancelAppointment(appointmentToCancel.id);
    setIsCanceling(false);
    setAppointmentToCancel(null);
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
    <>
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isCanceling={
              isCanceling && appointmentToCancel?.id === appointment.id
            }
            onCancel={handleCancel}
          />
        ))}
      </div>

      {appointmentToCancel ? (
        <div
          className="fixed inset-0 z-[80] flex min-h-dvh items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-appointment-title"
        >
          <div className="w-full max-w-md animate-[modal-pop_180ms_ease-out] rounded-lg bg-white p-6 shadow-2xl">
            <h2
              id="cancel-appointment-title"
              className="text-xl font-semibold text-slate-900"
            >
              Cancel appointment?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will cancel your appointment with{" "}
              {appointmentToCancel.doctorName} on{" "}
              {formatAppointmentDate(appointmentToCancel.date)} at{" "}
              {appointmentToCancel.time}.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="danger"
                disabled={isCanceling}
                onClick={handleConfirmCancel}
              >
                {isCanceling ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Canceling...
                  </>
                ) : (
                  "Yes, cancel"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isCanceling}
                onClick={() => setAppointmentToCancel(null)}
              >
                Keep appointment
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
