import { Popover } from "@base-ui/react/popover";
import { dismissError, setErrorOpen, useStatusStore } from "@/stores/status";

export function StatusIndicator() {
  const pending = useStatusStore((s) => s.pending);
  const errors = useStatusStore((s) => s.errors);
  const errorOpen = useStatusStore((s) => s.errorOpen);

  const hasError = errors.length > 0;
  const busy = pending > 0;

  return (
    <Popover.Root open={errorOpen && hasError} onOpenChange={setErrorOpen}>
      <Popover.Trigger aria-label="Status" className="cursor-pointer">
        <span
          aria-hidden
          className={`block size-3 rounded-full transition-colors ${
            hasError ? "bg-error" : "bg-foreground"
          } ${busy && !hasError ? "animate-pulse" : ""}`}
        />
      </Popover.Trigger>

      <span role="status" className="sr-only">
        {hasError ? "Error" : busy ? "Saving" : ""}
      </span>

      <Popover.Portal>
        <Popover.Positioner align="start" sideOffset={6} className="z-40">
          <Popover.Popup className="w-96 rounded-xl bg-popover p-6 text-popover-foreground shadow-xl">
            <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto">
              {errors.map((message, i) => (
                <li key={message} className="flex items-center justify-between gap-2.5">
                  <span className="wrap-break-word text-black">{message}</span>
                  <button
                    type="button"
                    aria-label={`Dismiss error: ${message}`}
                    onClick={() => dismissError(i)}
                    className="shrink-0 cursor-pointer px-2.5 py-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className="h-5 w-auto fill-black"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
