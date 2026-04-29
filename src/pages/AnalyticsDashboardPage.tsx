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

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [compareList, setCompareList] = useState<Report[]>([]);
  const [loadingCharts] = useState(false);
  const [trendMode, setTrendMode] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [chartData, setChartData] = useState<any[]>([]);
  const [exports, setExports] = useState<ExportReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("30days");
  const [typeFilter, setTypeFilter] = useState("both");
  const [sourceData, setSourceData] = useState([]);
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

  const metrics = useMemo(() => {
    const total = metricsData.total;
    const fake = metricsData.fake;
    const ai = metricsData.ai_generated;
    const real = metricsData.real;
    const human = metricsData.human_written;
    const accuracy = metricsData.accuracy;
    const exported = metricsData.exported;

    // Prefer server-provided scoped percentages (fake_pct from analysis_logs, ai_pct from ai_detection_logs)
    const fakePct = typeof metricsData.fake_pct === "number" ? metricsData.fake_pct : (metricsData.analysis_count > 0 ? Math.round((fake / metricsData.analysis_count) * 100) : 0);
    const aiPct = typeof metricsData.ai_pct === "number" ? metricsData.ai_pct : (metricsData.ai_count > 0 ? Math.round((ai / metricsData.ai_count) * 100) : 0);

    return {
      total,
      fakePct,
      aiPct,
      accuracy: metricsData.accuracy || 0,
      exported: metricsData.exported || 0
    };
  }, [metricsData]);

  const handleCompare = (report: Report) => {
    setCompareList((prev) => {
      if (prev.some((r) => r.id === report.id)) return prev;
      if (prev.length >= 3) {
        toast.error("You can compare up to 3 reports at once.");
        return prev;
      }
      return [...prev, report];
    });
  };
  const navigate = useNavigate();

  const savedExports = exports;
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

  const realPieData = [
    { name: "Real News", value: metricsData.real },
    { name: "Fake News", value: metricsData.fake },
    { name: "AI Generated", value: metricsData.ai_generated },
  ];

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
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
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
                  <LineChart data={data}>
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
                <BarChart data={sourceData}>
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
          reports={data}
          onView={(r) => setSelectedReport(r)}
          onCompare={handleCompare}
          onToggleFavorite={(id) => setData((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)))}
          onDelete={(id) => {
            setData((prev) => prev.filter((r) => r.id !== id));
            setCompareList((prev) => prev.filter((r) => r.id !== id));
            toast.success("Report deleted");
          }}
        />
      </div>

      <Card className="rounded-2xl border-primary/15 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 animate-fade-in-up animation-delay-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comparison View</CardTitle>
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setCompareList([])}>
              Clear Selection
            </Button>
          )}
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70">
          <ComparisonView selected={compareList} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/15 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 animate-fade-in-up animation-delay-500">
        <CardHeader>
          <CardTitle>Saved Reports & Exports</CardTitle>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 space-y-3">
          {savedExports.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-3 bg-gradient-to-br from-cyan-100/85 via-blue-100/85 to-purple-100/85 flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
            >
              <div>
                <p className="font-medium">
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

              <div className="flex items-center gap-2">
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