"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "agent";
  content: string;
}

export function ReplyWithAIChat({ emailContext }: { emailContext?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ message: userMessage, threadId, emailContext }),
      });

      const data = await res.json();
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      const reply = data.reply || data.error;
      setMessages(prev => [...prev, { role: "agent", content: reply }]);

    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-[100]">
      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 px-3 py-1.5 text-xs rounded-lg font-bold transition-colors shadow-sm flex items-center gap-1.5 mr-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Reply with AI
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute top-10 right-0 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl w-80 sm:w-96 h-[400px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
          {/* Header */}
          <div className="h-12 bg-[#141414] border-b border-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                <span className="text-black font-bold text-xs">G</span>
              </div>
              <h3 className="font-semibold text-sm text-white">Ginnie</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0a0a]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <p className="text-neutral-300 font-medium text-sm mb-1">Reply to this email?</p>
                <p className="text-neutral-500 text-xs">"Draft a polite decline" or "Tell them I'll be there"</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
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
                <div className="bg-[#10b981]/10 text-neutral-200 border border-[#10b981]/20 rounded-2xl px-3 py-2 flex items-center gap-1">
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
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                rows={1}
                placeholder="Ask Ginnie..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 py-1.5 px-2 text-xs resize-none custom-scrollbar max-h-32"
                style={{ minHeight: '28px' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#10b981] hover:bg-emerald-400 text-black transition-colors disabled:opacity-30 ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
