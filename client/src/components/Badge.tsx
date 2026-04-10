import { clsx } from "clsx";

type Variant = "gray" | "blue" | "green" | "yellow" | "red" | "orange";

const variants: Record<Variant, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-700 border border-blue-100",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  yellow: "bg-amber-50 text-amber-700 border border-amber-100",
  red: "bg-red-50 text-red-600 border border-red-100",
  orange: "bg-orange-50 text-orange-700 border border-orange-100",
};

interface BadgeProps {
  label: string;
  variant?: Variant;
}

export function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variants[variant])}>
      {label}
    </span>
  );
}

export function jobStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    PENDING: { label: "Pending", variant: "yellow" },
    IN_PROGRESS: { label: "In Progress", variant: "blue" },
    COMPLETED: { label: "Completed", variant: "green" },
  };
  const config = map[status] ?? { label: status, variant: "gray" as Variant };
  return <Badge label={config.label} variant={config.variant} />;
}

export function invoiceStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    UNPAID: { label: "Unpaid", variant: "yellow" },
    PAID: { label: "Paid", variant: "green" },
    OVERDUE: { label: "Overdue", variant: "red" },
  };
  const config = map[status] ?? { label: status, variant: "gray" as Variant };
  return <Badge label={config.label} variant={config.variant} />;
}
