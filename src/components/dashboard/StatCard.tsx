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
    icon: "bg-red-400/10 text-red-400",
    value: "text-red-400",
  },
  warning: {
    icon: "bg-amber-400/10 text-amber-400",
    value: "text-amber-400",
  },
  success: {
    icon: "bg-emerald-400/10 text-emerald-400",
    value: "text-emerald-400",
  },
  info: {
    icon: "bg-cyan-400/10 text-cyan-400",
    value: "text-cyan-400",
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
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon size={17} />
        </div>

        <span className="text-xs text-slate-400">{title}</span>
      </div>

      <p className={`mt-5 text-3xl font-bold ${styles.value}`}>{value}</p>

      <p className="mt-1 text-[10px] text-slate-600">{description}</p>
    </div>
  );
}

export default StatCard;
