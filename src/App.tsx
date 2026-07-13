import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import AiDetectorPage from "./pages/AiDetectorPage";
import CrossVerifyPage from "./pages/CrossVerifyPage";
import NotFound from "./pages/NotFound";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import UserLandingPage from "./pages/UserLandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <UserLandingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AnalyticsDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-detector"
            element={
              <ProtectedRoute>
                <AiDetectorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cross-verify"
            element={
              <ProtectedRoute>
                <CrossVerifyPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
