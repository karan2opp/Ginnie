import Link from "next/link";
import { ArrowRight, Terminal, Plus, Inbox, ChevronRight, Play, LayoutDashboard, Mail, Calendar, Settings, Bell, Search, User } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-8 pt-32 pb-32 flex flex-col lg:flex-row items-center gap-16 z-10">
      
      {/* Background glow removed in favor of clean dark theme */}

      {/* Left Column */}
      <div className="flex-1 flex flex-col items-start text-left">
        <div className="text-[#22c55e] text-xs tracking-[0.2em] font-semibold uppercase mb-6">
          ENTERPRISE INTELLIGENCE
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Your inbox.<br/>
          <span className="text-[#22c55e]">On autopilot.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed">
          Ginne AI connects to your ecosystem to categorize, summarize, and automate your most repetitive communication tasks. Stop managing, start executing.
        </p>
        
        <div className="flex items-center gap-4 mt-8">
          <Link href="/sign-up" className="bg-[#22c55e] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            Start Free
          </Link>
        </div>
      </div>

      {/* Right Column - New Command Center Mockup */}
      <div className="flex-1 w-full max-w-2xl relative">
        <div className="relative w-full shadow-2xl shadow-[#22c55e]/10 rounded-xl">
          
          {/* Inner Modal - Dashboard Replica */}
          <div className="bg-[#0a0a0a] rounded-xl border border-zinc-800/80 overflow-hidden shadow-black shadow-2xl relative flex h-[350px]">
            
            {/* Sidebar Replica */}
            <div className="w-16 bg-[#050505] border-r border-zinc-800/50 flex flex-col items-center py-6 gap-6">
              <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center mb-2">
                <Terminal className="w-4 h-4 text-[#22c55e]" />
              </div>
              <LayoutDashboard className="w-5 h-5 text-zinc-300" />
              <Mail className="w-5 h-5 text-zinc-600" />
              <Calendar className="w-5 h-5 text-zinc-600" />
              <Settings className="w-5 h-5 text-zinc-600 mt-auto absolute bottom-6" />
            </div>

            {/* Main Area Replica */}
            <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold tracking-tight">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                  <Search className="w-4 h-4 text-zinc-500" />
                  <Bell className="w-4 h-4 text-zinc-500" />
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-3 h-3 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-3">
                  <div className="text-[9px] text-zinc-500 mb-1">Emails Processed</div>
                  <div className="text-sm font-bold text-white">1,204</div>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-3">
                  <div className="text-[9px] text-zinc-500 mb-1">Hours Saved</div>
                  <div className="text-sm font-bold text-[#22c55e]">42.5h</div>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-3">
                  <div className="text-[9px] text-zinc-500 mb-1">Tasks Automated</div>
                  <div className="text-sm font-bold text-white">89</div>
                </div>
              </div>

              {/* Widgets Row */}
              <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
                
                {/* Today's Agenda */}
                <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-3 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-sm bg-indigo-400" />
                    </div>
                    <div className="text-[10px] font-bold text-white">Today's Agenda</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-neutral-950 rounded-lg p-2 border border-neutral-800">
                      <div className="text-[9px] font-medium text-white line-clamp-1">Team Sync</div>
                      <div className="text-[8px] text-neutral-500">10:00 AM - 11:00 AM</div>
                    </div>
                    <div className="bg-neutral-950 rounded-lg p-2 border border-neutral-800">
                      <div className="text-[9px] font-medium text-white line-clamp-1">Product Review</div>
                      <div className="text-[8px] text-neutral-500">2:00 PM - 3:00 PM</div>
                    </div>
                  </div>
                </div>

                {/* Recent AI Activity */}
                <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl p-3 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-[#10b981]/10 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                    </div>
                    <div className="text-[10px] font-bold text-white">Recent AI Activity</div>
                  </div>
                  <div className="flex-1 relative pl-3 border-l-2 border-neutral-800">
                    <div className="absolute w-2 h-2 rounded-full bg-[#10b981] -left-[5px] top-1 shadow-[0_0_8px_#10b981]/50" />
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="text-[8px] text-neutral-500 font-bold uppercase">Just now</div>
                      <div className="text-[9px] text-neutral-300 bg-neutral-800/30 p-1.5 rounded-md border border-neutral-800/50">
                        "What is on my agenda for today?"
                      </div>
                    </div>
                    <div className="absolute w-2 h-2 rounded-full bg-[#10b981] -left-[5px] top-[45px] shadow-[0_0_8px_#10b981]/50" />
                    <div className="flex flex-col gap-1">
                      <div className="text-[8px] text-neutral-500 font-bold uppercase">2 hours ago</div>
                      <div className="text-[9px] text-neutral-300 bg-neutral-800/30 p-1.5 rounded-md border border-neutral-800/50 line-clamp-1">
                        "Summarize my unread emails"
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
