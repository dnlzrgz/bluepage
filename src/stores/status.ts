import { create } from "zustand";

interface StatusState {
  pending: number;
  errors: string[];
  errorOpen: boolean;
}

export const useStatusStore = create<StatusState>(() => ({
  pending: 0,
  errors: [],
  errorOpen: false,
}));

const SHOW_DELAY_MS = 150;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
    try {
      return JSON.stringify(error);
    } catch {}
  }

  return String(error);
}

async function trackPending<T>(op: Promise<T>): Promise<T> {
  let shown = false;
  const timer = window.setTimeout(() => {
    shown = true;
    useStatusStore.setState((s) => ({ pending: s.pending + 1 }));
  }, SHOW_DELAY_MS);

  return op.finally(() => {
    window.clearTimeout(timer);
    if (shown) {
      useStatusStore.setState((s) => ({ pending: Math.max(0, s.pending - 1) }));
    }
  });
}

export async function track<T>(op: Promise<T>): Promise<T> {
  return trackPending(op).catch((error) => {
    const message = errorMessage(error);
    useStatusStore.setState((s) => ({
      errors: s.errors.includes(message) ? s.errors : [...s.errors, message],
      errorOpen: true,
    }));

    throw error;
  });
}

export function dismissError(idx: number) {
  useStatusStore.setState((s) => ({
    errors: s.errors.filter((_, i) => i !== idx),
  }));
}

export function setErrorOpen(errorOpen: boolean) {
  useStatusStore.setState({ errorOpen });
}
