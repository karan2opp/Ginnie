import Link from "next/link";
import { Globe, Monitor } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative w-full z-10 pt-32 pb-16">
      
      <div className="max-w-4xl mx-auto px-8 text-center mb-32">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Less busywork.<br/>
          More impact.
        </h2>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          Join the next generation of knowledge workers leveraging autonomous intelligence.
        </p>
        <Link href="/sign-up" className="inline-block bg-[#22c55e] text-black font-semibold text-lg px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] hover:bg-[#16a34a] transition-all">
          Start Free Now
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#0a0a0a] pt-16 pb-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="md:col-span-1">
              <h3 className="font-bold text-2xl text-white tracking-tight mb-4">Ginne AI</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                The intelligent communication layer for modern enterprise teams. Built for speed, security, and scale.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Automations</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Privacy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6">Support</h4>
              <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Docs</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-[#22c55e] transition-colors">API Status</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">
              © 2024 Ginne AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-zinc-500">
              <Globe className="w-4 h-4 hover:text-[#22c55e] cursor-pointer transition-colors" />
              <Monitor className="w-4 h-4 hover:text-[#22c55e] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>

    </section>
  );
}
