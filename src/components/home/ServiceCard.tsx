import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL, formatDuration } from "@/lib/format";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  /** Optional click handler — turns the card into an interactive surface. */
  onSelect?: (service: Service) => void;
  selected?: boolean;
  className?: string;
}

export function ServiceCard({
  service,
  onSelect,
  selected,
  className,
}: ServiceCardProps) {
  const isInteractive = Boolean(onSelect);

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl tracking-[0.04em] text-foreground">
          {service.name}
        </h3>
        <span className="font-display text-2xl text-primary">
          {formatBRL(service.priceBRL)}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-foreground/65">
        <Clock className="size-3.5" />
        <span>{formatDuration(service.durationMin)}</span>
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(service)}
        aria-pressed={selected}
        className={cn(
          "group relative flex w-full flex-col rounded-lg border bg-card p-5 text-left transition-all duration-200",
          "hover:border-primary/60 hover:bg-secondary",
          "focus-ring",
          selected
            ? "border-primary bg-secondary ring-1 ring-primary"
            : "border-border",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/40",
        className,
      )}
    >
      {content}
    </article>
  );
}
