import debounce from "lodash-es/debounce";
import { track } from "@/stores/status";

interface AutosaverOptions<T> {
  snapshot: () => T;
  write: (snapshot: T) => Promise<void>;
  wait?: number;
  maxWait?: number;
}

export function createAutosaver<T>({
  snapshot,
  write,
  wait = 800,
  maxWait = 5000,
}: AutosaverOptions<T>) {
  let tail: Promise<void> = Promise.resolve();

  const enqueue = () => {
    const data = snapshot();
    tail = tail
      .then(() => track(write(data)))
      .catch((error) => console.error("Failed to save entry", error));
  };

  const debounced = debounce(enqueue, wait, { maxWait });

  return {
    schedule: () => void debounced(),
    flush: () => {
      debounced.flush();
      return tail;
    },
  };
}
