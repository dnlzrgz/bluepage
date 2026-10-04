import { useEffectiveDate, toISODate, useJournalStore } from "@/stores/journal";
import { parseDate } from "@internationalized/date";

export function DatePicker() {
  const date = useEffectiveDate();
  const setDate = useJournalStore((s) => s.setSelectedDate);

  return (
    <input
      type="date"
      aria-label="Entry date"
      value={toISODate(date)}
      onChange={(e) => {
        if (!e.target.value) return;
        try {
          setDate(parseDate(e.target.value));
        } catch (error) {
          console.error("Failed to parse date", error);
        }
      }}
      className="w-fit cursor-pointer border-none bg-transparent px-3 py-1.5 text-white select-none"
    />
  );
}
