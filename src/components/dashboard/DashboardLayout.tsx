import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Brain, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  children: ReactNode;

  searchQuery: string;
  setSearchQuery: (val: string) => void;

  dateFilter: string;
  setDateFilter: (val: string) => void;

  typeFilter: string;
  setTypeFilter: (val: string) => void;
}

export function DashboardLayout({
  children,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
}: Props) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-purple-50/80 dark:from-slate-950 dark:via-[#07132e] dark:to-slate-950 text-foreground relative overflow-hidden transition-colors duration-300">
      <>
        <div className="absolute -top-40 -left-48 w-96 h-96 rounded-full bg-cyan-300/30 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-24 w-[22rem] h-[22rem] rounded-full bg-sky-300/28 blur-[120px] animate-pulse-slow animation-delay-300" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-300/25 blur-[120px] animate-pulse-slow animation-delay-500" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      </>

      <header className="sticky top-0 z-50 border-b dark:border-slate-800 bg-gradient-to-r from-cyan-50/50 via-blue-50/40 to-purple-50/40 dark:from-[#030817]/80 dark:via-[#07132e]/80 dark:to-[#030817]/80 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-0 min-h-16 flex flex-wrap items-center gap-2 sm:gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 mr-0 sm:mr-2 hover:scale-105 transition-transform duration-200 shrink-0">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm sm:text-base">Fake News Detector</span>
          </button>
          <div className="relative w-full order-3 md:order-none md:flex-1 md:max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past reports..."
              className="pl-9 rounded-xl h-9 sm:h-10 text-sm"
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[132px] sm:w-36 rounded-xl h-9 sm:h-10 text-xs sm:text-sm transition-all duration-300 hover:shadow-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alltime">All time</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] sm:w-44 rounded-xl h-9 sm:h-10 text-xs sm:text-sm transition-all duration-300 hover:shadow-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Detection: Both</SelectItem>
              <SelectItem value="fake">Fake News</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="hero-outline"
            onClick={() => navigate("/")}
            size="sm"
            className="h-9 text-xs sm:text-sm px-2.5 sm:px-3"
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Fake News Detector</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Button
            onClick={() => navigate("/ai-detector")}
            size="sm"
            className="h-9 text-xs sm:text-sm px-2.5 sm:px-3"
          >
            <span className="hidden sm:inline">Back to AI Detector</span>
            <span className="sm:hidden">AI</span>
          </Button>
          {isAuthenticated && (
            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 rounded-xl px-3 h-10"
                >
                  <User className="w-4 h-4" />

                  <div className="flex flex-col items-start leading-none">

                    <span className="text-[10px] text-muted-foreground">
                      Welcome
                    </span>

                    <span className="text-sm font-semibold">
                      {user?.name}
                    </span>

                  </div>

                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark((prev) => !prev)}
            className="h-9 w-9 rounded-full border border-primary/20 bg-white/60 dark:bg-slate-900/70 dark:border-slate-700"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

        </div>
      </header>
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 relative z-10 animate-in fade-in duration-1000">{children}</main>
    </div>
  );
}
