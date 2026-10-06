import { useStatusStore } from "@/stores/status";

export function StatusIndicator() {
  const pending = useStatusStore((s) => s.pending);
  const busy = pending > 0;

  return (
    <>
      <span
        aria-hidden
        className={`block h-3 w-3 rounded-full bg-foreground p-1 transition-opacity ${
          busy ? "opacity-100 motion-safe:animate-pulse" : "opacity-0"
        }`}
      ></span>
      <span role="status" className="sr-only">
        {busy ? "Saving" : ""}
      </span>
    </>
  );
}
