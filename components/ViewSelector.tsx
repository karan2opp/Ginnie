"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function ViewSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "month";
  const currentDate = searchParams.get("date") || "";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (view: string) => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  const views = ["day", "week", "month", "year"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm capitalize"
      >
        {currentView}
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => handleSelect(v)}
              className={`w-full text-left px-4 py-2 text-sm capitalize transition-colors ${
                currentView === v ? "bg-indigo-600/10 text-indigo-400 font-semibold" : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
