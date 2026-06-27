import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendLabel?: string;
  icon: LucideIcon;
  positive?: boolean;
}

export function MetricCard({ title, value, trend, trendLabel = "selected period", icon: Icon, positive = true }: MetricCardProps) {
  return (
    <Card className="rounded-2xl border-border/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]">
      <CardContent className="p-5 bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
            <p className={cn("text-xs mt-2", positive ? "text-emerald-500" : "text-red-500")}>{trend} · {trendLabel}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
