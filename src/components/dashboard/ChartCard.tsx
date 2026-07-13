import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
}

export function ChartCard({
  title,
  children,
  loading = false,
}: ChartCardProps) {
  return (
    <Card className="rounded-2xl border-border/60 dark:border-slate-800 shadow-sm bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[240px] sm:h-[300px] p-3 sm:p-6 bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}