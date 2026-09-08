import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Barber } from "@/types";

interface BarberCardProps {
  barber: Barber;
  onSelect?: (barber: Barber) => void;
  selected?: boolean;
  className?: string;
}

export function BarberCard({
  barber,
  onSelect,
  selected,
  className,
}: BarberCardProps) {
  const isInteractive = Boolean(onSelect);
  const initials = barber.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  const cardClass = cn(
    "group flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200",
    isInteractive && "text-left focus-ring hover:border-primary/60",
    selected ? "border-primary ring-1 ring-primary" : "border-border",
    className,
  );

  const body = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        {barber.imageUrl ? (
          <Image
            src={barber.imageUrl}
            alt={`Foto de ${barber.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-5xl text-primary">
            {initials}
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-display text-xl tracking-[0.04em] text-foreground">
          {barber.name}
        </h3>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">
          {barber.specialty}
        </p>
        <p className="text-sm text-muted-foreground">{barber.bio}</p>
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(barber)}
        aria-pressed={selected}
        className={cardClass}
      >
        {body}
      </button>
    );
  }

  return <article className={cardClass}>{body}</article>;
}
