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
import { DayPicker, getDefaultClassNames } from "@daypicker/react";
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

  const defaultClassNames = getDefaultClassNames();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="cursor-pointer text-lg text-foreground">{date}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="z-40">
          <Popover.Popup className="rounded-xl bg-popover p-3 shadow-xl">
            <DayPicker
              mode="single"
              navLayout="around"
              month={month}
              onMonthChange={setMonth}
              disabled={{ after: new Date() }}
              modifiers={{
                written: (d) => entryDates.has(toISODate(d)),
              }}
              modifiersClassNames={{
                written:
                  "[&>button]:relative [&>button]:after:absolute [&>button]:after:bottom-0.5 [&>button]:after:left-1/2 [&>button]:after:size-1.25 [&>button]:after:-translate-x-1/2 [&>button]:after:rounded-full [&>button]:after:bg-primary aria-selected:[&>button]:after:bg-popover",
              }}
              selected={fromISODate(date)}
              onSelect={(d) => {
                if (!d) return;
                setDate(toISODate(d));
                setOpen(false);
              }}
              classNames={{
                month_caption: `${defaultClassNames.month_caption} text-black font-normal`,
                weekday: `${defaultClassNames.weekday} text-black font-bold`,
                chevron: `${defaultClassNames.chevron} fill-black hover:fill-primary`,
                selected: `${defaultClassNames.selected} [&>button]:bg-primary [&>button]:text-popover`,
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
