"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "agent";
  content: string;
}

export function CalendarMiniChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, threadId }),
      });

      const data = await res.json();
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      const reply = data.reply || data.error;
      setMessages(prev => [...prev, { role: "agent", content: reply }]);

      // If the agent successfully scheduled a meeting, refresh the calendar
      if (reply.includes("Meeting scheduled!")) {
        router.refresh();
      }

    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-[100]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute top-14 right-0 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
          {/* Header */}
          <div className="h-14 bg-[#141414] border-b border-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                <span className="text-[#10b981] font-bold">G</span>
              </div>
              <h3 className="font-semibold text-white">Ginnie Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0a0a]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-neutral-300 font-medium mb-1">Schedule a meeting?</p>
                <p className="text-neutral-500 text-xs">Try saying: "Set up a sync with bob@example.com for tomorrow at 3pm"</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user" 
                      ? "bg-[#111111] text-white border border-[#1a1a1a]" 
                      : "bg-[#10b981]/10 text-neutral-200 border border-[#10b981]/20"
                  }`}>
                    {msg.role === "agent" ? (
                       <div className="markdown-body text-xs">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              a: ({node, ...props}) => <a className="text-[#10b981] hover:text-emerald-400 underline break-all" target="_blank" rel="noreferrer" {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                       </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#10b981]/10 text-neutral-200 border border-[#10b981]/20 rounded-2xl px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#0a0a0a] border-t border-[#1a1a1a] shrink-0">
            <div className="relative flex items-center bg-[#111111] border border-[#1a1a1a] rounded-xl px-2 py-1 focus-within:border-[#10b981] transition-colors">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask Ginnie..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 py-1.5 px-2 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#10b981] hover:bg-emerald-400 text-black transition-colors disabled:opacity-30 ml-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button in Header */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#10b981] hover:bg-emerald-400 text-black px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </button>
      )}

    </div>
  );
}
