import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { DetectionWorkspace } from "@/components/DetectionWorkspace";
import { ModelInsights } from "@/components/ModelInsights";
import { HowItWorks } from "@/components/HowItWorks";
import { ResearchSection } from "@/components/ResearchSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <DetectionWorkspace />
        <ModelInsights />
        <HowItWorks />
        <ResearchSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
