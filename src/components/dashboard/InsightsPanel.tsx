import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import api from "@/api/api";

export function InsightsPanel() {
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    api
      .get("/metrics")
      .then((res) => {
        const data = res.data;

        const generated: string[] = [];

        const fakePct = Number(data.fake_pct ?? 0);
        const aiPct = Number(data.ai_pct ?? 0);

        const total = Number(data.total ?? 0);
        const analysis = Number(data.analysis_count ?? 0);
        const ai = Number(data.ai_count ?? 0);

        const real = Number(data.real ?? 0);
        const fake = Number(data.fake ?? 0);

        // Fake News
        if (fakePct > 50) {
          generated.push(
            `Fake news is dominating (${fakePct}%) — high misinformation risk.`
          );
        } else {
          generated.push(
            `Fake news is under control at ${fakePct}%.`
          );
        }

        // AI
        if (aiPct > 40) {
          generated.push(
            `High AI-generated content detected (${aiPct}%).`
          );
        } else {
          generated.push(
            `AI-generated content is moderate (${aiPct}%).`
          );
        }

        // Real vs Fake
        if (real > fake) {
          generated.push(
            "Most analyzed news appears to be reliable."
          );
        } else {
          generated.push(
            "Fake news detections exceed real news — caution advised."
          );
        }

        // Total scans
        generated.push(
          `Total scans: ${total} with ${analysis} news and ${ai} AI checks.`
        );

        setInsights(generated);
      })
      .catch((err) => {
        console.error("Insights error:", err);
        setInsights(["Unable to load insights"]);
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
