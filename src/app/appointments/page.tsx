import { AppointmentsList } from "@/components/appointments/appointments-list";
import { PageHeader } from "@/components/shared/page-header";
import { SectionShell } from "@/components/shared/section-shell";

export default function AppointmentsPage() {
  return (
    <SectionShell>
      <PageHeader
        title="Appointments"
        description="Review upcoming bookings stored locally in your browser."
      />
      <AppointmentsList />
    </SectionShell>
  );
}
