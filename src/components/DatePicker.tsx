import { fromISODate, toISODate, useEffectiveDate, useJournalStore } from "@/stores/journal";
import { Popover } from "@base-ui/react/popover";
import { DayPicker, getDefaultClassNames } from "@daypicker/react";

export function DatePicker() {
  const date = useEffectiveDate();
  const setDate = useJournalStore((s) => s.setSelectedDate);

  const defaultClassNames = getDefaultClassNames();

  return (
    <Popover.Root>
      <Popover.Trigger className="cursor-pointer text-lg text-foreground">{date}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="z-40">
          <Popover.Popup className="rounded-xl bg-popover p-3 shadow-xl">
            <DayPicker
              mode="single"
              navLayout="around"
              disabled={{ after: new Date() }}
              selected={fromISODate(date)}
              onSelect={(d) => d && setDate(toISODate(d))}
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
