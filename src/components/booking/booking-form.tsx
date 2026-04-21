"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";

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
import { todayInputValue } from "@/lib/utils/date";
import type { Doctor } from "@/types/doctor";

type BookingFormProps = {
  doctor: Doctor;
};

export function BookingForm({ doctor }: BookingFormProps) {
  const router = useRouter();
  const appointmentsSnapshot = useSyncExternalStore(
    subscribeToAppointments,
    getAppointmentsSnapshot,
    () => "[]",
  );
  const appointments = useMemo(
    () => parseAppointmentsSnapshot(appointmentsSnapshot),
    [appointmentsSnapshot],
  );
  const [date, setDate] = useState(todayInputValue());
  const [time, setTime] = useState(doctor.availableSlots[0] ?? "");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const bookedSlots = useMemo(
    () => getBookedSlotsForDoctorDate(appointments, doctor.id, date),
    [appointments, date, doctor.id],
  );

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setError("");

    const nextBookedSlots = getBookedSlotsForDoctorDate(
      appointments,
      doctor.id,
      nextDate,
    );

    if (nextBookedSlots.includes(time)) {
      setTime("");
    }
  }

  function handleTimeSelect(nextTime: string) {
    setTime(nextTime);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    if (!reason.trim()) {
      setError("Choose a reason for booking an appointment.");
      return;
    }

    try {
      addAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        time,
        reason: reason.trim(),
      });
    } catch {
      setError("That time is already booked for this doctor on that day.");
      return;
    }

    router.push("/appointments");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="border-b border-slate-200 pb-5">
        <p className="text-sm font-medium text-teal-700">{doctor.specialty}</p>
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
          selectedSlot={time}
          onSelect={handleTimeSelect}
        />

        <Textarea
          label="Reason for visit"
          name="reason"
          rows={4}
          placeholder="Briefly describe what you need help with."
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />

        {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit">Confirm booking</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>
    </form>
  );
}
