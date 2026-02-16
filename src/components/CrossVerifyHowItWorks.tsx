import {
  Globe,
  Search,
  Database,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  Activity,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Claim Extraction",
    description:
      "Primary claim and semantic entities are extracted from the submitted article.",
  },
  {
    icon: Globe,
    title: "Multi-Source Retrieval",
    description:
      "Relevant news articles are fetched across diverse publishers in real-time.",
  },
  {
    icon: Database,
    title: "Coverage Mapping",
    description:
      "System measures distribution and consistency of the claim across outlets.",
  },
  {
    icon: GitBranch,
    title: "Narrative Comparison",
    description:
      "Semantic similarity compares framing and contextual alignment.",
  },
  {
    icon: ShieldCheck,
    title: "Credibility Scoring",
    description:
      "Sources are weighted using trust history and reputation signals.",
  },
  {
    icon: CheckCircle2,
    title: "Hybrid Confidence Index",
    description:
      "Final reliability score combines coverage, similarity, and trust.",
  },
];

export function CrossVerifyHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05),transparent_60%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-6">
            <Activity className="w-4 h-4" />
            <span>Verification Intelligence Flow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How Our{" "}
            <span className="gradient-text">
              Cross-Source Engine
            </span>{" "}
            Works
          </h2>

          <p className="text-lg text-muted-foreground">
            Information is validated through a multi-stage intelligence pipeline
            combining retrieval, semantic analysis, and credibility scoring.
          </p>
        </div>

        {/* Horizontal Flow */}
        <div className="relative max-w-7xl mx-auto">

          {/* Connection Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="glass rounded-2xl p-6 text-center hover-lift h-full transition-all duration-300">

                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold shadow">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Summary Panel */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 shadow-xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">

              <div>
                <div className="text-2xl font-bold gradient-text mb-1">
                  Real-Time Retrieval
                </div>
                <div className="text-xs text-muted-foreground">
                  Global news aggregation
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold gradient-text mb-1">
                  Semantic Similarity
                </div>
                <div className="text-xs text-muted-foreground">
                  Transformer-based comparison
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold gradient-text mb-1">
                  Trust-Weighted Index
                </div>
                <div className="text-xs text-muted-foreground">
                  Hybrid credibility scoring
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
