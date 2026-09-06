"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Hide the next button (e.g. confirmation step uses its own CTA) */
  hideNext?: boolean;
  /** Hide the back button (e.g. first step) */
  hideBack?: boolean;
}

/**
 * Sticky bottom navigation bar for the booking flow.
 * Big tap targets, comfortable on mobile.
 */
export function StepNavigation({
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  hideNext,
  hideBack,
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex items-center gap-3">
      {!hideBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-12 px-5 text-base text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      )}
      {!hideNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="ml-auto h-12 px-7 text-base"
        >
          {nextLabel}
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
