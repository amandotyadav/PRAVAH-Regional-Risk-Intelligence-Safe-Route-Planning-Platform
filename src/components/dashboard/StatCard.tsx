import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  variant: "danger" | "warning" | "success" | "info";
}

const variantStyles = {
  danger: {
    icon: "text-red-700",
    value: "text-slate-900",
  },
  warning: {
    icon: "text-amber-700",
    value: "text-slate-900",
  },
  success: {
    icon: "text-emerald-700",
    value: "text-slate-900",
  },
  info: {
    icon: "text-blue-700",
    value: "text-slate-900",
  },
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="border-l-2 border-slate-200 bg-white px-4 py-3 transition hover:border-slate-400">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center ${styles.icon}`}>
          <Icon size={17} />
        </div>

        <span className="text-sm text-slate-600">{title}</span>
      </div>

      <p className={`mt-2 text-2xl font-semibold tabular-nums ${styles.value}`}>{value}</p>

      <p className="mt-0.5 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default StatCard;
