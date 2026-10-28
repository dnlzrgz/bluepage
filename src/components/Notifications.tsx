import { useEffect } from "react";
import { dismissNotice, useStatusStore } from "@/stores/status";

const DISMISS_MS = 5000;

export function Notifications() {
  const notices = useStatusStore((s) => s.notices);

  return (
    <div className="notifications">
      {notices.map((notice) => (
        <Toast key={notice.id} id={notice.id} message={notice.message} />
      ))}
    </div>
  );
}

function Toast({ id, message }: { id: number; message: string }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismissNotice(id), DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <div role="alert" className="surface notification">
      <span className="notification-message">{message}</span>
      <button
        type="button"
        aria-label={`Dismiss notification: ${message}`}
        onClick={() => dismissNotice(id)}
        className="notification-close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="icon">
          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
        </svg>
      </button>
    </div>
  );
}
