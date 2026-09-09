"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

// Path segments that are NOT barbershop slugs
const EXCLUDED = new Set(["agendar", "admin", "saas-admin", "api", ""]);

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Renders an <a> that links to /agendar on the home page and to
 * /{slug}/agendar when the viewer is already on a barbershop tenant page.
 * Drop-in replacement for <Link href="/agendar">.
 */
export function BookingLink({ children, ...rest }: Omit<LinkProps, "href">) {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1] ?? "";
  const href = EXCLUDED.has(firstSegment)
    ? "/agendar"
    : `/${firstSegment}/agendar`;

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
