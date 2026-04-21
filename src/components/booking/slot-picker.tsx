import { cn } from "@/lib/utils/cn";

type SlotPickerProps = {
  slots: string[];
  bookedSlots?: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
};

export function SlotPicker({
  slots,
  bookedSlots = [],
  selectedSlot,
  onSelect,
}: SlotPickerProps) {
  const bookedSlotSet = new Set(bookedSlots);

  return (
    <div>
      <p className="text-sm font-medium text-slate-900">Available time</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const isBooked = bookedSlotSet.has(slot);
          const isSelected = selectedSlot === slot && !isBooked;

          return (
            <button
              key={slot}
              type="button"
              disabled={isBooked}
              onClick={() => onSelect(slot)}
              className={cn(
                "h-11 rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed",
                isBooked
                  ? "border-slate-200 bg-slate-100 text-slate-400"
                  : isSelected
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700",
              )}
            >
              {isBooked ? `${slot} booked` : slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
