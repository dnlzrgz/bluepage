import { useEffect, useMemo, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { useSettings, updateSetting } from "@/lib/settings";
import { getCachedFonts, loadFonts } from "@/lib/fonts";

export function FontSelector() {
  const font = useSettings((s) => s.font);
  const [fonts, setFonts] = useState<string[]>(() => getCachedFonts() ?? []);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (getCachedFonts()) return;
    let cancelled = false;

    loadFonts()
      .then((list) => !cancelled && setFonts(list))
      .catch((error) => {
        console.error("Failed to load system fonts", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const matches = q ? fonts.filter((f) => f.toLocaleLowerCase().includes(q)) : fonts;

    return matches;
  }, [fonts, query]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-3.5">
        <Combobox.Root
          items={items}
          filter={null}
          value={font}
          onValueChange={(value) => void updateSetting("font", value)}
          onInputValueChange={setQuery}
          onOpenChange={(open) => open && setQuery("")}
        >
          <Combobox.Input
            aria-label="Font"
            placeholder="System default"
            disabled={failed && fonts.length === 0}
            className="w-full rounded-md border border-popover-foreground bg-popover px-2.5 py-1 text-popover-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />

          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} className="z-50">
              <Combobox.Popup className="max-h-72 w-(--anchor-width) overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-xl">
                <Combobox.Empty className="px-2 py-1 text-sm">No fonts found</Combobox.Empty>
                <Combobox.List>
                  {(f: string) => (
                    <Combobox.Item
                      key={f}
                      value={f}
                      style={{ fontFamily: JSON.stringify(f) }}
                      className="cursor-pointer rounded px-1.5 py-1 data-highlighted:bg-popover-foreground data-highlighted:text-popover"
                    >
                      {f}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>

      {failed && fonts.length === 0 && (
        <p role="alert" className="text-sm text-popover-foreground">
          Couldn't load system fonts.
        </p>
      )}
    </div>
  );
}
