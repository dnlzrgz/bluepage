import { create } from "zustand";

export const useStatusStore = create<{ busy: boolean }>(() => ({
  busy: false,
}));

const SHOW_DELAY_MS = 150;

export function track<T>(op: Promise<T>): Promise<T> {
  const timer = window.setTimeout(() => useStatusStore.setState({ busy: true }), SHOW_DELAY_MS);

  return op.finally(() => {
    window.clearTimeout(timer);
    useStatusStore.setState({ busy: false });
  });
}
