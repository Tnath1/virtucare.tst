const BOOKING_CUTOFF_MINUTES = 20;

export function todayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatAppointmentDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getSlotDateTime(date: string, time: string) {
  // Slot labels are stored as display strings, so convert them into a Date
  // before applying real booking cutoff rules.
  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, rawHour, rawMinute, period] = match;
  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (period.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function isSlotBookable(date: string, time: string) {
  const slotDateTime = getSlotDateTime(date, time);

  if (!slotDateTime) {
    return false;
  }

  const bookingCutoff = new Date();
  bookingCutoff.setMinutes(bookingCutoff.getMinutes() + BOOKING_CUTOFF_MINUTES);

  // Users can only book when the slot is more than 20 minutes away.
  return slotDateTime.getTime() > bookingCutoff.getTime();
}

export function getUnavailableSlotsForDate(date: string, slots: string[]) {
  return slots.filter((slot) => !isSlotBookable(date, slot));
}
