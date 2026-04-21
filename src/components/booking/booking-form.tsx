"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";

import { SlotPicker } from "@/components/booking/slot-picker";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Textarea } from "@/components/shared/textarea";
import {
  addAppointment,
  getAppointmentsSnapshot,
  getBookedSlotsForDoctorDate,
  parseAppointmentsSnapshot,
  subscribeToAppointments,
} from "@/lib/storage/appointments";
import { getUnavailableSlotsForDate, todayInputValue } from "@/lib/utils/date";
import { delay } from "@/lib/utils/delay";
import type { Doctor } from "@/types/doctor";

type BookingFormProps = {
  doctor: Doctor;
};

type BookingFormSubmitEvent = {
  preventDefault: () => void;
};

const BOOKING_MUTATION_DELAY_MS = 1200;

export function BookingForm({ doctor }: BookingFormProps) {
  const router = useRouter();
  const initialDate = todayInputValue();
  const initialUnavailableSlots = getUnavailableSlotsForDate(
    initialDate,
    doctor.availableSlots,
  );
  const initialAvailableSlot =
    doctor.availableSlots.find(
      (slot) => !initialUnavailableSlots.includes(slot),
    ) ?? "";
  const appointmentsSnapshot = useSyncExternalStore(
    subscribeToAppointments,
    getAppointmentsSnapshot,
    () => "[]",
  );
  const appointments = useMemo(
    () => parseAppointmentsSnapshot(appointmentsSnapshot),
    [appointmentsSnapshot],
  );
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialAvailableSlot);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const bookedSlots = useMemo(
    () => getBookedSlotsForDoctorDate(appointments, doctor.id, date),
    [appointments, date, doctor.id],
  );
  const unavailableSlots = useMemo(
    () => getUnavailableSlotsForDate(date, doctor.availableSlots),
    [date, doctor.availableSlots],
  );

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setError("");

    const nextBookedSlots = getBookedSlotsForDoctorDate(
      appointments,
      doctor.id,
      nextDate,
    );
    const nextUnavailableSlots = getUnavailableSlotsForDate(
      nextDate,
      doctor.availableSlots,
    );

    if (nextBookedSlots.includes(time) || nextUnavailableSlots.includes(time)) {
      const nextAvailableSlot =
        doctor.availableSlots.find(
          (slot) =>
            !nextBookedSlots.includes(slot) &&
            !nextUnavailableSlots.includes(slot),
        ) ?? "";

      setTime(nextAvailableSlot);
    }
  }

  function handleTimeSelect(nextTime: string) {
    setTime(nextTime);
    setError("");
  }

  function handleCloseSuccessModal() {
    router.push("/");
    setIsSuccessModalOpen(false);
  }

  async function handleSubmit(event: BookingFormSubmitEvent) {
    event.preventDefault();

    if (isBooking) {
      return;
    }

    if (!date) {
      setError("Choose a date to continue.");
      return;
    }
    if (!time) {
      setError("Choose time of your appointment to continue.");
      return;
    }
    if (bookedSlots.includes(time)) {
      setError("That time is already booked for this doctor on that day.");
      return;
    }
    if (unavailableSlots.includes(time)) {
      setError(
        "Choose a time that has not passed and is more than 20 minutes away.",
      );
      return;
    }
    if (!reason.trim()) {
      setError("Choose a reason for booking an appointment.");
      return;
    }

    setIsBooking(true);
    setError("");

    try {
      await delay(BOOKING_MUTATION_DELAY_MS);
      addAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        time,
        reason: reason.trim(),
      });
      setIsSuccessModalOpen(true);
    } catch {
      setError("That time is already booked for this doctor on that day.");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="border-b border-slate-200 pb-5">
          <p className="text-sm font-medium text-teal-700">
            {doctor.specialty}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {doctor.name}
          </h2>
        </div>

        <div className="mt-5 grid gap-5">
          <Input
            label="Appointment date"
            name="date"
            type="date"
            min={todayInputValue()}
            value={date}
            onChange={(event) => handleDateChange(event.target.value)}
          />

          <SlotPicker
            slots={doctor.availableSlots}
            bookedSlots={bookedSlots}
            unavailableSlots={unavailableSlots}
            selectedSlot={time}
            onSelect={handleTimeSelect}
          />

          <Textarea
            label="Reason for visit"
            name="reason"
            rows={4}
            placeholder="Briefly describe what you need help with."
            value={reason}
            disabled={isBooking}
            onChange={(event) => setReason(event.target.value)}
          />

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isBooking}>
              {isBooking ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Booking...
                </>
              ) : (
                "Confirm booking"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isBooking}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </div>
        </div>
      </form>

      {isSuccessModalOpen ? (
        <div
          className="fixed inset-0 z-80 flex min-h-dvh items-center justify-center bg-slate-900/30 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <div className="relative w-full max-w-md animate-[modal-pop_180ms_ease-out] rounded-lg bg-white p-6 text-center shadow-2xl">
            <button
              type="button"
              className="absolute cursor-pointer right-5 top-5 flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
              aria-label="Close success modal"
              onClick={handleCloseSuccessModal}
            >
              <span className="sr-only">Close success modal</span>
              <span className="relative h-4 w-5">
                <span className="absolute left-0 top-1.75 h-0.5 w-5 rotate-45 rounded-full bg-current" />
                <span className="absolute left-0 top-1.75 h-0.5 w-5 -rotate-45 rounded-full bg-current" />
              </span>
            </button>

            <div className="mx-auto mt-6 flex h-16 w-16 animate-[check-pop_300ms_ease-out] items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-9 w-9"
                fill="none"
              >
                <path
                  d="M5 12.5l4.2 4.2L19 7"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[check-draw_500ms_ease-out_120ms_both]"
                />
              </svg>
            </div>

            <h2
              id="booking-success-title"
              className="mt-5 text-xl font-semibold text-slate-900"
            >
              Appointment booked
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your appointment with {doctor.name} is confirmed for {date} at{" "}
              {time}.
            </p>

            <Button
              type="button"
              className="mt-6 w-full"
              onClick={() => router.push("/appointments")}
            >
              Continue to appointments
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
