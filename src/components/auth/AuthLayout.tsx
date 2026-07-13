import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BrainCircuit, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Trusted verification",
    description: "Run fake-news, AI-text, and source checks from one secure workspace.",
  },
  {
    icon: BrainCircuit,
    title: "AI-powered analysis",
    description: "Keep every investigation connected to models, reports, and insights.",
  },
  {
    icon: Lock,
    title: "Private dashboard",
    description: "Your saved analysis history stays protected behind your account.",
  },
];

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-10 sm:py-14 lg:py-20"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[8%] top-[14%] h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow md:h-96 md:w-96" />
        <div className="absolute bottom-[10%] right-[8%] h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-pulse-slow animation-delay-200 md:h-96 md:w-96" />
        <div className="absolute right-[34%] top-[42%] hidden h-56 w-56 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow animation-delay-400 lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.035)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-20">
          <div className="space-y-7 text-center lg:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Sparkles className="h-4 w-4" />
              FakeCheck AI Secure Platform
            </Link>

            <div className="space-y-5">
              <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl lg:mx-0">
                Secure access to your
                <span className="gradient-text block">AI Verification Workspace</span>
              </h1>

              <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
                Sign in once to use Fake News Detection, AI Content Detection, Cross Verification,
                Analytics, Reports, and your personalized dashboard without changing your workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {featureCards.map(({ icon: Icon, title: featureTitle, description }) => (
                <div
                  key={featureTitle}
                  className="glass hover-lift rounded-2xl p-5 text-left shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{featureTitle}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <div className="gradient-border rounded-[2rem] bg-card/80 p-[1px] shadow-2xl glow">
              <div className="glass-strong rounded-[2rem] p-6 shadow-xl sm:p-8">
                <div className="mb-7 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
                    <BarChart3 className="h-7 w-7" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    Protected account access
                  </div>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>
                </div>

                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
