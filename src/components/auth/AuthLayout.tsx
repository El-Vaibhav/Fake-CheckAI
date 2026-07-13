import { ReactNode } from "react";
import {
  ShieldCheck,
  Lock,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-24 left-16 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      </div>

      <div className="relative z-10 container mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}

          <div className="hidden lg:block space-y-8">

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2">

              <Sparkles className="h-4 w-4 text-primary" />

              <span className="text-sm font-medium text-primary">
                FakeCheck AI Secure Platform
              </span>

            </div>

            <h1 className="text-5xl font-bold leading-tight">

              Secure access to your

              <span className="gradient-text block">

                AI Verification Workspace

              </span>

            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">

              Authenticate once and access Fake News Detection,
              AI Content Detection,
              Cross Verification,
              Analytics,
              Reports,
              and your personalized dashboard.

            </p>

            <div className="grid gap-6 pt-8">

              <div className="glass rounded-xl p-5 flex gap-4">

                <ShieldCheck className="h-8 w-8 text-primary" />

                <div>

                  <h3 className="font-semibold">

                    Enterprise Security

                  </h3>

                  <p className="text-sm text-muted-foreground">

                    JWT Authentication with encrypted credentials.

                  </p>

                </div>

              </div>

              <div className="glass rounded-xl p-5 flex gap-4">

                <BrainCircuit className="h-8 w-8 text-primary" />

                <div>

                  <h3 className="font-semibold">

                    AI Powered

                  </h3>

                  <p className="text-sm text-muted-foreground">

                    Detect Fake News, AI generated text and verify
                    sources from one platform.

                  </p>

                </div>

              </div>

              <div className="glass rounded-xl p-5 flex gap-4">

                <Lock className="h-8 w-8 text-primary" />

                <div>

                  <h3 className="font-semibold">

                    Private Dashboard

                  </h3>

                  <p className="text-sm text-muted-foreground">

                    Every analysis is securely linked to your account.

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex justify-center">

            <div className="glass w-full max-w-md rounded-3xl border border-border/50 p-8 shadow-2xl backdrop-blur-xl">

              <div className="mb-8 text-center">

                <h2 className="text-3xl font-bold">

                  {title}

                </h2>

                <p className="mt-2 text-muted-foreground">

                  {subtitle}

                </p>

              </div>

              {children}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}