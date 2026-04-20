import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking/booking-form";
import { PageHeader } from "@/components/shared/page-header";
import { SectionShell } from "@/components/shared/section-shell";
import { doctors } from "@/lib/data/doctors";

type BookingPageProps = {
  params: Promise<{
    doctorId: string;
  }>;
};

export function generateStaticParams() {
  return doctors.map((doctor) => ({
    doctorId: doctor.id,
  }));
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { doctorId } = await params;
  const doctor = doctors.find((item) => item.id === doctorId);

  if (!doctor) {
    notFound();
  }

  return (
    <SectionShell>
      <PageHeader
        title={`Book ${doctor.name}`}
        description={`${doctor.specialty} appointments are saved in localStorage for this assessment.`}
      />
      <BookingForm doctor={doctor} />
    </SectionShell>
  );
}
