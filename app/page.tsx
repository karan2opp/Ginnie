import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { UnifiedIntelligence } from "@/components/landing/UnifiedIntelligence";
import { NaturalLanguage } from "@/components/landing/NaturalLanguage";
import { AutomateSection } from "@/components/landing/AutomateSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";

export default async function Home() {
  const { userId } = await auth();



  // Otherwise, render the landing page.
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#22c55e]/30 selection:text-[#22c55e]">
      <Navbar />
      <HeroSection />
      <UnifiedIntelligence />
      <NaturalLanguage />
      <AutomateSection />
      <FeatureGrid />
      <StatsSection />
      <CTASection />
    </div>
  );
}
