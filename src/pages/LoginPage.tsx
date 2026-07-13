import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to open your FakeCheck AI starting workspace."
    >
      <LoginForm />
    </AuthLayout>
  );
}