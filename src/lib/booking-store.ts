"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Barber, BookingState, Service } from "@/types";

interface BookingStoreState extends BookingState {
  /** Slug of the barbershop this booking belongs to. Used to detect tenant switches and reset stale state. */
  barbershopSlug: string;
}

interface BookingActions {
  setService: (service: Service | null) => void;
  setBarber: (barber: Barber | null) => void;
  setAnyBarber: (any: boolean) => void;
  setDate: (iso: string | null) => void;
  setTime: (time: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setBarbershopSlug: (slug: string) => void;
  confirm: () => void;
  reset: () => void;
}

export type BookingStore = BookingStoreState & BookingActions;

const INITIAL: BookingStoreState = {
  barbershopSlug: "",
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
        set({ anyBarber, barber: anyBarber ? null : get().barber }),
      setDate: (date) => set({ date, time: null }),
      setTime: (time) => set({ time }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      setBarbershopSlug: (barbershopSlug) => set({ barbershopSlug }),
      confirm: () => set({ confirmed: true }),
      reset: () => set(INITIAL),
    }),
    {
      name: "booking",
      partialize: (s) => ({
        barbershopSlug: s.barbershopSlug,
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
