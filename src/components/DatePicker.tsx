import { getEntryDates } from "@/lib/db";
import { track } from "@/stores/status";
import {
  fromISODate,
  monthRange,
  toISODate,
  useEffectiveDate,
  useJournalStore,
} from "@/stores/journal";
import { Popover } from "@base-ui/react/popover";
import { DayPicker } from "@daypicker/react";
import { useEffect, useState } from "react";

export function DatePicker() {
  const date = useEffectiveDate();
  const setDate = useJournalStore((s) => s.setSelectedDate);

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => fromISODate(date));
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    let active = true;
    const { start, end } = monthRange(month);
    track(getEntryDates(start, end))
      .then((dates) => active && setEntryDates(dates))
      .catch(console.error);

    return () => {
      active = false;
    };
  }, [open, month]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="date-trigger">{date}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="popover-positioner">
          <Popover.Popup className="surface date-picker-popup">
            <DayPicker
              mode="single"
              navLayout="around"
              month={month}
              onMonthChange={setMonth}
              disabled={{ after: new Date() }}
              modifiers={{
                written: (d) => entryDates.has(toISODate(d)),
              }}
              modifiersClassNames={{ written: "rdp-written" }}
              selected={fromISODate(date)}
              onSelect={(d) => {
                if (!d) return;
                setDate(toISODate(d));
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
