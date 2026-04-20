import { DoctorList } from "@/components/doctors/doctor-list";
import { PageHeader } from "@/components/shared/page-header";
import { SectionShell } from "@/components/shared/section-shell";
import { doctors } from "@/lib/data/doctors";

export default function Home() {
  return (
    <SectionShell>
      <PageHeader
        title="Find a doctor"
        description="Choose a provider, pick an available time, and keep your appointments saved in this browser."
      />
      <DoctorList doctors={doctors} />
    </SectionShell>
  );
}
