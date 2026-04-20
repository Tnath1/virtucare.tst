export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function formatAppointmentDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
