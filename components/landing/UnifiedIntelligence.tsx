"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Calendar as CalendarIcon, Search, Zap, CheckCircle2, MoreHorizontal, Mail } from "lucide-react";

export function UnifiedIntelligence() {
  const [activeTab, setActiveTab] = useState("Inbox");

  const tabs = ["Inbox", "Calendar", "Search", "Automations"];

  return (
    <section id="unified-ai" className="w-full max-w-7xl mx-auto px-8 py-32 z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Unified Intelligence
        </h2>
        <p className="text-zinc-400 text-lg">
          One engine, multiple interfaces. Built for scale.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
        
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-zinc-800/80 px-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-[#22c55e]" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mockup Display Area */}
        <div className="relative w-full h-[400px] bg-[#111111] border border-zinc-800/80 rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-6 flex"
            >
              {activeTab === "Inbox" && <InboxMockup />}
              {activeTab === "Calendar" && <CalendarMockup />}
              {activeTab === "Search" && <SearchMockup />}
              {activeTab === "Automations" && <AutomationsMockup />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

// --- Sub-Mockups ---

function InboxMockup() {
  const [scheduled, setScheduled] = useState(false);

  return (
    <div className="w-full flex gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white font-medium mb-2">
          <Inbox className="w-4 h-4 text-[#22c55e]" /> Inbox
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#22c55e]/30 group hover:border-[#22c55e] transition-colors cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e]/0 to-[#22c55e]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></div>
              Project Update - GreenTech
            </div>
            <div className="text-xs text-zinc-500">11:42 AM</div>
          </div>
          <div className="text-xs text-zinc-400 relative z-10">Project requirements for your Project Update...</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-zinc-800 group hover:border-zinc-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              Meeting Notes
            </div>
            <div className="text-xs text-zinc-500">10:30 AM</div>
          </div>
          <div className="text-xs text-zinc-400">Meeting notes on upcoming sprint integrations...</div>
        </div>
      </div>
      <div className="w-64 flex flex-col gap-4">
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-zinc-800 relative overflow-hidden">
          <div className="text-xs font-semibold text-white mb-4">Smart Scheduling</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 mb-2">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-300">
             <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
             <div>8</div><div className="bg-[#22c55e] text-black rounded font-bold shadow-[0_0_8px_#22c55e]/50">9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
          </div>
          <button 
            onClick={() => setScheduled(true)}
            className={`w-full mt-4 text-black text-xs font-bold py-2.5 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
              scheduled ? "bg-white" : "bg-[#22c55e] hover:bg-[#16a34a]"
            }`}
          >
            {scheduled ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Scheduled
              </>
            ) : "Schedule Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarMockup() {
  return (
    <div className="w-full flex gap-6">
      <div className="w-48 border-r border-zinc-800/80 pr-6 flex flex-col gap-3 pt-2">
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">Upcoming</div>
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 p-2.5 rounded-lg border-l-2 border-l-[#22c55e]">
          <div className="text-xs font-semibold text-white mb-0.5">Design Sync</div>
          <div className="text-[10px] text-[#22c55e]">In 15 mins</div>
        </div>
        <div className="bg-[#1a1a1a] p-2.5 rounded-lg border border-zinc-800 border-l-2 border-l-indigo-500">
          <div className="text-xs font-semibold text-zinc-300 mb-0.5">Q3 Review</div>
          <div className="text-[10px] text-zinc-500">2:00 PM</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-2 relative">
        <div className="flex items-center gap-2 text-white font-medium mb-6">
          <CalendarIcon className="w-4 h-4 text-indigo-500" /> Today's Timeline
        </div>
        <div className="relative pl-6 border-l border-zinc-800 flex-1">
          {/* Timeline Item 1 */}
          <div className="relative mb-8">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-500 -left-[18px] top-1 shadow-[0_0_8px_indigo]/50" />
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-white">10:00 AM</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium tracking-wide">1 HOUR</span>
            </div>
            <div className="text-sm text-zinc-300">Quarterly Business Review</div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-[#22c55e]" /> AI Auto-Scheduled
            </div>
          </div>
          {/* Timeline Item 2 */}
          <div className="relative">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-zinc-600 -left-[18px] top-1" />
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-white">2:00 PM</span>
            </div>
            <div className="text-sm text-zinc-300">Engineering Sync</div>
            <div className="text-xs text-zinc-500 mt-1">Video Call link attached</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchMockup() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Based on the Q3 Marketing notes, the primary campaign launch is scheduled for September 15th. I've attached the relevant PDF documents below.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col h-full gap-4">
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500" />
        <span className="text-sm text-white">"When is the marketing campaign launching?"</span>
      </div>
      <div className="flex-1 bg-[#111111] border border-zinc-800/50 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" />
          </div>
          <span className="text-xs font-bold text-[#22c55e] tracking-widest uppercase">Ginne AI</span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed min-h-[60px]">
          {typedText}
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-1.5 h-4 bg-[#22c55e] ml-1 align-middle"
          />
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: typedText.length > 50 ? 1 : 0, y: typedText.length > 50 ? 0 : 10 }}
          className="mt-6 flex gap-3"
        >
          <div className="bg-zinc-800/50 border border-zinc-700 p-2.5 rounded-lg flex items-center gap-3">
            <div className="bg-red-500/20 text-red-400 p-1.5 rounded text-[10px] font-bold">PDF</div>
            <div className="text-xs text-white">Q3_Marketing_Strategy.pdf</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AutomationsMockup() {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 text-sm">
        <div className="flex items-center gap-2 font-medium text-white">
          <Zap className="w-4 h-4 text-amber-500" /> Invoice Processing Pipeline
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></div>
          <span className="text-xs text-zinc-400">Active</span>
        </div>
      </div>
      
      {/* Node Workflow */}
      <div className="flex-1 flex items-center justify-center gap-4 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
        
        <div className="bg-[#1a1a1a] border border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center z-10 w-32 shadow-xl">
          <Mail className="w-6 h-6 text-zinc-400 mb-2" />
          <div className="text-[10px] font-bold text-white text-center">New Email</div>
        </div>
        
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/50 rounded-xl p-4 flex flex-col items-center justify-center z-10 w-32 shadow-xl shadow-[#22c55e]/5">
          <Zap className="w-6 h-6 text-[#22c55e] mb-2" />
          <div className="text-[10px] font-bold text-[#22c55e] text-center">Extract PDF</div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center z-10 w-32 shadow-xl">
          <CheckCircle2 className="w-6 h-6 text-zinc-400 mb-2" />
          <div className="text-[10px] font-bold text-white text-center">Sync to DB</div>
        </div>
      </div>
    </div>
  );
}
