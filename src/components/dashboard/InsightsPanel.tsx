import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function InsightsPanel() {
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/metrics`)
      .then((res) => res.json())
      .then((data) => {
        const generated: string[] = [];

        // 🔴 Fake news insight
        if (data.fake_pct > 50) {
          generated.push(
            `Fake news is dominating (${data.fake_pct}%) — high misinformation risk.`
          );
        } else {
          generated.push(
            `Fake news is under control at ${data.fake_pct}%.`
          );
        }

        // 🟣 AI content insight
        if (data.ai_pct > 40) {
          generated.push(
            `High AI-generated content detected (${data.ai_pct}%).`
          );
        } else {
          generated.push(
            `AI-generated content is moderate (${data.ai_pct}%).`
          );
        }

        // 🟢 Real vs Human insight
        if (data.real > data.fake) {
          generated.push(
            "Most analyzed news appears to be reliable."
          );
        } else {
          generated.push(
            "Fake news detections exceed real news — caution advised."
          );
        }

        // 🧠 Total activity insight
        generated.push(
          `Total scans: ${data.total} with ${data.analysis_count} news and ${data.ai_count} AI checks.`
        );

        setInsights(generated);
      })
      .catch((err) => {
        console.error("Insights error:", err);
        setInsights(["Failed to load insights"]);
      });
  }, []);

  return (
    <Card className="rounded-2xl border-primary/20 dark:border-slate-800 bg-gradient-to-br from-cyan-100/90 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-[#10162d] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" /> AI Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="bg-gradient-to-br from-cyan-100/70 via-blue-100/70 to-purple-100/70 dark:from-slate-900/90 dark:via-slate-900/90 dark:to-[#10162d]/90 space-y-3">
        {insights.map((text, idx) => (
          <div
            key={idx}
            className="rounded-xl p-3 border dark:border-slate-800 bg-gradient-to-br from-cyan-100/85 via-blue-100/85 to-purple-100/85 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70"
          >
            <p className="text-sm flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 text-primary" />
              {text}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
