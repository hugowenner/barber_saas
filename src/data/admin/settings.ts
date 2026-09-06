import type { AdminSettings } from "@/types/admin";
import { SITE_CONFIG } from "@/data/business";

/**
 * Initial values for the settings form, derived from the public site config.
 * In the real app, these come from the `barbershops` + `business_hours` tables.
 */
export const INITIAL_SETTINGS: AdminSettings = {
  barbershop: {
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    phone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    street: SITE_CONFIG.address.street,
    number: SITE_CONFIG.address.number,
    district: SITE_CONFIG.address.district,
    city: SITE_CONFIG.address.city,
    state: SITE_CONFIG.address.state,
    zip: SITE_CONFIG.address.zip,
  },
  hours: SITE_CONFIG.hours.map((h) => ({
    weekday: h.weekday,
    label: h.label,
    open: h.open,
    close: h.close,
    enabled: true,
  })),
  // Sunday (weekday 0) is closed — add it explicitly as disabled.
  ...(() => {
    const sunday = {
      weekday: 0,
      label: "Domingo",
      open: "09:00",
      close: "18:00",
      enabled: false,
    };
    return {};
  })(),
  booking: {
    minLeadHours: 2,
    defaultDurationMin: 30,
    allowCancellation: true,
    cancellationLeadHours: 2,
  },
  whatsapp: {
    enabled: true,
    phone: SITE_CONFIG.whatsapp,
    apiConnected: false,
  },
};

/** Full settings including Sunday as a disabled row. */
export function getInitialSettings(): AdminSettings {
  const sunday = {
    weekday: 0 as const,
    label: "Domingo",
    open: "09:00",
    close: "18:00",
    enabled: false,
  };
  return {
    ...INITIAL_SETTINGS,
    hours: [
      ...SITE_CONFIG.hours.map((h) => ({
        weekday: h.weekday,
        label: h.label,
        open: h.open,
        close: h.close,
        enabled: true,
      })),
      sunday,
    ].sort((a, b) => a.weekday - b.weekday),
  };
}
