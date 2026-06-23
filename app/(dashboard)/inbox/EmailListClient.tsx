"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EmailListClient({ folder, initialEmails = [], initialNextPageToken, q = "" }: { folder: string, initialEmails?: any[], initialNextPageToken?: string, q?: string }) {
  const [filter, setFilter] = useState("all");
  const [emails, setEmails] = useState<any[]>(initialEmails);
  const [loading, setLoading] = useState(folder === "INBOX");
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(initialNextPageToken);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (folder !== "INBOX") {
      setEmails(initialEmails);
      setNextPageToken(initialNextPageToken);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/emails?filter=${filter}&folder=INBOX${q ? `&q=${encodeURIComponent(q)}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setEmails(data.emails || []);
        // Only set nextPageToken on initial load if we don't have one, or if it changed
        if (data.nextPageToken) setNextPageToken(data.nextPageToken);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching emails:", err);
        setLoading(false);
      });
  }, [filter, folder, q]); // Don't include initialEmails/Token to prevent infinite re-fetches

  const loadMore = async () => {
    if (!nextPageToken || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const res = await fetch(`/api/emails?filter=${filter}&folder=${folder}&pageToken=${nextPageToken}${q ? `&q=${encodeURIComponent(q)}` : ''}`);
      const data = await res.json();
      if (data.emails) {
        // Prevent duplicates
        const existingIds = new Set(emails.map(e => e.id));
        const newEmails = data.emails.filter((e: any) => !existingIds.has(e.id));
        setEmails(prev => [...prev, ...newEmails]);
      }
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error("Failed to load more emails:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageToken && !isFetchingMore) {
        loadMore();
      }
    }, { rootMargin: '100px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextPageToken, isFetchingMore, emails]);

  const updatePriority = async (id: string, priority: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/emails/${id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      // Optimistic update
      setEmails(emails.map(email => 
        email.id === id ? { ...email, priority } : email
      ));
    } catch (error) {
      console.error("Failed to update priority", error);
    }
  };

  // Helper to format dates consistently
  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr); // fallback for plain string
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0a] relative">
      {/* Filter Tabs - Only for INBOX */}
      {folder === "INBOX" && (
        <div className="flex items-center gap-6 p-6 border-b border-[#1a1a1a] shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === "all" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("primary")}
            className={`text-sm font-semibold transition-colors ${filter === "primary" ? "text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Primary
          </button>
          <button
            onClick={() => setFilter("urgent")}
            className={`text-sm font-semibold transition-colors flex items-center gap-2 ${filter === "urgent" ? "text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Urgent
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>
        </div>
      )}

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-neutral-500">Loading emails...</div>
        ) : emails.length === 0 ? (
          <div className="p-10 text-center text-neutral-500">No emails found.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {emails.map((email) => (
              <div key={email.id} className="relative group block">
                <Link 
                  href={`/inbox?folder=${folder}&messageId=${email.id}`}
                  className="block p-6 hover:bg-[#111111] transition-colors cursor-pointer pr-16"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <p className="font-bold text-lg truncate text-white">{email.from}</p>
                      <span className="text-xs text-neutral-500 shrink-0">{formatDate(email.date)}</span>
                    </div>
                    <h3 className="text-base font-semibold truncate text-white flex items-center gap-2">
                      {email.subject}
                      {email.priority === 'urgent' && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>}
                      {email.priority === 'primary' && <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0"></span>}
                    </h3>
                    <p className="text-sm text-neutral-500 truncate">{email.snippet}</p>
                  </div>
                </Link>


              </div>
            ))}
            
            {/* Infinite Scroll Sentinel */}
            {nextPageToken && (
              <div id="scroll-sentinel" className="p-8 flex justify-center">
                {isFetchingMore ? (
                   <div className="flex items-center gap-2 text-[#10b981]">
                     <span className="w-2 h-2 rounded-full bg-[#10b981] animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-2 h-2 rounded-full bg-[#10b981] animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-2 h-2 rounded-full bg-[#10b981] animate-bounce"></span>
                   </div>
                ) : (
                   <div className="h-8"></div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB Compose Button */}
      <div className="absolute bottom-6 right-6">
        <button className="w-14 h-14 bg-[#10b981] hover:bg-[#0ea5e9] hover:bg-emerald-400 transition-colors rounded-2xl shadow-lg flex items-center justify-center text-black">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
