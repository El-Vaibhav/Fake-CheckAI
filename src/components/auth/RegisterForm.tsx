import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setLoading(true);
      await registerUser(values.name, values.email, values.password);
      toast({
        title: "Registration Successful",
        description: "Welcome to FakeCheck AI!",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: getApiErrorMessage(error, "Unable to register."),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthInput
        id="name"
        label="Full name"
        icon={User}
        placeholder="Enter your full name"
        autoComplete="name"
        error={errors.name?.message}
        registration={register("name")}
      />

      <AuthInput
        id="email"
        label="Email address"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        registration={register("email")}
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        error={errors.password?.message}
        registration={register("password")}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        showPassword={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      <Button type="submit" size="lg" variant="hero" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?
        <Link to="/login" className="ml-2 font-semibold text-primary transition-colors hover:text-primary/80 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

interface AuthInputProps {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  registration: UseFormRegisterReturn;
  type?: string;
  icon: typeof User;
}

function AuthInput({ id, label, type = "text", icon: Icon, placeholder, autoComplete, error, registration }: AuthInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-xl bg-background/70 pl-10 shadow-sm transition-all focus-visible:ring-primary/40"
          aria-invalid={Boolean(error)}
          {...registration}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
  registration: UseFormRegisterReturn;
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
  error,
  registration,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-xl bg-background/70 pl-10 pr-11 shadow-sm transition-all focus-visible:ring-primary/40"
          aria-invalid={Boolean(error)}
          {...registration}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
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
