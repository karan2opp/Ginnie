"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Network, Calendar as CalendarIcon, Save, Play, MessageSquare, Zap, Clock, MessageCircle } from "lucide-react";

type FlowType = "meetings" | "summarize" | "reply";

export function AutomateSection() {
  const [activeFlow, setActiveFlow] = useState<FlowType>("meetings");

  const flows = {
    meetings: {
      title: "Meeting Automation",
      nodes: [
        { id: "1", type: "WHEN", title: "Email arrives", subtitle: "Outlook", icon: Mail, color: "#22c55e", bg: "bg-[#22c55e]/10", x: 40, y: 180 },
        { id: "2", type: "CONDITION", title: 'Contains "Meeting"', subtitle: "Meeting", icon: Network, color: "text-zinc-400", bg: "bg-zinc-800/50", x: 280, y: 180 },
        { id: "3", type: "THEN", title: "Create Calendar Event", subtitle: "Google Calendar", icon: CalendarIcon, color: "#0ea5e9", bg: "bg-sky-500/10", x: 520, y: 180 }
      ]
    },
    summarize: {
      title: "Daily Summarization",
      nodes: [
        { id: "1", type: "WHEN", title: "Schedule Trigger", subtitle: "Daily at 8:00 PM", icon: Clock, color: "#a855f7", bg: "bg-purple-500/10", x: 40, y: 180 },
        { id: "2", type: "ACTION", title: "Summarize Emails", subtitle: "Ginne AI", icon: Zap, color: "#22c55e", bg: "bg-[#22c55e]/10", x: 280, y: 180 },
        { id: "3", type: "THEN", title: "Send Slack Message", subtitle: "#daily-updates", icon: MessageSquare, color: "#eab308", bg: "bg-yellow-500/10", x: 520, y: 180 }
      ]
    },
    reply: {
      title: "Smart Auto-Reply",
      nodes: [
        { id: "1", type: "WHEN", title: "Email arrives", subtitle: "Gmail", icon: Mail, color: "#ef4444", bg: "bg-red-500/10", x: 40, y: 180 },
        { id: "2", type: "ACTION", title: "Draft AI Reply", subtitle: "Tone: Professional", icon: MessageCircle, color: "#22c55e", bg: "bg-[#22c55e]/10", x: 280, y: 180 },
        { id: "3", type: "THEN", title: "Send Email", subtitle: "Gmail", icon: Mail, color: "#ef4444", bg: "bg-red-500/10", x: 520, y: 180 }
      ]
    }
  };

  return (
    <section id="automations" className="w-full max-w-7xl mx-auto px-8 py-32 z-10 flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Automate everything.
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Design complex logic with simple nodes. No coding required, just your process.
        </p>
      </div>

      <div className="w-full max-w-5xl relative">
        
        {/* Inner Modal */}
        <div className="bg-[#111111] rounded-xl border border-zinc-800/80 overflow-hidden shadow-black shadow-2xl relative flex h-[500px]">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-14 border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur z-30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Network className="w-4 h-4 text-[#22c55e]" />
              Workflows <span className="text-zinc-600">&gt;</span> 
              <AnimatePresence mode="wait">
                <motion.span 
                  key={activeFlow}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-white font-medium"
                >
                  {flows[activeFlow].title}
                </motion.span>
              </AnimatePresence>
            </div>
            {/* Buttons removed based on feedback */}
          </div>

          <div className="flex w-full h-full pt-14 z-20">
            {/* Sidebar Flow Menu */}
            <div className="w-64 bg-[#0a0a0a]/80 backdrop-blur border-r border-zinc-800/80 flex flex-col py-4 px-3 gap-2">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 mb-2">Templates</div>
              
              <button 
                onClick={() => setActiveFlow("meetings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeFlow === "meetings" ? "bg-[#22c55e]/10 text-[#22c55e]" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}
              >
                <CalendarIcon className="w-4 h-4" /> Auto-Schedule Meetings
              </button>
              <button 
                onClick={() => setActiveFlow("summarize")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeFlow === "summarize" ? "bg-[#22c55e]/10 text-[#22c55e]" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}
              >
                <Zap className="w-4 h-4" /> Summarize Emails
              </button>
              <button 
                onClick={() => setActiveFlow("reply")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeFlow === "reply" ? "bg-[#22c55e]/10 text-[#22c55e]" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}
              >
                <MessageCircle className="w-4 h-4" /> Smart Auto-Reply
              </button>
            </div>

            {/* Node Canvas Area */}
            <div className="flex-1 relative flex items-center justify-start overflow-hidden pl-10">
              
              {/* SVG Connecting Lines (Animated to match nodes) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path d="M 232 240 L 280 240" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 472 240 L 520 240" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
              </svg>

              {/* Nodes Container */}
              <div className="relative w-full h-full z-10 flex items-center">
                <AnimatePresence mode="popLayout">
                  {flows[activeFlow].nodes.map((node) => {
                    const Icon = node.icon;
                    return (
                      <motion.div
                        key={node.id + activeFlow}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute w-48 bg-[#1a1a1a] border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-black/50"
                        style={{ left: node.x, top: "180px" }}
                      >
                        <div className={`${node.bg} px-4 py-2 border-b border-zinc-800 flex items-center gap-2`}>
                          <Icon className="w-4 h-4" style={{ color: node.color !== 'text-zinc-400' ? node.color : undefined }} />
                          <span className={`text-xs font-semibold uppercase tracking-wider ${node.color === 'text-zinc-400' ? 'text-zinc-300' : 'text-white'}`}>
                            {node.type}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-white font-medium mb-1 line-clamp-1" title={node.title}>{node.title}</div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: node.color !== 'text-zinc-400' ? node.color : '#555' }}></div> 
                            {node.subtitle}
                          </div>
                        </div>
                        
                        {/* Connection Points */}
                        {node.id !== "1" && (
                          <div className="absolute left-0 top-[60px] -translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
                        )}
                        {node.id !== "3" && (
                          <div className="absolute right-0 top-[60px] translate-x-1/2 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#1a1a1a]"></div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
