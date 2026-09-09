"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { getTimeSlots, type BookedInterval, type HourConfig, SLOT_INTERVAL_MIN } from "@/data/availability";
import { createPublicBooking, getBookedSlots } from "@/lib/actions/booking";
import type { Barber, BookingStep, Service } from "@/types";

interface ShopInfo {
  name: string;
  whatsapp: string;
  address: string;
  timezone: string;
}

interface BookingClientProps {
  services: Service[];
  barbers: Barber[];
  businessHours: HourConfig[];
  shop: ShopInfo;
  barbershopSlug: string;
  backHref?: string;
}

const STEP_ORDER: BookingStep[] = [
  "service",
  "barber",
  "date",
  "time",
  "customer",
  "confirmation",
];

export function BookingClient({
  services,
  barbers,
  businessHours,
  shop,
  barbershopSlug,
  backHref = "/",
}: BookingClientProps) {
  const booking = useBookingStore();
  const isClient = useIsClient();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [userStep, setUserStep] = useState<BookingStep>("service");
  const [bookedIntervals, setBookedIntervals] = useState<BookedInterval[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Reset booking state if the user navigated from a different tenant
  useEffect(() => {
    if (!isClient) return;
    const storedSlug = booking.barbershopSlug;
    if (storedSlug && storedSlug !== barbershopSlug) {
      booking.reset();
    }
    if (booking.barbershopSlug !== barbershopSlug) {
      booking.setBarbershopSlug(barbershopSlug);
    }
  }, [isClient]); // intentional: run only once on mount

  const step: BookingStep =
    isClient && booking.confirmed ? "confirmation" : userStep;

  // Fetch real availability from the server whenever date or barber selection changes
  useEffect(() => {
    if (!booking.date) return;
    let cancelled = false;
    setIsLoadingSlots(true);
    getBookedSlots(
      barbershopSlug,
      booking.date,
      booking.anyBarber ? null : (booking.barber?.id ?? null),
      booking.anyBarber,
    ).then((intervals) => {
      if (!cancelled) {
        setBookedIntervals(intervals);
        setIsLoadingSlots(false);
      }
    });
    return () => { cancelled = true; };
  }, [barbershopSlug, booking.date, booking.barber?.id, booking.anyBarber]);

  const slots = useMemo(() => {
    if (!booking.date) return [];
    return getTimeSlots(
      booking.date,
      booking.anyBarber ? null : booking.barber,
      businessHours,
      bookedIntervals,
      booking.service?.durationMin ?? SLOT_INTERVAL_MIN,
      shop.timezone,
    );
  }, [booking.date, booking.barber, booking.anyBarber, businessHours, bookedIntervals, booking.service?.durationMin, shop.timezone]);

  const canAdvance: Record<BookingStep, boolean> = {
    service: Boolean(booking.service),
    barber: Boolean(booking.barber) || booking.anyBarber,
    date: Boolean(booking.date),
    time: Boolean(booking.time),
    customer:
      booking.customerName.trim().length >= 2 &&
      booking.customerPhone.replace(/\D/g, "").length >= 10,
    confirmation: !booking.confirmed,
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

  const handleServiceSelect = (s: Service) => {
    booking.setService(s);
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
    if (!booking.service || !booking.date || !booking.time) return;
    startTransition(async () => {
      const result = await createPublicBooking({
        barbershopSlug,
        serviceId: booking.service!.id,
        barberId: booking.anyBarber ? null : (booking.barber?.id ?? null),
        anyBarber: booking.anyBarber,
        date: booking.date!,
        time: booking.time!,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
      });
      if (result.ok) {
        booking.confirm();
      } else {
        toast({
          title: "Erro ao confirmar",
          description: result.error ?? "Tente novamente.",
          variant: "destructive",
        });
      }
    });
  };

  const handleNewBooking = () => {
    booking.reset();
    setUserStep("service");
  };

  const showStepper = !booking.confirmed;
  const showSummary = step === "confirmation" && !booking.confirmed;

  return (
    <SiteShell>
      <div className="container-section py-8 sm:py-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
        >
          <ArrowLeft className="size-4" />
          Voltar ao site
        </Link>

        <header className="mt-6 mb-8 flex items-center gap-3">
          <Calendar className="size-6 text-primary" />
          <h1 className="font-display text-3xl tracking-[0.08em] text-foreground sm:text-4xl">
            Agendamento
          </h1>
        </header>

        {showStepper && (
          <BookingStepper
            current={step}
            onStepClick={(s) => setUserStep(s)}
            completed={new Set(
              STEP_ORDER.slice(0, STEP_ORDER.indexOf(step)).filter((s) => canAdvance[s]),
            )}
          />
        )}

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
                shopName={shop.name}
                shopWhatsapp={shop.whatsapp}
                shopAddress={shop.address}
              />
            ) : step === "service" ? (
              <ServiceSelector
                value={booking.service}
                onSelect={handleServiceSelect}
                services={services}
              />
            ) : step === "barber" ? (
              <BarberSelector
                barber={booking.barber}
                anyBarber={booking.anyBarber}
                onSelectBarber={handleBarberSelect}
                onSelectAny={handleAnyBarber}
                barbers={barbers}
              />
            ) : step === "date" ? (
              <DateSelector
                value={booking.date}
                onSelect={booking.setDate}
                businessHours={businessHours}
              />
            ) : step === "time" ? (
              <TimeSelector
                slots={slots}
                value={booking.time}
                onSelect={booking.setTime}
                barber={booking.barber}
                anyBarber={booking.anyBarber}
                isLoading={isLoadingSlots}
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

        {showStepper && (
          <StepNavigation
            onBack={goBack}
            onNext={goNext}
            nextLabel={step === "customer" ? "Revisar" : "Continuar"}
            nextDisabled={!canAdvance[step] || isPending}
            hideBack={step === "service"}
            hideNext={step === "confirmation"}
          />
        )}
      </div>
    </SiteShell>
  );
}
