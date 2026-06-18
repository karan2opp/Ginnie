import { Mail, Network, Calendar as CalendarIcon, Save, Play } from "lucide-react";

export function AutomateSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-32 z-10 flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Automate everything.
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Design complex logic with simple nodes. No coding required, just your process.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-[#1f2023] rounded-3xl p-4 shadow-2xl border border-zinc-800/50">
        
        {/* Inner Modal */}
        <div className="bg-[#111111] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-black shadow-2xl relative flex h-[500px]">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-14 border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur z-20 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Network className="w-4 h-4 text-[#22c55e]" />
              Workflows <span className="text-zinc-600">&gt;</span> <span className="text-white font-medium">Meeting Automation</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                <Save className="w-3 h-3" /> Save
              </button>
              <button className="text-xs font-medium text-black bg-white hover:bg-zinc-200 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
            </div>
          </div>

          {/* Node Canvas Area */}
          <div className="flex-1 relative mt-14 flex items-center justify-center">
            
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 300 150 C 400 150 400 150 500 150" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
              <path d="M 680 150 C 750 150 750 150 820 150" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
            </svg>

            {/* Nodes Container */}
            <div className="relative w-[1000px] h-[300px] z-10">
              
              {/* Trigger Node */}
              <div className="absolute left-[120px] top-[100px] w-48 bg-[#1a1a1a] border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-black/50">
                <div className="bg-[#22c55e]/10 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">WHEN</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-white font-medium mb-1">Email arrives</div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Outlook
                  </div>
                </div>
                {/* Connection Point Right */}
                <div className="absolute right-0 top-[60px] translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
              </div>

              {/* Condition Node */}
              <div className="absolute left-[500px] top-[100px] w-48 bg-[#1a1a1a] border border-[#22c55e]/30 rounded-xl overflow-hidden shadow-xl shadow-[#22c55e]/10">
                <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <Network className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">CONDITION</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-white font-medium mb-2">Contains "Meeting"</div>
                  <div className="bg-[#111] border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-400">
                    Meeting
                  </div>
                </div>
                {/* Connection Point Left */}
                <div className="absolute left-0 top-[60px] -translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
                {/* Connection Point Right */}
                <div className="absolute right-0 top-[60px] translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
              </div>

              {/* Action Node */}
              <div className="absolute left-[820px] top-[100px] w-56 bg-[#1a1a1a] border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-black/50">
                <div className="bg-sky-500/10 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">THEN</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-white font-medium mb-1">Create Calendar Event</div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="w-3 h-3 bg-sky-500 rounded-sm"></div> Google Calendar
                  </div>
                </div>
                {/* Connection Point Left */}
                <div className="absolute left-0 top-[60px] -translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
