import {
  Globe,
  BookOpen,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Activity,
  Library,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const researchPapers = [
  {
    title: "Multi-Source Misinformation Detection",
    institution: "MIT Media Lab",
    description:
      "Explores how information consistency across publishers improves misinformation detection reliability.",
  },
  {
    title: "Semantic Similarity for News Verification",
    institution: "Stanford NLP Group",
    description:
      "Research on using vector embeddings and contextual similarity to evaluate narrative alignment.",
  },
  {
    title: "Media Bias & Credibility Indexing",
    institution: "Reuters Institute",
    description:
      "Analyzes domain authority, publisher trust signals, and long-term credibility scoring.",
  },
];

const methodology = [
  "Real-time multi-source retrieval via news APIs",
  "Transformer-based semantic similarity modeling",
  "Publisher credibility weighting system",
  "Coverage density & propagation analysis",
  "Hybrid confidence index aggregation",
];

export function CrossVerifyResearchSection() {
  return (
    <section
      id="research"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Foundations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Research Behind the{" "}
            <span className="gradient-text">
              Verification Engine
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Our cross-source model is inspired by peer-reviewed research in
            misinformation detection, semantic similarity, and media credibility studies.
          </p>
        </div>

        {/* Research Cards Layout */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {researchPapers.map((paper) => (
            <div
              key={paper.title}
              className="glass rounded-3xl p-8 shadow-xl hover-lift transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Library className="w-6 h-6 text-primary" />
                <Button variant="ghost" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <h3 className="font-semibold text-lg mb-2">
                {paper.title}
              </h3>

              <p className="text-xs text-muted-foreground mb-3">
                {paper.institution}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {paper.description}
              </p>
            </div>
          ))}
        </div>

        {/* Methodology Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Vertical Methodology */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Methodological Framework
            </h3>

            <div className="space-y-4">
              {methodology.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40 border border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-secondary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Summary Panel */}
          <div className="glass rounded-3xl p-10 shadow-xl">
            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Global Coverage Analysis</div>
                  <div className="text-xs text-muted-foreground">
                    Multi-publisher aggregation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">Credibility Weighting</div>
                  <div className="text-xs text-muted-foreground">
                    Trust-aware scoring
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold">Research-Inspired</div>
                  <div className="text-xs text-muted-foreground">
                    Academic methodology alignment
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border text-center">
                <div className="text-2xl font-bold gradient-text">
                  Research-Driven Architecture
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Built for transparency & explainability
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Ethical Note */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Transparency Commitment:</strong> 
            Our cross-source verification system prioritizes explainability and 
            research-backed scoring methodologies to ensure fair and interpretable results.
          </p>
        </div>

      </div>
    </section>
  );
}
