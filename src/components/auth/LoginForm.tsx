import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

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

  async function onSubmit(values: LoginFormValues) {
    try {
      setLoading(true);

      await login(values.email, values.password);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error?.response?.data?.message ||
          "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* EMAIL */}

      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">

        <Label>Password</Label>

        <div className="relative">

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
          />

          <button
            type="button"
            className="absolute right-3 top-3 text-muted-foreground"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>

        </div>

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* BUTTON */}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>

      <div className="text-center text-sm">

        Don't have an account?

        <Link
          to="/register"
          className="ml-2 font-semibold text-primary hover:underline"
        >
          Register
        </Link>

      </div>
    </form>
);
}