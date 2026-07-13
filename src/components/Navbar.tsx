import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Brain, Github, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Detect", href: "#detect" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Research", href: "#research" },
  { name: "About", href: "#about" },
  { name: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-strong shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight gradient-text">FakeCheck AI</span>
              <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                AI-Powered Fake News Detection
              </span>
              {isAuthenticated && (
                <span className="text-xs text-primary font-medium">
                  Welcome, {user?.name}
                </span>
              )}
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted/50"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex"
            >
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="w-5 h-5" />
              </Button>
            </a>

            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">

                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>

                <Button
                  variant="hero"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>

              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">

                <Button
                  variant="hero"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>

                    <Button variant="outline">

                      <User className="mr-2 h-4 w-4" />

                      {user?.name}

                    </Button>

                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />

                      Logout

                    </DropdownMenuItem>

                  </DropdownMenuContent>

                </DropdownMenu>

              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="glass-strong border-t border-border/50 px-3 py-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2">
            <a href="#detect" onClick={() => setIsMobileMenuOpen(false)}>
              {!isAuthenticated ? (
                <div className="space-y-2">

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    className="w-full"
                    variant="hero"
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>

                </div>
              ) : (
                <div className="space-y-2">

                  <Button
                    className="w-full"
                    variant="hero"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>

                </div>
              )}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
