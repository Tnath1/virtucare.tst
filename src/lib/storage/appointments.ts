import type { Appointment } from "@/types/appointment";

const STORAGE_KEY = "virtucare:appointments";
const STORAGE_EVENT = "virtucare:appointments-changed";

type AppointmentInput = Omit<Appointment, "id" | "createdAt">;

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

export function addAppointment(appointmentInput: AppointmentInput) {
  const nextAppointment: Appointment = {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...appointmentInput,
  };

  saveAppointments([nextAppointment, ...getAppointments()]);
  return nextAppointment;
}

export function cancelAppointment(appointmentId: string) {
  saveAppointments(
    getAppointments().filter((appointment) => appointment.id !== appointmentId),
  );
}
