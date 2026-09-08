/**
 * Feature gating for the Barber SaaS platform.
 *
 * Rules:
 * - Feature membership is additive: PRO ⊃ BASIC, PREMIUM ⊃ PRO ⊃ BASIC
 * - The plan is stored in the JWT session (barbershopPlan) to avoid an extra
 *   DB round-trip on every request. Plan changes take effect on next login.
 *   For truly critical gates, re-fetch the plan from DB inside the action.
 * - Feature gating must live on BOTH the server (Server Actions / API) AND
 *   the client (hide UI). Hiding a button is not security — always enforce
 *   server-side too.
 */

import type { BarbershopPlan } from "@prisma/client";

// ─── Feature catalogue ───────────────────────────────────────────────────────

export const Feature = {
  // BASIC (available on all plans)
  BOOKING_PAGE:       "BOOKING_PAGE",
  ONLINE_BOOKING:     "ONLINE_BOOKING",
  WHATSAPP_CONFIRM:   "WHATSAPP_CONFIRM",
  CLIENT_MGMT:        "CLIENT_MGMT",
  APPOINTMENT_HISTORY:"APPOINTMENT_HISTORY",
  SCHEDULE:           "SCHEDULE",
  SERVICES_MGMT:      "SERVICES_MGMT",
  BARBERS_MGMT:       "BARBERS_MGMT",
  WORKING_HOURS:      "WORKING_HOURS",
  ADMIN_PANEL:        "ADMIN_PANEL",
  BASIC_DASHBOARD:    "BASIC_DASHBOARD",

  // PRO
  FULL_DASHBOARD:     "FULL_DASHBOARD",
  METRICS:            "METRICS",
  BASIC_REPORTS:      "BASIC_REPORTS",
  GOOGLE_REVIEWS:     "GOOGLE_REVIEWS",

  // PREMIUM
  ADVANCED_REPORTS:   "ADVANCED_REPORTS",
  INACTIVE_CLIENTS:   "INACTIVE_CLIENTS",
  CLIENT_RECOVERY:    "CLIENT_RECOVERY",
  AUTOMATION:         "AUTOMATION",
  MARKETING:          "MARKETING",
  ADVANCED_WHATSAPP:  "ADVANCED_WHATSAPP",
} as const;

export type Feature = typeof Feature[keyof typeof Feature];

// ─── Plan → feature sets ──────────────────────────────────────────────────────

const BASIC_SET = new Set<Feature>([
  Feature.BOOKING_PAGE,
  Feature.ONLINE_BOOKING,
  Feature.WHATSAPP_CONFIRM,
  Feature.CLIENT_MGMT,
  Feature.APPOINTMENT_HISTORY,
  Feature.SCHEDULE,
  Feature.SERVICES_MGMT,
  Feature.BARBERS_MGMT,
  Feature.WORKING_HOURS,
  Feature.ADMIN_PANEL,
  Feature.BASIC_DASHBOARD,
]);

const PRO_SET = new Set<Feature>([
  ...BASIC_SET,
  Feature.FULL_DASHBOARD,
  Feature.METRICS,
  Feature.BASIC_REPORTS,
  Feature.GOOGLE_REVIEWS,
]);

const PREMIUM_SET = new Set<Feature>([
  ...PRO_SET,
  Feature.ADVANCED_REPORTS,
  Feature.INACTIVE_CLIENTS,
  Feature.CLIENT_RECOVERY,
  Feature.AUTOMATION,
  Feature.MARKETING,
  Feature.ADVANCED_WHATSAPP,
]);

const PLAN_FEATURES: Record<BarbershopPlan, Set<Feature>> = {
  BASIC:   BASIC_SET,
  PRO:     PRO_SET,
  PREMIUM: PREMIUM_SET,
};

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Check client-side (or in layouts) whether a plan includes a feature. */
export function canAccess(plan: BarbershopPlan | null | undefined, feature: Feature): boolean {
  if (!plan) return false;
  return PLAN_FEATURES[plan]?.has(feature) ?? false;
}

/**
 * Server-side guard for Server Actions.
 * Throws if the session's plan does not include the requested feature.
 * Import getSession separately to avoid circular deps.
 */
export function assertFeature(plan: BarbershopPlan | null | undefined, feature: Feature): void {
  if (!canAccess(plan, feature)) {
    throw new Error(`Feature "${feature}" is not available on plan "${plan ?? "none"}".`);
  }
}
