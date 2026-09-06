"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Barber, BookingState, Service } from "@/types";

/**
 * Booking flow store.
 *
 * Single source of truth for the /agendar multi-step flow.
 * Persisted to localStorage so a refresh mid-flow doesn't lose progress.
 *
 * The store is intentionally decoupled from any backend. The confirmation
 * step is the seam where, in the future, an API route will persist the
 * booking to PostgreSQL.
 */

interface BookingActions {
  setService: (service: Service | null) => void;
  setBarber: (barber: Barber | null) => void;
  setAnyBarber: (any: boolean) => void;
  setDate: (iso: string | null) => void;
  setTime: (time: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  confirm: () => void;
  reset: () => void;
}

export type BookingStore = BookingState & BookingActions;

const INITIAL: BookingState = {
  service: null,
  barber: null,
  anyBarber: false,
  date: null,
  time: null,
  customerName: "",
  customerPhone: "",
  confirmed: false,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      setService: (service) => set({ service }),
      setBarber: (barber) => set({ barber }),
      setAnyBarber: (anyBarber) =>
        // Picking "any barber" clears a previously selected barber.
        set({ anyBarber, barber: anyBarber ? null : get().barber }),
      setDate: (date) => set({ date, time: null }), // reset time when date changes
      setTime: (time) => set({ time }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      confirm: () => set({ confirmed: true }),
      reset: () => set(INITIAL),
    }),
    {
      name: "barber-house-booking",
      // Only persist the data, not the actions (Zustand handles this automatically
      // since functions don't survive JSON serialization, but be explicit).
      partialize: (s) => ({
        service: s.service,
        barber: s.barber,
        anyBarber: s.anyBarber,
        date: s.date,
        time: s.time,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
        confirmed: s.confirmed,
      }),
    },
  ),
);
