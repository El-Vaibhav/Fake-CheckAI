import { BookOpen, ExternalLink, Award, ShieldCheck, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const sources = [
  {
    name: "ISOT Fake News Dataset",
    institution: "University of Victoria",
    description: "A comprehensive dataset containing 21,417 real and 23,481 fake news articles from various domains.",
    link: "#",
  },
  {
    name: "FakeNewsNet Repository",
    institution: "Arizona State University",
    description: "A benchmark dataset for fake news detection research with social context information.",
    link: "#",
  },
];

const methodology = [
  "Text preprocessing with NLTK for tokenization and lemmatization",
  "TF-IDF vectorization with optimized hyperparameters",
  "Ensemble learning combining multiple classifiers",
  "Cross-validation for robust model evaluation",
  "Feature importance analysis for model interpretability",
];

export function ResearchSection() {
  return (
    <section id="research" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Research & Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Built on{" "}
            <span className="gradient-text">Solid Research</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our approach is grounded in academic research and proven methodologies
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Dataset Sources */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Dataset Sources
            </h3>

            {sources.map((source) => (
              <div key={source.name} className="glass rounded-2xl p-6 hover-lift">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{source.name}</h4>
                    <p className="text-sm text-muted-foreground">{source.institution}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {source.description}
                </p>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Methodology Overview
            </h3>

            <div className="glass rounded-2xl p-6">
              <ul className="space-y-4">
                {methodology.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-secondary">{index + 1}</span>
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <div className="glass rounded-3xl p-8 lg:p-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, label: "ML Powered", description: "State-of-the-art algorithms" },
                { icon: ShieldCheck, label: "Research-Backed", description: "Academic foundations" },
                { icon: BookOpen, label: "Explainable AI", description: "Transparent predictions" },
                { icon: GraduationCap, label: "Peer-Reviewed", description: "Validated methods" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <badge.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{badge.label}</div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ethical AI Note */}
        <div className="mt-8 max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Ethical AI Commitment:</strong> We prioritize transparency and responsible AI practices. 
            Our models are trained on diverse, balanced datasets and we continuously work to minimize bias and improve fairness in predictions.
          </p>
        </div>
      </div>
    </section>
  );
}
