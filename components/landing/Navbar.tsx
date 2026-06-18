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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? "pt-4" : "pt-0"}`}>
      <nav
        className={`flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled
            ? "w-[95%] md:w-[85%] max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-md py-3 px-6 rounded-full border border-zinc-800/80 shadow-2xl shadow-black/50"
            : "w-full max-w-7xl bg-transparent py-6 px-8 rounded-none border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl text-white tracking-tight">Ginne AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="#" className="hover:text-white transition-colors">Product</Link>
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">Docs</Link>
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
