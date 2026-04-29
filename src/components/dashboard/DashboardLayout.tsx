import { ReactNode, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Brain, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-purple-50/80 text-foreground relative overflow-hidden">
      <>
        <div className="absolute -top-40 -left-48 w-96 h-96 rounded-full bg-cyan-300/30 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-24 w-[22rem] h-[22rem] rounded-full bg-sky-300/28 blur-[120px] animate-pulse-slow animation-delay-300" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-300/25 blur-[120px] animate-pulse-slow animation-delay-500" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      </>

      <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-cyan-50/50 via-blue-50/40 to-purple-50/40 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 mr-2 hover:scale-105 transition-transform duration-200">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">Fake News Detector</span>
          </button>
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past reports..."
              className="pl-9 rounded-xl"
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-36 rounded-xl hidden sm:flex transition-all duration-300 hover:shadow-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 rounded-xl hidden lg:flex transition-all duration-300 hover:shadow-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Detection: Both</SelectItem>
              <SelectItem value="fake">Fake News</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
            </SelectContent>
          </Select>
          <Button
                variant="hero-outline"
                onClick={() => navigate("/")}
              >
                <BookOpen className="w-5 h-5" />
                Back to Fake News Detector
              </Button>
          <Button
                onClick={() => navigate("/ai-detector")}
              >
                Back to AI Detector
              </Button>
          
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 space-y-6 relative z-10 animate-in fade-in duration-1000">{children}</main>
    </div>
  );
}