import { BarChart3, Database, Cpu, Target, Layers, TrendingUp } from "lucide-react";

const models = [
  { name: "Logistic Regression", accuracy: 94, color: "bg-primary" },
  { name: "Naive Bayes", accuracy: 91, color: "bg-secondary" },
  { name: "Random Forest", accuracy: 96, color: "bg-accent" },
  { name: "SVM", accuracy: 93, color: "bg-success" },
];

const datasets = [
  { name: "ISOT Fake News", articles: "44,898", source: "University of Victoria" },
  { name: "FakeNewsNet", articles: "23,196", source: "Arizona State University" },
];

const features = [
  { name: "TF-IDF Vectorization", description: "Term frequency-inverse document frequency for text representation" },
  { name: "N-gram Analysis", description: "Unigram and bigram patterns for linguistic feature extraction" },
  { name: "Word Count Features", description: "Statistical metrics including word length and sentence structure" },
];

export function ModelInsights() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-6">
            <BarChart3 className="w-4 h-4" />
            <span>Model Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Under the{" "}
            <span className="gradient-text">Hood</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore the machine learning models and datasets powering our detection system
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
                <p className="text-sm text-muted-foreground">Comparison chart</p>
              </div>
            </div>

            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground">{model.accuracy}%</span>
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
                <span className="text-sm text-muted-foreground">Best Performer</span>
                <span className="text-sm font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Random Forest
                </span>
              </div>
            </div>
          </div>

          {/* Datasets Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Training Datasets</h3>
                <p className="text-sm text-muted-foreground">Research-backed data</p>
              </div>
            </div>

            <div className="space-y-4">
              {datasets.map((dataset) => (
                <div key={dataset.name} className="p-4 rounded-2xl bg-muted/50 border border-border">
                  <div className="font-medium mb-1">{dataset.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{dataset.source}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-md">
                      {dataset.articles} articles
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">68,094+</div>
                <div className="text-sm text-muted-foreground">Total training samples</div>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Feature Extraction</h3>
                <p className="text-sm text-muted-foreground">NLP techniques used</p>
              </div>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={feature.name} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["ML Powered", "Research-Backed", "Explainable AI"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
