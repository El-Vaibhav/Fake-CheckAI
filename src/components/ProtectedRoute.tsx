import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const { isAuthenticated, loading } = useAuth();

  const isGuest = localStorage.getItem("guest") === "true";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  // Allow authenticated users OR guests
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}