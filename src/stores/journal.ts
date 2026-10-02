import { create } from "zustand";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

interface JournalState {
  date: CalendarDate;
  setDate: (date: CalendarDate) => void;
}

export const useJournalStore = create<JournalState>()((set) => ({
  date: today(getLocalTimeZone()),
  setDate: (date) => set({ date }),
}));

export const useDate = () => useJournalStore((s) => s.date);
