"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/data/business";

const EXCLUDED_SEGMENTS = new Set(["agendar", "admin", "saas-admin", "api", ""]);

function useBookingHref() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1] ?? "";
  return EXCLUDED_SEGMENTS.has(firstSegment)
    ? "/agendar"
    : `/${firstSegment}/agendar`;
}

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Barbeiros", href: "/#barbeiros" },
  { label: "A barbearia", href: "/#ambiente" },
  { label: "Contato", href: "/#contato" },
];

export function Header() {
  const bookingHref = useBookingHref();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="container-section flex h-16 items-center justify-between sm:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-ring rounded-sm"
          aria-label={`${SITE_CONFIG.name} — página inicial`}
        >
          <BrandMark />
          <span className="font-display text-lg tracking-[0.18em] text-foreground sm:text-xl">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegação principal"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={bookingHref}>
              <Calendar className="size-4" />
              Agendar
            </Link>
          </Button>
          <Button asChild size="default" className="sm:hidden">
            <Link href={bookingHref}>
              <Calendar className="size-4" />
              Agendar
            </Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-ring md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden animate-fade-in border-t border-border bg-background"
        >
          <nav
            className="container-section flex flex-col py-4"
            aria-label="Navegação mobile"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* Small brand mark — vertical barbershop pole in gold */
function BrandMark() {
  return (
    <span
      aria-hidden
      className="inline-flex size-7 items-center justify-center rounded-sm border border-primary/40 bg-secondary"
    >
      <span className="block h-4 w-px bg-primary" />
      <span className="mx-px block h-4 w-px bg-foreground/60" />
      <span className="block h-4 w-px bg-primary" />
    </span>
  );
}
