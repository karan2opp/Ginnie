"use client";

import Link from "next/link";
import { useState } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";

interface SidebarProps {
  currentPath: string; // e.g. "/inbox?folder=INBOX" or "/calendar"
  navLinks: Array<{ name: string; href: string; icon: string; isActive?: boolean; adminOnly?: boolean }>;
  children?: React.ReactNode;
}

export function Sidebar({ currentPath, navLinks, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useUser();

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} shrink-0 border-r border-[#1a1a1a] bg-[#0a0a0a] p-4 hidden md:flex flex-col transition-all duration-300 ease-in-out`}>
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-10`}>
        {isOpen && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 h-8 w-8 rounded-lg bg-[#10b981] flex items-center justify-center text-black font-bold shadow-sm">
              G
            </div>
            <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">Ginnie</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="space-y-1">
        {navLinks.filter((link: any) => {
          if (link.adminOnly) {
            return user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          }
          return true;
        }).map((link: any) => {
          const isActive = link.isActive !== undefined ? link.isActive : currentPath === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={!isOpen ? link.name : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-[#1a1a1a] text-[#10b981]' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200'} ${!isOpen ? 'justify-center' : ''}`}
            >
              {link.icon === "G_LOGO" ? (
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 font-bold text-[12px] transition-colors ${isActive ? 'bg-[#10b981] text-black shadow-sm' : 'bg-neutral-800 text-neutral-400 group-hover:bg-[#10b981] group-hover:text-black'}`}>
                  G
                </div>
              ) : (
                <svg className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#10b981]' : 'text-neutral-500 group-hover:text-neutral-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
              )}
              {isOpen && <span className="whitespace-nowrap text-sm">{link.name}</span>}
            </Link>
          );
        })}
      </nav>
      {isOpen && children && (
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      )}

      <div className={`mt-auto pt-4 ${children ? 'border-t border-[#1a1a1a]' : ''}`}>
        <SignOutButton redirectUrl="/sign-up">
          <button
            title={!isOpen ? "Logout" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-medium transition-all text-neutral-400 hover:bg-[#1a1a1a] hover:text-white ${!isOpen ? 'justify-center' : ''}`}
          >
            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-neutral-400 font-bold">N</span>
            </div>
            {isOpen && <span className="whitespace-nowrap text-sm">Logout</span>}
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
