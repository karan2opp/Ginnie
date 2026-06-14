"use client";

import Link from "next/link";
import { useState } from "react";

interface SidebarProps {
  currentPath: string; // e.g. "/inbox?folder=INBOX" or "/calendar"
  navLinks: Array<{ name: string; href: string; icon: string; isActive?: boolean }>;
}

export function Sidebar({ currentPath, navLinks }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} shrink-0 border-r border-neutral-800/60 bg-neutral-900/50 p-4 hidden md:flex flex-col transition-all duration-300 ease-in-out`}>
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-10`}>
        {isOpen && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              G
            </div>
            <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">Ginnie</span>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <nav className="space-y-2">
        {navLinks.map((link) => {
          const isActive = link.isActive !== undefined ? link.isActive : currentPath === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              title={!isOpen ? link.name : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl font-medium transition-all ${isActive ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/50' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'} ${!isOpen ? 'justify-center' : ''}`}
            >
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {isOpen && <span className="whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
