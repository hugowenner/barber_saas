import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/admin";

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Aguardando",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  COMPLETED: {
    label: "Concluído",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  NO_SHOW: {
    label: "Não compareceu",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

export const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "PENDING", label: "Aguardando" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "NO_SHOW", label: "Não compareceu" },
];
