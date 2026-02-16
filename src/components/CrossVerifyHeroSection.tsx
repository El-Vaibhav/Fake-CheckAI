import {
  Globe,
  Network,
  ShieldCheck,
  ArrowRight,
  Search,
  Layers,
  BarChart3,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CrossVerifyHeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="cross-verify-home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-8 text-center lg:text-left max-w-5xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent animate-fade-in-up">
              <Network className="w-4 h-4" />
              <span>Multi-Source Intelligence Engine</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
              Verify News Across{" "}
              <span className="gradient-text">Multiple Sources</span>
              <br />
              Detect Narrative Inconsistencies
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up">
              Analyze how a news claim is covered across different publications.
              Measure coverage strength, source credibility, and narrative alignment
              using advanced cross-source verification algorithms.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
              <a href="#cross-workspace">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  <Search className="w-5 h-5" />
                  Start Cross Verification
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <Button
                variant="hero-outline"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => navigate("/")}
              >
                <Layers className="w-5 h-5" />
                Back to Fake News Detector
              </Button>
              
              <Button
                variant="hero"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => navigate("/ai-detector")}
              >
                Try Our AI Detector
              </Button>
            </div>


            {/* Mini Metrics Row */}
            <div className="flex flex-wrap gap-4 pt-6 justify-center lg:justify-start">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Coverage Depth</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Source Credibility</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Narrative Similarity</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – Enhanced Network Visualization */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-in-up">
            <div className="relative w-full max-w-lg">

              {/* Soft Glow Base */}
              <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />

              {/* Central Globe */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg glow animate-pulse-slow">
                <Globe className="w-12 h-12 text-white" />
              </div>

              {/* Credibility Card */}
              <div className="absolute top-0 left-8 glass rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Credibility Score
                    </div>
                    <div className="font-semibold text-success">High</div>
                  </div>
                </div>
              </div>

              {/* Coverage Card */}
              <div className="absolute bottom-10 left-0 glass rounded-xl p-4 shadow-lg animate-float animation-delay-200">
                <div className="text-xs text-muted-foreground">
                  Coverage Strength
                </div>
                <div className="mt-2 h-2 w-24 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>

              {/* Narrative Card */}
              <div className="absolute top-16 right-0 glass rounded-xl p-4 shadow-lg animate-float animation-delay-300">
                <div className="text-xs text-muted-foreground">
                  Narrative Alignment
                </div>
                <div className="font-semibold text-primary mt-1">
                  Consistent
                </div>
              </div>

              {/* Network Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <line x1="50%" y1="50%" x2="20%" y2="15%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="10%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="90%" y2="25%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
