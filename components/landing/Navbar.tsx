"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Call once to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Get the nav height for offset
      const navHeight = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? "pt-6" : "pt-0"}`}>
      <nav
        className={`flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "w-[90%] md:w-[65%] max-w-4xl bg-[#0a0a0a]/90 backdrop-blur-xl py-3.5 px-8 rounded-full border border-zinc-800/80 shadow-2xl shadow-black"
            : "w-full max-w-7xl bg-transparent py-6 px-8 rounded-none border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Ginnie Logo" className="w-12 h-12 rounded-2xl bg-[#10b981]/10 p-1.5 object-contain" />
          <span className="font-extrabold text-2xl text-white tracking-tight">Ginne AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="#unified-ai" onClick={(e) => handleSmoothScroll(e, 'unified-ai')} className="hover:text-white transition-colors cursor-pointer">Unified AI</a>
          <a href="#automations" onClick={(e) => handleSmoothScroll(e, 'automations')} className="hover:text-white transition-colors cursor-pointer">Automations</a>
          <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</a>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/sign-up" className="bg-[#22c55e] text-black text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#16a34a] transition-colors">
            Start Free
          </Link>
        </div>
      </nav>
    </header>
  );
}
