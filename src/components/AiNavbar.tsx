import { useState, useEffect } from "react";
import { Brain, Github, Menu, Moon, Sun, X, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Detect AI", href: "#aidetect" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Research", href: "#research" },
  { name: "About", href: "#about" },
];

export function AiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const navigate = useNavigate();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="relative">
              <Cpu className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight gradient-text">
                FakeCheck AI
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                AI-Generated Content Detection
              </span>
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

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Back to Fake News Page */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hidden md:flex"
            >
              Back to Fake News
            </Button>

            {/* Dark Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* GitHub */}
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

            {/* Try Now Button */}
            <a href= "#aidetect" className="hidden sm:block">
              <Button variant="hero" size="default">
                Analyze AI Content
              </Button>
            </a>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-strong border-t border-border/50 px-4 py-4 space-y-1">
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
              <Button variant="hero" className="w-full">
                Analyze AI Content
              </Button>
            </a>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
            >
              Back to Fake News
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
