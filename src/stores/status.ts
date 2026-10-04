import { create } from "zustand";

export const useStatusStore = create<{ pending: number }>(() => ({
  pending: 0,
}));

const SHOW_DELAY_MS = 150;

export function track<T>(op: Promise<T>): Promise<T> {
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
