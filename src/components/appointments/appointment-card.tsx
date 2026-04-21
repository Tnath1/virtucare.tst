import { Button } from "@/components/shared/button";
import { formatAppointmentDate } from "@/lib/utils/date";
import type { Appointment } from "@/types/appointment";

type AppointmentCardProps = {
  appointment: Appointment;
  onCancel: (appointmentId: string) => void;
  isCanceling?: boolean;
};

export function AppointmentCard({
  appointment,
  isCanceling = false,
  onCancel,
}: AppointmentCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">
            {appointment.specialty}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {appointment.doctorName}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {formatAppointmentDate(appointment.date)} at {appointment.time}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {appointment.reason}
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          disabled={isCanceling}
          onClick={() => onCancel(appointment.id)}
        >
          {isCanceling ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Canceling...
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>
    </article>
  );
}
