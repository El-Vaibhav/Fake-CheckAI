import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Report } from "@/data/dashboardMock";

interface Props {
  selected: Report[];
}

export function ComparisonView({ selected }: Props) {
  if (selected.length === 0) {
    return (
      <Card className="rounded-2xl border-dashed dark:border-slate-700 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]">
        <CardContent className="h-32 bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90 flex items-center justify-center text-muted-foreground">
          Select reports with the Compare action to see side-by-side differences.
        </CardContent>
      </Card>
    );
  }

  const getColor = (type: string) => {
    if (type === "fake") return "bg-red-500 text-white";
    if (type === "ai") return "bg-red-700 text-white";
    if (type === "real") return "bg-green-600 text-white";
    if (type === "human") return "bg-green-400 text-black";
    return "bg-gray-300";
  };

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {selected.map((report) => (
        <Card
          key={report.id}
          className="rounded-2xl border dark:border-slate-800 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]"
        >
          <CardHeader>
            <CardTitle className="text-sm line-clamp-2">
              {report.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90 space-y-3 text-sm">

            {/* TYPE */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span className={`px-2 py-1 rounded text-xs uppercase ${getColor(report.type)}`}>
                {report.type}
              </span>
            </div>

            {/* CONFIDENCE */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{report.confidence_score}%</span>
            </div>

            {/* DATE */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{report.date}</span>
            </div>

            {/* SOURCE */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span>{report.source}</span>
            </div>

            {/* TEXT PREVIEW */}
            <div>
              <span className="text-muted-foreground">Preview</span>
              <p className="text-xs mt-1 line-clamp-3">
                {report.title}
              </p>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}
