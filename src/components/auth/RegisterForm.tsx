import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .email("Enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

type RegisterFormValues = z.infer<
  typeof registerSchema
>;

export default function RegisterForm() {
  const navigate = useNavigate();

  const { register: registerUser } = useAuth();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(
    values: RegisterFormValues
  ) {
    try {
      setLoading(true);

      await registerUser(
        values.name,
        values.email,
        values.password
      );

      toast({
        title: "Registration Successful",
        description:
          "Welcome to FakeCheck AI!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          error?.response?.data?.message ||
          "Unable to register.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* NAME */}

      <div className="space-y-2">
        <Label>Full Name</Label>

        <Input
          placeholder="Enter your name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

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
            type={
              showPassword ? "text" : "password"
            }
            placeholder="Create a password"
            {...register("password")}
          />

          <button
            type="button"
            className="absolute right-3 top-3"
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

      {/* CONFIRM PASSWORD */}

      <div className="space-y-2">
        <Label>Confirm Password</Label>

        <div className="relative">
          <Input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm password"
            {...register("confirmPassword")}
          />

          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* BUTTON */}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </Button>

      <div className="text-center text-sm">
        Already have an account?

        <Link
          to="/login"
          className="ml-2 font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}