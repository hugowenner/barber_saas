"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOpenDays } from "@/data/availability";
import { formatDateShort, formatWeekdayShort } from "@/lib/format";
import { useIsClient } from "@/hooks/use-is-client";

interface DateSelectorProps {
  value: string | null; // yyyy-mm-dd
  onSelect: (iso: string) => void;
}

/**
 * Date picker rendered as a horizontal scroller of the next N open days.
 *
 * Days are computed client-side only — `getOpenDays()` uses `new Date()`
 * which differs between server and client. `useIsClient` returns `false`
 * during SSR and the first client render, so we render a stable skeleton
 * and avoid hydration mismatches.
 */
export function DateSelector({ value, onSelect }: DateSelectorProps) {
  const isClient = useIsClient();
  const days = isClient ? getOpenDays(6) : [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isClient) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [isClient]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Escolha a data
        </h2>
        <p className="text-sm text-muted-foreground">
          Próximos dias disponíveis.
        </p>
      </header>

      <div className="relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Datas anteriores"
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-secondary sm:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="radiogroup"
          aria-label="Dias disponíveis"
        >
          {!isClient
            ? // Skeleton — stable across SSR/CSR
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[88px] w-20 shrink-0 animate-pulse rounded-lg border border-border bg-card"
                  aria-hidden
                />
              ))
            : days.map((d) => {
                const iso = toISODate(d);
                const selected = value === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onSelect(iso)}
                    className={cn(
                      "flex w-20 shrink-0 flex-col items-center gap-1 rounded-lg border py-4 transition-all focus-ring",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs uppercase tracking-wider",
                        selected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatWeekdayShort(d)}
                    </span>
                    <span className="font-display text-2xl tracking-wide">
                      {formatDateShort(d)}
                    </span>
                  </button>
                );
              })}
        </div>

        {canRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximas datas"
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-secondary sm:flex"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
