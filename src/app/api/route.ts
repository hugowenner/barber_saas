import { NextResponse } from "next/server";

/**
 * Health-check endpoint.
 * Useful for uptime monitoring and to verify the API layer is wired up.
 * Real domain routes (e.g. /api/appointments) will be added when the
 * persistence layer lands.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "barber-house",
    time: new Date().toISOString(),
  });
}
