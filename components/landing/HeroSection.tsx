import Link from "next/link";
import { ArrowRight, Terminal, Plus, Inbox, ChevronRight, Play } from "lucide-react";

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
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link href="/sign-up" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#22c55e] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors">
            Start Free
          </Link>
          <Link href="#" className="w-full sm:w-auto flex items-center justify-center bg-transparent text-white font-medium px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors">
            Book Demo
          </Link>
        </div>
      </div>

      {/* Right Column - New Command Center Mockup */}
      <div className="flex-1 w-full max-w-2xl relative">
        <div className="bg-[#1f2023] rounded-3xl p-4 shadow-2xl border border-zinc-800/50">
          
          {/* Inner Modal */}
          <div className="bg-[#111111] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-black shadow-2xl relative flex">
            
            {/* Mockup Sidebar */}
            <div className="w-48 bg-[#0a0a0a] border-r border-zinc-800/50 flex flex-col py-4 px-3">
              <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs mb-6 px-2">
                <Terminal className="w-4 h-4 text-[#22c55e]" />
                AI Command Center
              </div>
              
              <div className="mb-6">
                <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2 px-2">August 2023</div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 mb-1">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-300">
                  <div className="text-zinc-600">30</div><div className="text-zinc-600">31</div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                  <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                  <div>13</div><div>14</div><div>15</div><div className="bg-[#22c55e] text-black rounded-sm font-bold">16</div><div>17</div><div>18</div><div>19</div>
                  <div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2 px-2">Upcoming</div>
                <div className="flex flex-col gap-1">
                  <div className="bg-[#1a1a1a] border-l-2 border-[#22c55e] px-2 py-1.5 rounded-r">
                    <div className="text-[10px] text-zinc-300 font-medium">Board Meeting</div>
                    <div className="text-[9px] text-zinc-500">7:00 AM</div>
                  </div>
                  <div className="px-2 py-1.5 border-l-2 border-transparent">
                    <div className="text-[10px] text-zinc-400 font-medium">Product Launch</div>
                    <div className="text-[9px] text-zinc-500">8:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup Main Area */}
            <div className="flex-1 p-5 flex flex-col relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium text-sm">Inbox</h3>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-400 flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded">
                    <Inbox className="w-3 h-3" /> Inbox <ChevronRight className="w-3 h-3" />
                  </div>
                  <button className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                    <Plus className="w-3 h-3" /> Command
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 flex-1">
                <div className="group border-b border-zinc-800/50 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-white font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
                      AI Draft: Quarterly Business Review
                    </div>
                    <div className="text-[10px] text-zinc-500">7:20 AM</div>
                  </div>
                  <div className="text-[10px] text-zinc-400 pl-3 leading-relaxed">
                    AI Draft: Quarterly Business Review, outlining key metrics and next steps for your organization and cross-functional teams.
                  </div>
                </div>

                <div className="group border-b border-zinc-800/50 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-white font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
                      Meeting Summary: Marketing Sync
                    </div>
                    <div className="text-[10px] text-zinc-500">7:10 PM</div>
                  </div>
                  <div className="text-[10px] text-zinc-400 pl-3 leading-relaxed">
                    Meeting Summary: Marketing Sync to cover Q3 requirements and resource allocations.
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-white font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                      Email from J. Smith
                    </div>
                    <div className="text-[10px] text-zinc-500">5:25 AM</div>
                  </div>
                  <div className="text-[10px] text-zinc-400 pl-3 leading-relaxed line-clamp-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                  </div>
                </div>
              </div>

              {/* Prompt Input Bottom */}
              <div className="absolute bottom-5 left-5 right-5 mt-4">
                <div className="bg-[#1a1a1a] border border-[#22c55e]/50 rounded-lg p-2.5 flex items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <div className="text-[#22c55e]">Drafting reply...</div>
                    <div className="text-zinc-600">[TAB] to autocomplete</div>
                  </div>
                  <div className="w-6 h-6 bg-[#22c55e]/20 rounded flex items-center justify-center text-[#22c55e]">
                    <Play className="w-3 h-3 fill-current" />
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
