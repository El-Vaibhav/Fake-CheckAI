import {
  Shield,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Info,
  Cpu
} from "lucide-react";

type ResultProps = {
  result: {
    prediction: "ai" | "human";
    confidence: number;
    reasons: string[];
    aiProbability: number;
    humanProbability: number;
  };
};

export function AIResultsSection({ result }: ResultProps) {
  const isHuman = result.prediction === "human";

  return (
    <div className="mt-8 animate-fade-in-up">
      <div
        className={`glass rounded-3xl p-6 lg:p-8 shadow-xl border-2 ${
          isHuman ? "border-success/30" : "border-destructive/30"
        }`}
      >
        {/* Prediction Header */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-8">
          {/* Badge */}
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl ${
              isHuman ? "bg-success/10" : "bg-destructive/10"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isHuman
                  ? "bg-success glow-success"
                  : "bg-destructive glow-danger"
              }`}
            >
              {isHuman ? (
                <Shield className="w-8 h-8 text-success-foreground" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-destructive-foreground" />
              )}
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Authorship Result
              </div>
              <div
                className={`text-2xl lg:text-3xl font-bold ${
                  isHuman ? "text-success" : "text-destructive"
                }`}
              >
                {isHuman ? "HUMAN WRITTEN" : "AI GENERATED"}
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Confidence Score
              </span>

              <span
                className={`text-2xl font-bold ${
                  isHuman ? "text-success" : "text-destructive"
                }`}
              >
                {result.confidence}%
              </span>
            </div>

            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isHuman
                    ? "bg-gradient-to-r from-success to-secondary"
                    : "bg-gradient-to-r from-destructive to-orange-500"
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI vs Human Probability Breakdown */}
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Probability Breakdown
          </h3>

          {/* AI Probability */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>AI Probability</span>
              <span className="font-semibold text-destructive">
                {result.aiProbability.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive transition-all duration-1000"
                style={{ width: `${result.aiProbability}%` }}
              />
            </div>
          </div>

          {/* Human Probability */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Human Probability</span>
              <span className="font-semibold text-success">
                {result.humanProbability.toFixed(2)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-1000"
                style={{ width: `${result.humanProbability}%` }}
              />
            </div>
          </div>
        </div>

        {/* Analysis Reasons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Why This Prediction?
          </h3>

          <div className="grid gap-3">
            {result.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {isHuman ? (
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}

                <p className="text-sm text-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Models Used:
            </span>

            {[
              "TF-IDF (n-gram)",
              "Stylometric Analysis",
              "Logistic Regression"
            ].map((model) => (
              <span
                key={model}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
