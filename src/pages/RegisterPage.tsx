import { Navigate } from "react-router-dom";

import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join FakeCheck AI and secure your analysis history."
    >
      <RegisterForm />
    </AuthLayout>
  );
}