import { toISODate } from "@/lib/date";
import { useDate, useJournalStore } from "@/stores/journal";
import { parseDate } from "@internationalized/date";

export function DatePicker() {
  const date = useDate();
  const setDate = useJournalStore((s) => s.setDate);

  return (
    <input
      type="date"
      aria-label="Entry date"
      value={toISODate(date)}
      onChange={(e) => {
        if (!e.target.value) return;
        setDate(parseDate(e.target.value));
      }}
      className="w-fit cursor-pointer border-none bg-transparent px-3 py-1.5 text-white select-none"
    />
  );
}
