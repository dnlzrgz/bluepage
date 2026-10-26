import { ThemeSelector } from "@/components/ThemeSelector";
import { Popover } from "@base-ui/react/popover";

export function SettingsPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger aria-label="Settings" className="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon--square" viewBox="0 0 256 256">
          <path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144Zm0-64A32,32,0,1,0,96,48,32,32,0,0,0,128,80Zm0-48a16,16,0,1,1-16,16A16,16,0,0,1,128,32Zm0,144a32,32,0,1,0,32,32A32,32,0,0,0,128,176Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,224Z"></path>
        </svg>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="end" className="popover-positioner">
          <Popover.Popup className="surface settings-popover">
            <ThemeSelector />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
