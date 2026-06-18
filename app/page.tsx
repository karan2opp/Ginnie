import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { UnifiedIntelligence } from "@/components/landing/UnifiedIntelligence";
import { AutomateSection } from "@/components/landing/AutomateSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#22c55e]/30 selection:text-[#22c55e] relative">
      <Navbar />
      <HeroSection />
      <UnifiedIntelligence />
      <AutomateSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
