import { Shield, ShieldAlert, CheckCircle, AlertTriangle, TrendingUp, Info } from "lucide-react";

type ResultProps = {
  result: {
    prediction: "real" | "fake";
    confidence: number;
    reasons: string[];
  };
};

export function ResultsSection({ result }: ResultProps) {
  const isReal = result.prediction === "real";

  return (
    <div className="mt-8 animate-fade-in-up">
      <div className={`glass rounded-3xl p-6 lg:p-8 shadow-xl border-2 ${
        isReal ? "border-success/30" : "border-destructive/30"
      }`}>
        {/* Prediction Header */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-8">
          {/* Badge */}
          <div className={`flex items-center gap-4 p-4 rounded-2xl ${
            isReal ? "bg-success/10" : "bg-destructive/10"
          }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isReal ? "bg-success glow-success" : "bg-destructive glow-danger"
            }`}>
              {isReal ? (
                <Shield className="w-8 h-8 text-success-foreground" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-destructive-foreground" />
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Prediction Result</div>
              <div className={`text-2xl lg:text-3xl font-bold ${
                isReal ? "text-success" : "text-destructive"
              }`}>
                {isReal ? "REAL NEWS" : "FAKE NEWS"}
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
              <span className={`text-2xl font-bold ${
                isReal ? "text-success" : "text-destructive"
              }`}>
                {result.confidence}%
              </span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isReal 
                    ? "bg-gradient-to-r from-success to-secondary" 
                    : "bg-gradient-to-r from-destructive to-orange-500"
                }`}
                style={{ width: `${result.confidence}%` }}
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
                {isReal ? (
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
            <span className="text-sm text-muted-foreground">Models Used:</span>
            {["Logistic Regression", "Naive Bayes", "Random Forest"].map((model) => (
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
