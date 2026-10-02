import { useStatusStore } from "@/stores/status";

export function StatusIndicator() {
  const busy = useStatusStore((s) => s.busy);

  return (
    <span
      className={`block h-2.5 w-2.5 rounded-full bg-white transition-opacity ${
        busy ? "animate-pulse opacity-150" : "opacity-0"
      }`}
    ></span>
  );
}
