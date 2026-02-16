import { ArrowRight, Search, BookOpen, Shield, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AiHeroSection() {
  const navigate = useNavigate();

  return (
    <section id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 text-center lg:text-left max-w-5xl">


            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in-up">
              <Cpu className="w-4 h-4" />
              <span>New AI Detector Model</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
              Detect{" "}
              <span className="gradient-text">AI-Generated Content</span>
              <br />
              with Advanced
              <br />
              Language Analysis
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up">
              Paste any article and determine whether it was written by a human
              or generated using artificial intelligence models such as GPT, Claude, or Gemini.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
              <a href="#aidetect">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  <Search className="w-5 h-5" />
                  Analyze for AI
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <Button
                variant="hero-outline"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => navigate("/")}
              >
                <BookOpen className="w-5 h-5" />
                Back to Fake News Detector
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
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
            <div className="grid grid-cols-3 gap-4 pt-8 animate-fade-in-up">
              {[
                { value: "92%+", label: "Detection Accuracy" },
                { value: "AI vs Human", label: "Binary Classification" },
                { value: "<1s", label: "Analysis Time" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT (AI Illustration) */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-in-up">
            <div className="relative w-full max-w-lg">

              {/* Center Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow animate-pulse-slow">
                <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                  <Cpu className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* AI Card */}
              <div className="absolute top-0 left-0 glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Prediction</div>
                    <div className="font-semibold text-destructive">
                      AI Generated
                    </div>
                  </div>
                </div>
              </div>

              {/* Human Card */}
              <div className="absolute bottom-8 right-8 glass rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Prediction</div>
                    <div className="font-semibold text-success">
                      Human Written
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
