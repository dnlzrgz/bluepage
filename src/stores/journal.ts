import { create } from "zustand";

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISODate = (iso: string) => new Date(`${iso}T00:00:00`);

interface JournalState {
  selectedDate: string | null;
  setSelectedDate: (iso: string) => void;
}

export const useJournalStore = create<JournalState>()((set) => ({
  selectedDate: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));

export const useEffectiveDate = () =>
  useJournalStore((s) => s.selectedDate) ?? toISODate(new Date());
