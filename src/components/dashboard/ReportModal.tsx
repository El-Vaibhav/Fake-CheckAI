import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Report } from "@/data/dashboardMock";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportModal({ report, open, onOpenChange }: Props) {
  if (!report) return null;

  const isFake = report.type === "fake";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl border dark:border-slate-800 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {report.title}
            <Badge
              className={`uppercase ${isFake ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
              {report.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90">

          {/* LEFT */}
          <div className="space-y-3 p-4 rounded-xl bg-white/40 dark:bg-slate-900/60">
            <h4 className="font-semibold">Analyzed Text</h4>

            <p className="text-sm leading-6 p-4 rounded-xl bg-muted/50 dark:bg-slate-800/70 max-h-[250px] overflow-y-auto">
              {report.content}
            </p>

            <h4 className="font-semibold">Prediction Summary</h4>

            <p className="text-sm text-muted-foreground">
              This content is classified as{" "}
              <span className="font-semibold">
                {report.type.toUpperCase()}
              </span>{" "}
              with a confidence of{" "}
              <span className="font-semibold">
                {report.confidence_score}%
              </span>.
            </p>

            <p className="text-xs text-muted-foreground">
              Scanned on: {report.date}
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 p-4 rounded-xl bg-white/40 dark:bg-slate-900/60">

            <div className="rounded-xl border dark:border-slate-700 p-4">
              <p className="text-sm text-muted-foreground">
                Confidence Score
              </p>

              <p className="text-2xl font-bold my-2">
                {report.confidence_score}%
              </p>

              <Progress value={report.confidence_score} />
            </div>

            <div className="rounded-xl border dark:border-slate-700 p-4">
              <p className="font-medium">Analysis Steps</p>

              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                <li>Text processed</li>
                <li>Model classification completed</li>
                <li>Confidence score generated</li>
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                const url = `${import.meta.env.VITE_API_BASE_URL}/download-report/${report.id}`;
                // create hidden link to trigger download
                const link = document.createElement("a");
                link.href = url;
                link.download = `report_${report.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Downloading report...");
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
