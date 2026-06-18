"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Calendar as CalendarIcon, Search, Zap, CheckCircle2, MoreHorizontal } from "lucide-react";

export function UnifiedIntelligence() {
  const [activeTab, setActiveTab] = useState("Inbox");

  const tabs = ["Inbox", "Calendar", "Search", "Automations"];

  return (
    <section className="w-full max-w-7xl mx-auto px-8 py-32 z-10">
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
  return (
    <div className="w-full flex gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white font-medium mb-2">
          <Inbox className="w-4 h-4 text-[#22c55e]" /> Inbox
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#22c55e]/30">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
              Project Update - GreenTech
            </div>
            <div className="text-xs text-zinc-500">11:42 AM</div>
          </div>
          <div className="text-xs text-zinc-400">Project requirements for your Project Update...</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-zinc-800">
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
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-zinc-800">
          <div className="text-xs font-semibold text-white mb-4">Smart Scheduling</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-500 mb-2">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-zinc-300">
             <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
             <div>8</div><div className="bg-[#22c55e] text-black rounded font-bold">9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
          </div>
          <button className="w-full mt-4 bg-[#22c55e] text-black text-xs font-semibold py-2 rounded">
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarMockup() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full text-zinc-500">
      <CalendarIcon className="w-12 h-12 mb-4 text-[#22c55e]/50" />
      <p className="text-sm">Calendar Interface (AI Auto-Scheduling)</p>
    </div>
  );
}

function SearchMockup() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full text-zinc-500">
      <Search className="w-12 h-12 mb-4 text-[#22c55e]/50" />
      <p className="text-sm">Semantic Search Interface</p>
    </div>
  );
}

function AutomationsMockup() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full text-zinc-500">
      <Zap className="w-12 h-12 mb-4 text-[#22c55e]/50" />
      <p className="text-sm">Workflow Automation Interface</p>
    </div>
  );
}
