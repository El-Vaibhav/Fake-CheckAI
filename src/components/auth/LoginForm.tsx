import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Chrome } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, continueAsGuest } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function handleContinueAsGuest() {
    continueAsGuest();
    toast({
      title: "Continuing as guest",
      description: "You can try the website, but analytics and saved history are unavailable in guest mode.",
    });
    navigate("/app");
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      setLoading(true);
      await login(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/app");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: getApiErrorMessage(error, "Invalid email or password."),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email address
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-xl bg-background/70 pl-10 shadow-sm transition-all focus-visible:ring-primary/40"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">
          Password
        </Label>
        <div className="relative">
          <LockIcon />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 rounded-xl bg-background/70 pl-10 pr-11 shadow-sm transition-all focus-visible:ring-primary/40"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" variant="hero" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
        <Button type="button" className="w-full" variant="hero-outline" size="lg" onClick={handleContinueAsGuest}>
          Continue as Guest
        </Button>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Guest mode lets you try the website without logging in. Your information will not be recorded, so analytics and saved history cannot be done as a guest.
        </p>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            setLoading(true);

            await loginWithGoogle(
              credentialResponse.credential!
            );

            toast({
              title: "Login Successful",
              description: "Welcome back!",
            });

            navigate("/app");
          } catch (error: unknown) {
            toast({
              variant: "destructive",
              title: "Google Login Failed",
              description: getApiErrorMessage(
                error,
                "Unable to login with Google."
              ),
            });
          } finally {
            setLoading(false);
          }
        }}
        onError={() => {
          toast({
            variant: "destructive",
            title: "Google Login Failed",
            description: "Unable to authenticate with Google.",
          });
        }}
      />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?
        <Link to="/register" className="ml-2 font-semibold text-primary transition-colors hover:text-primary/80 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

function LockIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}


function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}
