"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export function ChatClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navLinks = [
    { name: "Inbox", href: "/inbox?folder=INBOX", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4", isActive: false },
    { name: "Calendar", href: "/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", isActive: false },
    { name: "Chat with Ginnie", href: "/chat", icon: "M13 10V3L4 14h7v7l9-11h-7z", isActive: true }
  ];

  const actionPills = [
    { icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", label: "Write" },
    { icon: "M4 6h16M4 12h8m-8 6h16", label: "Summarize" },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Analyze" },
    { icon: "M12 4v16m8-8H4", label: "Create" },
    { icon: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z", label: "More" }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/chat" navLinks={navLinks} />

      {/* Main Content */}
      <div className="flex-1 flex h-screen bg-[#0a0a0a] overflow-hidden relative">
        
        {/* Toggle Button for Inner Sidebar (shows when closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shadow-lg"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Inner Chat Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0'} bg-neutral-950/50 border-r border-neutral-800/40 flex flex-col shrink-0 overflow-hidden`}>
          <div className="p-4 flex items-center justify-between border-b border-neutral-800/40 min-w-max">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-neutral-200">Ginnie</span>
            </div>
            
            {/* Close Inner Sidebar Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1 min-w-[256px]">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-xl transition-colors mb-4 group">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              New chat
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-xl transition-colors group">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search chats
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-xl transition-colors group">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Library
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-xl transition-colors group">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Explore GPTs
            </button>
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col relative h-full">
          
          {/* Top Right Profile Icon */}
          <div className="absolute top-4 right-6">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
               <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 mt-10">
            
            {/* Welcome Text */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">kya hukam hai mere aka</h1>
            </div>

            {/* Input Box Area */}
            <div className="w-full max-w-3xl flex flex-col items-center">
              
              <div className="w-full relative flex items-center bg-neutral-900/80 border border-neutral-700/60 rounded-[24px] p-2 shadow-2xl backdrop-blur-xl mb-6 group hover:border-neutral-600 transition-colors">
                {/* Prefix Icon */}
                <div className="pl-3 pr-2 flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Message Ginnie..." 
                  className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 py-3 text-lg"
                />

                {/* Submit Button */}
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors mr-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>

              {/* Action Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {actionPills.map((pill, idx) => (
                  <button 
                    key={idx} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-sm font-medium text-neutral-300 hover:text-white"
                  >
                    <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pill.icon} />
                    </svg>
                    {pill.label}
                  </button>
                ))}
              </div>

            </div>

          </div>

          <div className="w-full text-center p-4">
             <p className="text-[10px] text-neutral-600">Ginnie can make mistakes. Consider verifying important information.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
