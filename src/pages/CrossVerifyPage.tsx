import { CrossVerifyNavbar } from "@/components/CrossVerifyNavbar";
import { Footer } from "@/components/Footer";

import { CrossVerifyHeroSection } from "@/components/CrossVerifyHeroSection";
import { CrossVerifyModelInsights } from "@/components/CrossVerifyModelInsights";
import { CrossVerifyHowItWorks } from "@/components/CrossVerifyHowItWorks";
import { CrossVerifyResearchSection } from "@/components/CrossVerifyResearchSection";
import { AboutSection } from "@/components/AboutSection";
import { CrossVerifyWorkspace } from "@/components/CrossVerifyWorkspace";

    
export default function CrossVerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <CrossVerifyNavbar />

      <main>
        <CrossVerifyHeroSection />
        <CrossVerifyWorkspace />
        <CrossVerifyModelInsights />
        <CrossVerifyHowItWorks />
        <CrossVerifyResearchSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
