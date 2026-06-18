"use client";

import { Heart, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-8 py-12 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
      <div className="flex items-center gap-2 text-zinc-400 font-medium">
        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by <span className="text-white font-bold">Karan</span>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all group"
      >
        <span className="text-sm font-medium">Back to top</span>
        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
}
