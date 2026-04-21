import type { Appointment } from "@/types/appointment";

const STORAGE_KEY = "virtucare:appointments";
const STORAGE_EVENT = "virtucare:appointments-changed";

type AppointmentInput = Omit<Appointment, "id" | "createdAt">;
type AppointmentSlot = Pick<Appointment, "doctorId" | "date" | "time">;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAppointments(): Appointment[] {
  return parseAppointmentsSnapshot(getAppointmentsSnapshot());
}

export function getAppointmentsSnapshot() {
  if (!canUseStorage()) {
    return "[]";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function parseAppointmentsSnapshot(rawAppointments: string) {
  if (!rawAppointments) {
    return [];
  }

  try {
    return JSON.parse(rawAppointments) as Appointment[];
  } catch {
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  // localStorage does not notify the same tab, so this event keeps local UI
  // subscribed with useSyncExternalStore in sync after writes.
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeToAppointments(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function hasAppointmentConflict(
  appointments: Appointment[],
  appointmentSlot: AppointmentSlot,
) {
  // Conflicts are scoped to the same doctor, same date, and same time only.
  return appointments.some(
    (appointment) =>
      appointment.doctorId === appointmentSlot.doctorId &&
      appointment.date === appointmentSlot.date &&
      appointment.time === appointmentSlot.time,
  );
}

export function getBookedSlotsForDoctorDate(
  appointments: Appointment[],
  doctorId: string,
  date: string,
) {
  return appointments
    .filter(
      (appointment) =>
        appointment.doctorId === doctorId && appointment.date === date,
    )
    .map((appointment) => appointment.time);
}

export function addAppointment(appointmentInput: AppointmentInput) {
  const existingAppointments = getAppointments();

  // Keep duplicate prevention in storage too, not only in the button state.
  if (hasAppointmentConflict(existingAppointments, appointmentInput)) {
    throw new Error("This appointment slot is already booked.");
  }

  const nextAppointment: Appointment = {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...appointmentInput,
  };

  saveAppointments([nextAppointment, ...existingAppointments]);
  return nextAppointment;
}

export function cancelAppointment(appointmentId: string) {
  saveAppointments(
    getAppointments().filter((appointment) => appointment.id !== appointmentId),
  );
}
