import { useMemo, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { ComparisonView } from "@/components/dashboard/ComparisonView";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { ReportModal } from "@/components/dashboard/ReportModal";
import { pieData, sourceBarData, trendData, Report } from "@/data/dashboardMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity, ArrowRight, FileText, Search, ShieldAlert, Sparkles, Target } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router";

const pieColors = {
  "Real News": "#22c55e",   // green
  "Fake News": "#ef4444",   // red
  "AI Generated": "#8b5cf6" // purple
};

type ExportReport = {
  id: number;
  report_id: number;
  type: string;
  date: string;
  text: string;
};

type DashboardReport = Report & {
  createdAt: string;
};

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<DashboardReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DashboardReport | null>(null);
  const [compareList, setCompareList] = useState<DashboardReport[]>([]);
  const [loadingCharts] = useState(false);
  const [trendMode, setTrendMode] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [exports, setExports] = useState<ExportReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("30days");
  const [typeFilter, setTypeFilter] = useState("both");
  const [sourceData, setSourceData] = useState<{ name: string; value: number }[]>([]);
  const [loadingState, setLoadingState] = useState({
    source: true,
    exports: true,
    chart: true,
    table: true,
    metrics: true,
  });

  const [metricsData, setMetricsData] = useState({
    total: 0,
    analysis_count: 0,
    ai_count: 0,
    fake: 0,
    real: 0,
    ai_generated: 0,
    human_written: 0,
    fake_pct: 0,
    ai_pct: 0,
    accuracy: 0,
    exported: 0
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/source-wise-stats`)
      .then(res => res.json())
      .then(data => setSourceData(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingState((prev) => ({ ...prev, source: false })));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/exports`)
      .then(res => res.json())
      .then(data => setExports(data))
      .catch(err => console.error("Export fetch error:", err))
      .finally(() => setLoadingState((prev) => ({ ...prev, exports: false })));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/chart-data`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          count: item.count
        }));

        setChartData(formatted);
      })
      .catch(err => console.error("Chart error:", err))
      .finally(() => setLoadingState((prev) => ({ ...prev, chart: false })));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/table-data`)
      .then(res => res.json())
      .then(apiData => {
        // 🔥 convert backend → your Report format
        const formatted = apiData.map((item: any, index: number) => {
          const parsedDate = new Date(item.date);

          return {
            id: String(item.id),

            // TITLE
            title: item.text?.slice(0, 60) || "No title",

            content: item.text || "No content available",

            //  TYPE NORMALIZATION
            type:
              item.type === "Fake"
                ? "fake"
                : item.type === "Real"
                  ? "real"
                  : item.type === "AI Generated"
                    ? "ai"
                    : item.type === "Human Written"
                      ? "human"
                      : "unknown",

            // CONFIDENCE
            confidence_score:
              item.type === "Fake" || item.type === "Real"
                ? Math.round(item.confidence * 100)
                : Math.round(item.confidence),

            // DATE
            date: parsedDate.toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),

            source:
              item.type === "AI Generated" || item.type === "Human Written"
                ? "AI Detection"
                : "News Analysis",
            createdAt: item.date,

            exported: false,
            favorite: false,
          };
        });

        setData(formatted);
      })
      .catch(err => console.error("Error fetching table data:", err))
      .finally(() => setLoadingState((prev) => ({ ...prev, table: false })));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/metrics`)
      .then(res => res.json())
      .then(data => {
        console.log("METRICS:", data); // debug log
        // normalize and guard types
        const normalized = {
          total: Number(data.total || 0),
          analysis_count: Number(data.analysis_count || 0),
          ai_count: Number(data.ai_count || 0),
          fake: Number(data.fake || 0),
          real: Number(data.real || 0),
          ai_generated: Number(data.ai_generated || 0),
          human_written: Number(data.human_written || 0),
          fake_pct: Number(data.fake_pct ?? 0),
          ai_pct: Number(data.ai_pct ?? 0),
          accuracy: Number(data.accuracy || 0),
          exported: Number(data.exported || 0)
        };

        setMetricsData(normalized);
      })
      .catch(err => console.error("Metrics error:", err))
      .finally(() => setLoadingState((prev) => ({ ...prev, metrics: false })));
  }, []);

  const dateFilteredData = useMemo(() => {
    if (dateFilter === "alltime") return data;

    const days = dateFilter === "7days" ? 7 : dateFilter === "90days" ? 90 : 30;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days);

    return data.filter((r) => {
      const parsed = new Date(r.createdAt);
      return !isNaN(parsed.getTime()) && parsed >= cutoff;
    });
  }, [data, dateFilter]);

  const filteredData = useMemo(() => {
    if (typeFilter === "fake") return dateFilteredData.filter((r) => r.type === "fake" || r.type === "real");
    if (typeFilter === "ai") return dateFilteredData.filter((r) => r.type === "ai" || r.type === "human");
    return dateFilteredData;
  }, [dateFilteredData, typeFilter]);

  const metrics = useMemo(() => {
    const total = filteredData.length;
    const fakeCount = filteredData.filter((r) => r.type === "fake").length;
    const aiCount = filteredData.filter((r) => r.type === "ai").length;
    const analysisCount = filteredData.filter((r) => r.type === "fake" || r.type === "real").length;
    const aiDetectionCount = filteredData.filter((r) => r.type === "ai" || r.type === "human").length;
    const accuracy =
      total > 0
        ? Number(
          (
            filteredData.reduce((sum, row) => sum + (Number(row.confidence_score) || 0), 0) / total
          ).toFixed(2)
        )
        : 0;

    return {
      total,
      fakePct: analysisCount > 0 ? Math.round((fakeCount / analysisCount) * 100) : 0,
      aiPct: aiDetectionCount > 0 ? Math.round((aiCount / aiDetectionCount) * 100) : 0,
      accuracy,
      exported: metricsData.exported || 0
    };
  }, [filteredData, metricsData.exported]);

  const handleCompare = (report: Report) => {
    const enrichedReport: DashboardReport = {
      ...report,
      createdAt: new Date().toISOString(), // or report.date if exists
    };

    setCompareList((prev) => {
      if (prev.some((r) => r.id === report.id)) return prev;
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 reports at once.");
        return prev;
      }
      return [...prev, enrichedReport];
    });
  };
  const navigate = useNavigate();

  const savedExports = useMemo(() => {
    if (dateFilter === "alltime") return exports;

    const days = dateFilter === "7days" ? 7 : dateFilter === "90days" ? 90 : 30;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days);

    return exports.filter((item) => {
      const parsed = new Date(item.date);
      return !isNaN(parsed.getTime()) && parsed >= cutoff;
    });
  }, [exports, dateFilter]);
  const trendSeries = useMemo(() => {
    if (trendMode === "Weekly") {
      return trendData.map((point, idx) => ({
        ...point,
        fake: Math.round(point.fake * 1.8 + idx),
        ai: Math.round(point.ai * 1.6 + idx),
      }));
    }
    if (trendMode === "Monthly") {
      return trendData.map((point, idx) => ({
        ...point,
        fake: Math.round(point.fake * 3.2 + idx * 2),
        ai: Math.round(point.ai * 2.9 + idx * 2),
      }));
    }
    return trendData;
  }, [trendMode]);

  const isDashboardLoading = Object.values(loadingState).some(Boolean);

  const realPieData = useMemo(() => {
    const realCount = filteredData.filter((r) => r.type === "real").length;
    const fakeCount = filteredData.filter((r) => r.type === "fake").length;
    const aiCount = filteredData.filter((r) => r.type === "ai").length;

    if (typeFilter === "fake") {
      return [
        { name: "Real News", value: realCount },
        { name: "Fake News", value: fakeCount },
      ];
    }

    if (typeFilter === "ai") {
      return [
        { name: "AI Generated", value: aiCount },
      ];
    }

    return [
      { name: "Real News", value: realCount },
      { name: "Fake News", value: fakeCount },
      { name: "AI Generated", value: aiCount },
    ];
  }, [filteredData, typeFilter]);

  const displayedSourceData = useMemo(() => {
    if (typeFilter === "both") return sourceData;
    const counts: Record<string, number> = {};
    filteredData.forEach((r) => {
      counts[r.source] = (counts[r.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData, sourceData, typeFilter]);

  const aggregateTrendByMode = useMemo(() => {
    return (rows: Array<{ time: string; fake: number; ai: number }>) => {
      if (trendMode === "Daily") return rows;

      const chunkSize = trendMode === "Weekly" ? 7 : 30;
      const aggregated: Array<{ time: string; fake: number; ai: number }> = [];

      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        if (chunk.length === 0) continue;

        aggregated.push({
          time: chunk[chunk.length - 1].time,
          fake: chunk.reduce((sum, r) => sum + (r.fake || 0), 0),
          ai: chunk.reduce((sum, r) => sum + (r.ai || 0), 0),
        });
      }

      return aggregated;
    };
  }, [trendMode]);

  const displayedTrendData = useMemo(() => {
    const baseRows =
      typeFilter === "both"
        ? chartData
        : Object.values(
          filteredData.reduce((acc, r) => {
            const time = r.date.split(",")[0]?.trim() || r.date;
            if (!acc[time]) acc[time] = { time, fake: 0, ai: 0 };
            if (r.type === "fake") acc[time].fake += 1;
            if (r.type === "ai") acc[time].ai += 1;
            return acc;
          }, {} as Record<string, { time: string; fake: number; ai: number }>)
        );

    return aggregateTrendByMode(baseRows);
  }, [filteredData, chartData, typeFilter, aggregateTrendByMode]);

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
    >

      {isDashboardLoading && (
        <div className="mb-4 rounded-xl border border-primary/20 dark:border-slate-700 bg-primary/5 dark:bg-slate-900/60 px-4 py-3 text-sm text-primary">
          Please wait for a few seconds while data is being fetched.
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <MetricCard title="Total Scans" value={`${metrics.total}`} trend="+12.4%" icon={Activity} />
        <MetricCard title="Fake News Detected" value={`${metrics.fakePct}%`} trend="+5.2%" icon={ShieldAlert} positive={false} />
        <MetricCard title="AI Generated Content" value={`${metrics.aiPct}%`} trend="+3.7%" icon={Sparkles} positive={false} />
        <MetricCard title="Accuracy Score" value={`${metrics.accuracy}%`} trend="+1.9%" icon={Target} />
        <MetricCard title="Reports Exported" value={`${metrics.exported ?? metrics.total}`} trend="+14.1%" icon={FileText} />
      </div>

      <div className="grid lg:grid-cols-12 gap-4 animate-fade-in-up animation-delay-100">
        <div className="lg:col-span-7 space-y-4">
          <ChartCard title="Detection Trends Over Time" dataUrl="/chart-data">
            {(data) => (
              <div className="h-full">
                <div className="flex gap-2 mb-3">
                  {(["Daily", "Weekly", "Monthly"] as const).map((mode) => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={trendMode === mode ? "default" : "outline"}
                      onClick={() => setTrendMode(mode)}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={typeFilter === "both" ? aggregateTrendByMode(data || []) : displayedTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="time" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />

                    {/* 🔴 Fake News */}
                    <Line
                      type="monotone"
                      dataKey="fake"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={800}
                    />

                    {/* 🟣 AI Generated */}
                    <Line
                      type="monotone"
                      dataKey="ai"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartCard title="Category Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={realPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {realPieData.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[entry.name as keyof typeof pieColors]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 animate-fade-in-up animation-delay-200">
        <div className="lg:col-span-8">
          <ChartCard title="Source-wise Analysis" loading={loadingCharts}>

            {/* 🔥 Wrapper to position button */}
            <div className="relative h-full">

              <Button
                variant="hero-outline"
                size="sm"
                className="absolute top-2 right-2 z-10 px-3 py-1.5 text-xs shadow-md"
                onClick={() => navigate("/cross-verify")}
              >
                Analyze more
              </Button>

              {/* Chart */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedSourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-4">
          <InsightsPanel />
        </div>
      </div>

      <div className="animate-fade-in-up animation-delay-300">
        <DataTable
          reports={filteredData}
          externalSearchQuery={searchQuery}
          onView={(r) =>
            setSelectedReport({
              ...r,
              createdAt: new Date().toISOString(),
            })
          }
          onCompare={handleCompare}
          onToggleFavorite={(id) => setData((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)))}
          onDelete={(id) => {
            setData((prev) => prev.filter((r) => r.id !== id));
            setCompareList((prev) => prev.filter((r) => r.id !== id));
            toast.success("Report deleted");
          }}
        />
      </div>

      <Card className="rounded-2xl border-primary/15 dark:border-slate-800 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d] animate-fade-in-up animation-delay-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comparison View</CardTitle>
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setCompareList([])}>
              Clear Selection
            </Button>
          )}
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">
          <ComparisonView selected={compareList} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/15 dark:border-slate-800 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d] animate-fade-in-up animation-delay-500">
        <CardHeader>
          <CardTitle>Saved Reports & Exports</CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90 space-y-3">
          {savedExports.map((item) => (
            <div
              key={item.id}
              className="border dark:border-slate-800 rounded-xl p-3 bg-gradient-to-br from-cyan-100/85 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70 flex flex-col sm:flex-row sm:items-center gap-2 justify-between overflow-hidden"
            >
              <div className="min-w-0">
                <p className="font-medium break-words">
                  {(
                    item.text
                      ?.slice(0, 50)
                      .replace(/[^\w\s]/gi, "") // remove special chars
                      .trim()
                      .replace(/\s+/g, "_") // spaces → underscore
                  ) || "report"} .pdf
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="uppercase">{item.type}</Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/download-report/${item.report_id}`;
                    window.open(url);
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
          {savedExports.length === 0 && <p className="text-sm text-muted-foreground">No exported PDFs yet.</p>}
        </CardContent>
      </Card>

      <ReportModal report={selectedReport} open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)} />
    </DashboardLayout>
  );
}