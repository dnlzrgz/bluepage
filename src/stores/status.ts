import { create } from "zustand";

export interface Notice {
  id: number;
  message: string;
}

interface StatusState {
  /** Operations past `SLOW_MS` that have not finished yet. */
  pending: number;
  notices: Notice[];
}

export const useStatusStore = create<StatusState>(() => ({
  pending: 0,
  notices: [],
}));

/** Anything faster than this is a keystroke, not a wait. */
const SLOW_MS = 1000;

let nextId = 0;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
    try {
      return JSON.stringify(error);
    } catch (unsendable) {
      // Circular structure: report why, then fall back to String().
      console.error("Failed to describe error", unsendable);
    }
  }

  return String(error);
}

async function trackPending<T>(op: Promise<T>): Promise<T> {
  let counted = false;
  const timer = window.setTimeout(() => {
    counted = true;
    useStatusStore.setState((s) => ({ pending: s.pending + 1 }));
  }, SLOW_MS);

  return op.finally(() => {
    window.clearTimeout(timer);
    if (!counted) return;
    useStatusStore.setState((s) => ({ pending: Math.max(0, s.pending - 1) }));
  });
}

export async function track<T>(op: Promise<T>): Promise<T> {
  return trackPending(op).catch((error) => {
    const message = errorMessage(error);
    useStatusStore.setState((s) =>
      s.notices.some((notice) => notice.message === message)
        ? s
        : { notices: [...s.notices, { id: nextId++, message }] },
    );

    throw error;
  });
}

export function dismissNotice(id: number) {
  useStatusStore.setState((s) => ({
    notices: s.notices.filter((notice) => notice.id !== id),
  }));
}
