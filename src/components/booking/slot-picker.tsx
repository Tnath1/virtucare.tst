import { cn } from "@/lib/utils/cn";

type SlotPickerProps = {
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
};

export function SlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: SlotPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">Available time</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelect(slot)}
              className={cn(
                "h-11 rounded-md border px-3 text-sm font-semibold transition",
                isSelected
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700",
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
