"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

const EXCLUDED = new Set(["agendar", "admin", "saas-admin", "api", "planos", ""]);

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Link that resolves its base from the current tenant slug.
 * On global routes (/agendar, /admin, /, …) behaves exactly like
 * <Link href={anchor ?? "/"}>.
 * On tenant routes (/studio-alpha, /studio-alpha/agendar, …) prepends the slug:
 *   <TenantLink>              → /studio-alpha
 *   <TenantLink anchor="#s">  → /studio-alpha#s
 */
export function TenantLink({
  anchor = "",
  children,
  ...rest
}: Omit<LinkProps, "href"> & { anchor?: string }) {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1] ?? "";
  const base = EXCLUDED.has(firstSegment) ? "/" : `/${firstSegment}`;
  const href = anchor ? `${base}${anchor}` : base;

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
