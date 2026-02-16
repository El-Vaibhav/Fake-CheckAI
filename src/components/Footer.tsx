import { Brain, Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Detect", href: "#detect" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Research", href: "#research" },
  { name: "About", href: "#about" },
];

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Email", icon: Mail, href: "mailto:contact@example.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <div>
                <span className="font-bold text-xl gradient-text">FakeCheck AI</span>
              </div>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
              AI-powered fake news detection using advanced machine learning techniques. 
              Helping combat misinformation with research-backed methodology.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: "Documentation", href: "#" },
                { name: "API Reference", href: "#" },
                { name: "Research Paper", href: "#" },
                { name: "GitHub Repo", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-muted/50 rounded-2xl p-4 mb-8">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This tool provides AI-based predictions that are probabilistic in nature. 
              Results should not replace human judgment, professional fact-checking, or editorial review. 
              Always verify information through multiple reliable sources.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} FakeCheck AI. Built with 💜 for truth.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
