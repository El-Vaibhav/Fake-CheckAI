import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, useEffect, useState } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode | ((data: any) => ReactNode);
  loading?: boolean;
  dataUrl?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function ChartCard({ title, children, loading, dataUrl }: ChartCardProps) {
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataUrl) return;

    let cancelled = false;

    const fetchData = async () => {
      setFetching(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}${dataUrl}`);
        const json = await res.json();

        let formatted = json;

        if (dataUrl.includes("chart-data")) {
          formatted = json.map((item: any) => {
            const parsedTime = new Date(item.time); // ❌ REMOVE "Z"

            return {
              time: isNaN(parsedTime.getTime())
                ? "Invalid"
                : parsedTime.toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),

              fake: item.fake ?? 0,
              ai: item.ai ?? 0,
            };
          });
        }

        if (!cancelled) setFetchedData(formatted);
      } catch (err) {
        console.error("ChartCard fetch error:", err);
        if (!cancelled) {
          setError("Failed to load data");
          setFetchedData(null);
        }
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  const isLoading = loading || (dataUrl ? fetching : false);

  return (
    <Card className="rounded-2xl border-border/60 dark:border-slate-800 shadow-sm bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="h-[240px] sm:h-[300px] p-3 sm:p-6 bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">

        {/* Loading */}
        {isLoading && (
          <Skeleton className="h-full w-full rounded-xl" />
        )}

        {/* Error */}
        {!isLoading && error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Empty */}
        {!isLoading && !error && dataUrl && (!fetchedData || fetchedData.length === 0) && (
          <p className="text-gray-500 text-sm">No data available</p>
        )}

        {/* Render */}
        {!isLoading && !error && (
          typeof children === "function"
            ? (children as (data: any) => ReactNode)(fetchedData)
            : children
        )}
      </CardContent>
    </Card>
  );
}
