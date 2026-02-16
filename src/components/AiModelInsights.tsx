import {
  BarChart3,
  Database,
  Cpu,
  Target,
  Layers,
  TrendingUp,
  Brain,
} from "lucide-react";

const models = [
  { name: "Logistic Stylometry", accuracy: 92, color: "bg-primary" },
  { name: "Random Forest (Stylometric)", accuracy: 95, color: "bg-secondary" },
  { name: "SVM (Authorship)", accuracy: 93, color: "bg-accent" },
  { name: "Hybrid Probability Model", accuracy: 96, color: "bg-success" },
];

const datasets = [
  {
    name: "Human News Corpus",
    articles: "35,000+",
    source: "Verified Journalism Sources",
  },
  {
    name: "AI-Generated Corpus",
    articles: "40,000+",
    source: "LLM Outputs (GPT, Claude, Gemini)",
  },
];

const features = [
  {
    name: "Sentence Burstiness",
    description:
      "Measures variation in sentence length distribution to detect AI regularity patterns.",
  },
  {
    name: "Token Entropy Analysis",
    description:
      "Evaluates lexical diversity and predictability in writing structure.",
  },
  {
    name: "Repetition & Probability Patterns",
    description:
      "Detects statistically consistent token distributions common in LLM outputs.",
  },
];

export function AiModelInsights() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-6">
            <Brain className="w-4 h-4" />
            <span>AI Detector Performance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Inside the{" "}
            <span className="gradient-text">AI Authorship Model</span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Explore the classification models, datasets, and stylometric techniques powering our AI-generated content detector.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Model Accuracy Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Model Accuracy</h3>
                <p className="text-sm text-muted-foreground">Classifier comparison</p>
              </div>
            </div>

            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground">
                      {model.accuracy}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${model.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Best Performer
                </span>
                <span className="text-sm font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Hybrid Model
                </span>
              </div>
            </div>
          </div>

          {/* Dataset Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Training Data</h3>
                <p className="text-sm text-muted-foreground">
                  Human vs AI corpora
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {datasets.map((dataset) => (
                <div
                  key={dataset.name}
                  className="p-4 rounded-2xl bg-muted/50 border border-border"
                >
                  <div className="font-medium mb-1">{dataset.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {dataset.source}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-md">
                    {dataset.articles} samples
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <div className="text-2xl font-bold gradient-text">
                75,000+
              </div>
              <div className="text-sm text-muted-foreground">
                Total training samples
              </div>
            </div>
          </div>

          {/* Feature Engineering Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Feature Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  Stylometric techniques
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {feature.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Stylometry", "AI Pattern Analysis", "Probabilistic Output"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
