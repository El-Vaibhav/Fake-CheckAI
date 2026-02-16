import {
  Globe,
  Database,
  Target,
  Layers,
  TrendingUp,
  ShieldCheck,
  Activity,
  BarChart3,
} from "lucide-react";

const components = [
  { name: "Coverage Aggregation Engine", score: 94, color: "bg-primary" },
  { name: "Source Credibility Scorer", score: 91, color: "bg-accent" },
  { name: "Narrative Similarity Model", score: 93, color: "bg-secondary" },
  { name: "Hybrid Confidence Index", score: 96, color: "bg-success" },
];

const dataSources = [
  {
    name: "Global News APIs",
    count: "1000+ Sources",
    description: "International news publishers & media outlets",
  },
  {
    name: "Fact-Checking Databases",
    count: "Verified Claims",
    description: "Structured fact-check repositories",
  },
  {
    name: "Publisher Credibility Index",
    count: "Domain Scoring",
    description: "Reputation-based source evaluation",
  },
];

const techniques = [
  {
    name: "Semantic Similarity Mapping",
    description:
      "Uses vector embeddings to compare narrative alignment across multiple sources.",
  },
  {
    name: "Source Weight Calibration",
    description:
      "Adjusts credibility scores based on publisher trust history and domain authority.",
  },
  {
    name: "Coverage Density Analysis",
    description:
      "Measures how widely and consistently a claim is reported across media ecosystems.",
  },
];

export function CrossVerifyModelInsights() {
  return (
    <section
      id="model-insights"
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Globe className="w-4 h-4" />
            <span>Cross-Source Intelligence Model</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Inside the{" "}
            <span className="gradient-text">
              Verification Engine
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Discover how we aggregate multi-source coverage, score publisher credibility,
            and measure narrative consistency to assess information reliability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Engine Performance Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Engine Components</h3>
                <p className="text-sm text-muted-foreground">
                  Verification modules
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {components.map((comp) => (
                <div key={comp.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{comp.name}</span>
                    <span className="text-muted-foreground">
                      {comp.score}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${comp.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Confidence Metric
              </span>
              <span className="text-sm font-semibold text-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Hybrid Index
              </span>
            </div>
          </div>

          {/* Data Sources Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Ecosystem</h3>
                <p className="text-sm text-muted-foreground">
                  Coverage inputs
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {dataSources.map((source) => (
                <div
                  key={source.name}
                  className="p-4 rounded-2xl bg-muted/50 border border-border"
                >
                  <div className="font-medium mb-1">{source.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {source.description}
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-md">
                    {source.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <div className="text-2xl font-bold gradient-text">
                Real-Time Aggregation
              </div>
              <div className="text-sm text-muted-foreground">
                Dynamic multi-source retrieval
              </div>
            </div>
          </div>

          {/* Analytical Techniques Card */}
          <div className="glass rounded-3xl p-6 lg:p-8 shadow-xl hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Layers className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Analytical Techniques
                </h3>
                <p className="text-sm text-muted-foreground">
                  Signal extraction
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {techniques.map((tech) => (
                <div key={tech.name} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {tech.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {tech.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Semantic Embeddings",
                "Credibility Weighting",
                "Coverage Mapping",
              ].map((badge) => (
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
