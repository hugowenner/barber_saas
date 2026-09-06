"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { StepNavigation } from "@/components/booking/StepNavigation";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { BarberSelector } from "@/components/booking/BarberSelector";
import { DateSelector } from "@/components/booking/DateSelector";
import { TimeSelector } from "@/components/booking/TimeSelector";
import { CustomerForm } from "@/components/booking/CustomerForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { useBookingStore } from "@/lib/booking-store";
import { useIsClient } from "@/hooks/use-is-client";
import { getTimeSlots } from "@/data/availability";
import type { Barber, BookingStep, Service } from "@/types";

const STEP_ORDER: BookingStep[] = [
  "service",
  "barber",
  "date",
  "time",
  "customer",
  "confirmation",
];

export default function AgendarPage() {
  const booking = useBookingStore();
  const isClient = useIsClient();
  // Local UI step (user-driven navigation).
  const [userStep, setUserStep] = useState<BookingStep>("service");

  // Derived step: if a previously-confirmed booking is rehydrated from
  // localStorage, force the confirmation view. This avoids setState-in-effect.
  const step: BookingStep =
    isClient && booking.confirmed ? "confirmation" : userStep;

  // Time slots depend on date + barber. Memoised.
  const slots = useMemo(() => {
    if (!booking.date) return [];
    const d = new Date(`${booking.date}T12:00:00`);
    return getTimeSlots(d, booking.anyBarber ? null : booking.barber);
  }, [booking.date, booking.barber, booking.anyBarber]);

  /* ---------- validation per step ---------- */
  const canAdvance: Record<BookingStep, boolean> = {
    service: Boolean(booking.service),
    barber: Boolean(booking.barber) || booking.anyBarber,
    date: Boolean(booking.date),
    time: Boolean(booking.time),
    customer:
      booking.customerName.trim().length >= 2 &&
      booking.customerPhone.replace(/\D/g, "").length >= 10,
    confirmation: !booking.confirmed, // button hidden once confirmed
  };

  const goNext = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1 && canAdvance[step]) {
      setUserStep(STEP_ORDER[idx + 1]);
    }
  };
  const goBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setUserStep(STEP_ORDER[idx - 1]);
  };

  /* ---------- handlers ---------- */
  const handleServiceSelect = (s: Service) => {
    booking.setService(s);
    // Auto-advance on mobile for less friction
    setTimeout(() => setUserStep("barber"), 180);
  };
  const handleBarberSelect = (b: Barber) => {
    booking.setAnyBarber(false);
    booking.setBarber(b);
    setTimeout(() => setUserStep("date"), 180);
  };
  const handleAnyBarber = () => {
    booking.setAnyBarber(true);
    setTimeout(() => setUserStep("date"), 180);
  };

  const handleConfirm = () => {
    booking.confirm();
  };

  const handleNewBooking = () => {
    booking.reset();
    setUserStep("service");
  };

  /* ---------- render ---------- */
  const showStepper = !booking.confirmed;
  const showSummary = step === "confirmation" && !booking.confirmed;

  return (
    <SiteShell>
      <div className="container-section py-8 sm:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar ao site
        </Link>

        {/* Page header */}
        <header className="mt-6 mb-8 flex items-center gap-3">
          <Calendar className="size-6 text-primary" />
          <h1 className="font-display text-3xl tracking-[0.08em] text-foreground sm:text-4xl">
            Agendamento
          </h1>
        </header>

        {/* Stepper */}
        {showStepper && (
          <BookingStepper
            current={step}
            onStepClick={(s) => setUserStep(s)}
            completed={new Set(
              STEP_ORDER.slice(0, STEP_ORDER.indexOf(step)).filter((s) =>
                canAdvance[s],
              ),
            )}
          />
        )}

        {/* Step content */}
        <div className="mt-10" key={step}>
          <div className="step-enter">
            {booking.confirmed && step === "confirmation" ? (
              <BookingConfirmation
                booking={{
                  service: booking.service,
                  barber: booking.barber,
                  anyBarber: booking.anyBarber,
                  date: booking.date,
                  time: booking.time,
                  customerName: booking.customerName,
                  customerPhone: booking.customerPhone,
                  confirmed: booking.confirmed,
                }}
                onNewBooking={handleNewBooking}
              />
            ) : step === "service" ? (
              <ServiceSelector
                value={booking.service}
                onSelect={handleServiceSelect}
              />
            ) : step === "barber" ? (
              <BarberSelector
                barber={booking.barber}
                anyBarber={booking.anyBarber}
                onSelectBarber={handleBarberSelect}
                onSelectAny={handleAnyBarber}
              />
            ) : step === "date" ? (
              <DateSelector value={booking.date} onSelect={booking.setDate} />
            ) : step === "time" ? (
              <TimeSelector
                slots={slots}
                value={booking.time}
                onSelect={booking.setTime}
                barber={booking.barber}
                anyBarber={booking.anyBarber}
              />
            ) : step === "customer" ? (
              <CustomerForm
                name={booking.customerName}
                phone={booking.customerPhone}
                onNameChange={booking.setCustomerName}
                onPhoneChange={booking.setCustomerPhone}
              />
            ) : showSummary ? (
              <BookingSummary
                booking={{
                  service: booking.service!,
                  barber: booking.barber,
                  anyBarber: booking.anyBarber,
                  date: booking.date!,
                  time: booking.time!,
                  customerName: booking.customerName,
                  customerPhone: booking.customerPhone,
                  confirmed: false,
                }}
                onConfirm={handleConfirm}
              />
            ) : null}
          </div>
        </div>

        {/* Step navigation (hidden on confirmation-success) */}
        {showStepper && (
          <StepNavigation
            onBack={goBack}
            onNext={goNext}
            nextLabel={step === "customer" ? "Revisar" : "Continuar"}
            nextDisabled={!canAdvance[step]}
            hideBack={step === "service"}
            hideNext={step === "confirmation"}
          />
        )}
      </div>
    </SiteShell>
  );
}
