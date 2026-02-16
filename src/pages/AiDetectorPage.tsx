import { AiNavbar } from "@/components/AiNavbar";
import { Footer } from "@/components/Footer";
import { AiModelInsights } from "@/components/AiModelInsights";
import { AIDetectionWorkspace } from "@/components/AiDetectionWorkspace";
import { AiHowItWorks } from "@/components/AiHowItWorks";
import { AiResearchSection } from "@/components/AiResearchSection";
import { AboutSection } from "@/components/AboutSection";

import { AiHeroSection } from "@/components/AiHeroSection";
// import { AiDetectionWorkspace } from "@/components/AiDetectionWorkspace";

export default function AiDetectorPage() {
  return (
    <div className="min-h-screen bg-background">
      <AiNavbar />
      <main>
        <AiHeroSection />
        <AIDetectionWorkspace />
        <AiModelInsights />
        <AiHowItWorks />
        <AiResearchSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
