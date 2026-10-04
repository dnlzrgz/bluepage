import { create } from "zustand";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

interface JournalState {
  selectedDate: CalendarDate | null;
  setSelectedDate: (date: CalendarDate) => void;
}

export const useJournalStore = create<JournalState>()((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export const useEffectiveDate = () => useJournalStore((s) => s.selectedDate) ?? useToday();

export const useToday = () => today(getLocalTimeZone());

export const toISODate = (date: CalendarDate) => date.toString();
