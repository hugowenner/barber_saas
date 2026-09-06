"use client";

import { cn } from "@/lib/utils";
import type { BookingStep } from "@/types";

interface BookingStepperProps {
  current: BookingStep;
  /** Render the step as completed (checkmark) instead of numbered */
  completed?: Set<BookingStep>;
  onStepClick?: (step: BookingStep) => void;
}

const STEPS: { id: BookingStep; label: string; short: string }[] = [
  { id: "service", label: "Serviço", short: "Serviço" },
  { id: "barber", label: "Barbeiro", short: "Barbeiro" },
  { id: "date", label: "Data", short: "Data" },
  { id: "time", label: "Horário", short: "Hora" },
  { id: "customer", label: "Seus dados", short: "Dados" },
  { id: "confirmation", label: "Confirmação", short: "Resumo" },
];

export function BookingStepper({
  current,
  completed,
  onStepClick,
}: BookingStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Etapas do agendamento" className="w-full">
      {/* Desktop — horizontal with labels */}
      <ol className="hidden items-center sm:flex">
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === current;
          const isCompleted = completed?.has(step.id) ?? idx < currentIndex;
          const isClickable = Boolean(onStepClick) && (isCompleted || isCurrent);

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 transition-colors",
                  isClickable && "cursor-pointer",
                  !isClickable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isCompleted && !isCurrent && "border-primary bg-primary/10 text-primary",
                    !isCurrent && !isCompleted && "border-border text-muted-foreground",
                  )}
                >
                  {idx + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && !isCurrent && "text-foreground/80",
                    !isCurrent && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    idx < currentIndex ? "bg-primary/60" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile — compact progress with current step label */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-primary">
            Etapa {currentIndex + 1} de {STEPS.length}
          </span>
          <span className="text-sm text-foreground">{STEPS[currentIndex].label}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((step, idx) => (
            <span
              key={step.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                idx <= currentIndex ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
