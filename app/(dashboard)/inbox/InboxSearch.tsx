"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function InboxSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }
    // Delete messageId so we go back to list view on search
    params.delete("messageId");
    router.push(`/inbox?${params.toString()}`);
  };

  return (
    <div className="relative group shrink-0">
      <input 
        type="text" 
        placeholder="Search..." 
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === "") {
            handleSearch("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(value);
          }
        }}
        className="pl-11 pr-10 py-2.5 rounded-xl bg-[#111111] border border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#10b981]/50 focus:border-[#10b981]/50 w-full sm:w-64 transition-all placeholder:text-neutral-600 font-medium text-sm text-neutral-200"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            handleSearch("");
          }}
          className="absolute right-3 top-2.5 p-1 text-neutral-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <button 
        onClick={() => handleSearch(value)}
        className="absolute left-3 top-2.5 p-1 text-neutral-500 hover:text-[#10b981] transition-colors"
      >
        <svg className="w-4 h-4 group-focus-within:text-[#10b981] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}
