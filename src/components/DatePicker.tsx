import { Popover } from "@base-ui/react/popover";
import { DayPicker, getDefaultClassNames } from "@daypicker/react";
import { CalendarDate } from "@internationalized/date";
import { useEffectiveDate, toISODate, useJournalStore, useToday } from "@/stores/journal";

const toJsDate = (d: CalendarDate) => new Date(d.year, d.month - 1, d.day);
const fromJsDate = (d: Date) => new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());

export function DatePicker() {
  const date = useEffectiveDate();
  const today = useToday();
  const setDate = useJournalStore((s) => s.setSelectedDate);

  const defaultClassNames = getDefaultClassNames();

  return (
    <Popover.Root>
      <Popover.Trigger className="cursor-pointer text-lg text-foreground">
        {toISODate(date)}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="z-40">
          <Popover.Popup className="rounded-xl bg-popover p-3 shadow-xl">
            <DayPicker
              mode="single"
              navLayout="around"
              disabled={{ after: toJsDate(today) }}
              selected={toJsDate(date)}
              onSelect={(d) => d && setDate(fromJsDate(d))}
              classNames={{
                month_caption: `${defaultClassNames.month_caption} text-popover-foreground font-normal`,
                weekday: `${defaultClassNames.weekday} text-black font-bold`,
                chevron: `${defaultClassNames.chevron} fill-popover-foreground hover:fill-primary`,
                selected: `${defaultClassNames.selected} [&>button]:bg-primary [&>button]:text-popover`,
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
