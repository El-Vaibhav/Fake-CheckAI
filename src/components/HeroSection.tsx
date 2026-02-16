import { ArrowRight, Search, BookOpen, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow animation-delay-400" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in-up">
              <Zap className="w-4 h-4" />
              <span>Powered by Machine Learning</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in-up animation-delay-100">
              Detect{" "}
              <span className="gradient-text">Fake News</span>
              <br />
              with AI-Powered
              <br />
              Intelligence
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              Paste any news article and instantly know whether it's real or fake using advanced machine learning models trained on millions of articles.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300 max-w-3xl">

              <a href="#detect">
                <Button variant="hero" size="lg" className="group">
                  <Search className="w-7 h-7" />
                  Analyze News
                  <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <a href="#how-it-works">
                <Button variant="hero-outline" size="lg">
                  <BookOpen className="w-7 h-7" />
                  Learn How It Works
                </Button>
              </a>

              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/ai-detector")}
              >
                Try Our AI Detector 
              </Button>

              <Button
                variant="hero-outline"
                size="lg"
                className="relative"
                onClick={() => navigate("/cross-verify")}
              >
                Try Our New Source Verification Model

                {/* NEW badge */}
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-semibold bg-green-500 text-white rounded-full shadow-md">
                  NEW
                </span>
              </Button>

            </div>


            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 animate-fade-in-up animation-delay-400">
              {[
                { value: "95%+", label: "Accuracy" },
                { value: "50K+", label: "Articles Analyzed" },
                { value: "<1s", label: "Analysis Time" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Animated Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg animate-fade-in-up animation-delay-200">
              {/* Central Brain/AI Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow animate-float">
                <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-0 left-0 glass rounded-2xl p-4 shadow-xl hover-lift animate-float animation-delay-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Prediction</div>
                    <div className="font-semibold text-success">Real News</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-8 right-0 glass rounded-2xl p-4 shadow-xl hover-lift animate-float animation-delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Prediction</div>
                    <div className="font-semibold text-destructive">Fake News</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 glass rounded-2xl p-4 shadow-xl hover-lift animate-float animation-delay-200">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-8 glass rounded-2xl p-4 shadow-xl hover-lift animate-float animation-delay-400">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Models Used</div>
                  <div className="flex gap-1">
                    {["LR", "NB", "RF"].map((model) => (
                      <span
                        key={model}
                        className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
