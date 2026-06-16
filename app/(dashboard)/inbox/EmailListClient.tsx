"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EmailListClient({ folder }: { folder: string }) {
  const [filter, setFilter] = useState("all");
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/emails?filter=${filter}`)
      .then(res => res.json())
      .then(data => {
        setEmails(data.emails || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching emails:", err);
        setLoading(false);
      });
  }, [filter]);

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

  return (
    <div className="flex flex-col w-full h-full bg-neutral-950">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-neutral-800/40 shrink-0">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("primary")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "primary" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
        >
          Primary
        </button>
        <button
          onClick={() => setFilter("urgent")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${filter === "urgent" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`}
        >
          Urgent
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        </button>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-neutral-500">Loading emails...</div>
        ) : emails.length === 0 ? (
          <div className="p-10 text-center text-neutral-500">No emails found.</div>
        ) : (
          <div className="divide-y divide-neutral-800/40">
            {emails.map((email) => (
              <div key={email.id} className="relative group block">
                <Link 
                  href={`/inbox?folder=${folder}&messageId=${email.id}`}
                  className="block p-5 hover:bg-neutral-900/50 transition-colors cursor-pointer pr-16"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {email.priority === "urgent" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 rounded-md shrink-0">Urgent</span>
                      )}
                      {email.priority === "primary" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md shrink-0">Primary</span>
                      )}
                      <p className="font-semibold truncate text-neutral-200">{email.from}</p>
                    </div>
                    <span className="text-xs text-neutral-500 whitespace-nowrap shrink-0">{new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-sm mb-1 truncate text-neutral-400">{email.subject}</h3>
                  <p className="text-xs text-neutral-600 truncate">{email.snippet}</p>
                </Link>

                {/* Quick Actions (Hover) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-900/80 backdrop-blur-sm p-1 rounded-lg border border-neutral-800 shadow-lg">
                  <button onClick={(e) => updatePriority(email.id, "urgent", e)} className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-red-400 transition-colors" title="Mark as Urgent">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                  <button onClick={(e) => updatePriority(email.id, "primary", e)} className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-blue-400 transition-colors" title="Mark as Primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button onClick={(e) => updatePriority(email.id, "normal", e)} className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors" title="Mark as Normal">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
