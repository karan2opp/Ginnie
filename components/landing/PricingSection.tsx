import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-8 py-32 z-10 flex flex-col items-center">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Choose the plan that best fits your workflow.
        </p>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-6 max-w-6xl">
        
        {/* FREE PLAN */}
        <div className="flex-1 bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-8 flex flex-col relative overflow-hidden group">
          <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
          <div className="text-4xl font-bold text-white mb-4">₹0<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
          <p className="text-neutral-400 text-sm mb-6 flex-1">Basic access to Ginnie AI features.</p>
          <ul className="space-y-3 text-sm text-neutral-300 mb-8">
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> 30 AI Requests per day</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Standard response speed</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Calendar & Gmail integration</li>
          </ul>
          <Link href="/sign-up" className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors text-center block">
            Start for Free
          </Link>
        </div>

        {/* PRO PLAN */}
        <div className="flex-1 bg-neutral-900/60 border border-[#10b981]/50 rounded-2xl p-8 flex flex-col relative overflow-hidden group transform hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#10b981] to-emerald-400"></div>
          <h2 className="text-2xl font-bold text-[#10b981] mb-2">Pro</h2>
          <div className="text-4xl font-bold text-white mb-4">₹500<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
          <p className="text-neutral-400 text-sm mb-6 flex-1">Perfect for professionals who need more power.</p>
          <ul className="space-y-3 text-sm text-neutral-300 mb-8">
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> 150 AI Requests per day</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Fast response speed</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Priority support</li>
          </ul>
          <Link href="/pricing" className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-colors text-center block">
            Get Pro
          </Link>
        </div>

        {/* ELITE PLAN */}
        <div className="flex-1 bg-neutral-900/30 border border-purple-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Elite</h2>
          <div className="text-4xl font-bold text-white mb-4">₹1000<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
          <p className="text-neutral-400 text-sm mb-6 flex-1">Unlimited power for heavy users and executives.</p>
          <ul className="space-y-3 text-sm text-neutral-300 mb-8">
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Unlimited AI Requests</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Fastest response speed</li>
            <li className="flex items-center gap-2"><span className="text-[#10b981]">✓</span> Premium support</li>
          </ul>
          <Link href="/pricing" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors text-center block">
            Get Elite
          </Link>
        </div>

      </div>
    </section>
  );
}
