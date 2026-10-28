import { useStatusStore } from "@/stores/status";

export function StatusIndicator() {
  const pending = useStatusStore((s) => s.pending);
  const hasNotice = useStatusStore((s) => s.notices.length > 0);

  const state = hasNotice ? "error" : pending > 0 ? "slow" : null;

  return (
    <>
      <span aria-hidden className={state ? `status-dot status-dot--${state}` : "status-dot"} />
      <span role="status" className="sr-only">
        {hasNotice ? "Error" : pending > 0 ? "Waiting" : ""}
      </span>
    </>
  );
}
