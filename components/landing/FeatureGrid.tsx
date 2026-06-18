import { Mail, Calendar, Search, Network, Bot } from "lucide-react";

export function FeatureGrid() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-8 py-32 z-10 border-t border-zinc-800/50 mt-16">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto h-auto md:h-[600px]">
        
        {/* Large Left Card - Inbox AI */}
        <div className="md:col-span-2 bg-[#141414] border border-zinc-800 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors h-full">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
            <Bot className="w-full h-full text-white" />
          </div>
          
          <div className="mt-auto z-10 pt-48">
            <div className="w-12 h-12 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-6 border border-[#22c55e]/20">
              <Mail className="w-5 h-5 text-[#22c55e]" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Inbox AI</h3>
            <p className="text-zinc-400 leading-relaxed text-sm max-w-sm">
              Your inbox reads itself, drafts responses, and bubbles up only what matters.
            </p>
          </div>
        </div>

        {/* Tall Middle Card - Calendar AI */}
        <div className="md:col-span-1 bg-[#141414] border border-zinc-800 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors h-full">
          <div className="w-12 h-12 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-6 border border-[#22c55e]/20">
            <Calendar className="w-5 h-5 text-[#22c55e]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Calendar AI</h3>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Automated scheduling that respects your deep work blocks.
          </p>
          
          <div className="mt-auto pt-8">
            <div className="text-[10px] text-zinc-500 font-medium">Active Syncing</div>
            <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-[#22c55e] w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Stacked Cards */}
        <div className="md:col-span-1 flex flex-col gap-6 h-full">
          
          {/* Top Right - Smart Search */}
          <div className="flex-1 bg-[#141414] border border-zinc-800 rounded-3xl p-6 flex flex-col group hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-5 h-5 text-[#22c55e]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Semantic retrieval across all apps.
            </p>
          </div>

          {/* Bottom Right - Automations */}
          <div className="flex-1 bg-[#141414] border border-[#22c55e]/20 rounded-3xl p-6 flex flex-col group hover:border-[#22c55e]/40 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <Network className="w-5 h-5 text-[#22c55e]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Automations</h3>
            <p className="text-zinc-400 leading-relaxed text-xs relative z-10">
              500+ pre-built workflow templates.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
