"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { navLinks } from "@/lib/nav";
interface Message {
  role: "user" | "agent";
  content: string;
}

interface ChatClientProps {
  userName?: string;
}

export function ChatClient({ userName = "" }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<{threadId: string, title: string}[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads on mount
  useEffect(() => {
    setIsMounted(true);
    fetchThreads();
  }, []);

  async function fetchThreads() {
    try {
      const res = await fetch("/api/chat/threads", { cache: "no-store" });
      const data = await res.json();
      if (data.threads) setThreads(data.threads);
    } catch (e) {
      console.error(e);
    }
  }

  // Fetch messages when currentThreadId changes
  useEffect(() => {
    if (!currentThreadId) {
      setMessages([]);
      return;
    }
    fetch(`/api/chat?threadId=${currentThreadId}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(console.error);
  }, [currentThreadId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        body: JSON.stringify({ message: userMessage, threadId: currentThreadId }),
      });

      const data = await res.json();
      if (data.threadId && !currentThreadId) {
        setCurrentThreadId(data.threadId);
        fetchThreads();
      }
      setMessages(prev => [...prev, { role: "agent", content: data.reply || data.message || data.error }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleAction(id: string) {
    const prompts: Record<string, string> = {
      unread: "Show my unread emails",
      summary: "Give me a quick summary of my last 3 emails",
      meeting: "Create a calendar event for ",
      agenda: "What is on my agenda for today?",
    };
    setInput(prompts[id] || "");
  }

  const actionCards = [
    { 
      id: "unread",
      icon: <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      bg: "bg-blue-950/20 hover:bg-blue-900/30",
      border: "border-blue-900/40",
      title: "Unread emails",
      subtitle: "See what's waiting in your inbox",
    },
    { 
      id: "summary",
      icon: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      bg: "bg-yellow-950/20 hover:bg-yellow-900/30",
      border: "border-yellow-900/40",
      title: "Quick summary",
      subtitle: "Catch up on your last 3 emails",
    },
    { 
      id: "meeting",
      icon: <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      bg: "bg-rose-950/20 hover:bg-rose-900/30",
      border: "border-rose-900/40",
      title: "Schedule a meeting",
      subtitle: "Create a calendar event with invites",
    },
    { 
      id: "agenda",
      icon: <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      bg: "bg-teal-950/20 hover:bg-teal-900/30",
      border: "border-teal-900/40",
      title: "Today's agenda",
      subtitle: "See all events on your calendar today",
    }
  ];
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/chat" navLinks={navLinks}>
        <div className="flex-1 overflow-y-auto space-y-1 min-w-[200px] mt-4 pt-4 border-t border-[#1a1a1a]">
          <button
            onClick={() => {
              setCurrentThreadId(null);
              setMessages([]);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white text-black hover:bg-neutral-200 rounded-full transition-colors mb-4 shadow-sm"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>

          {/* List of threads */}
          <div className="space-y-1 mt-4 border-t border-[#1a1a1a] pt-4">
            <div className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Recent</div>
            {threads.map(t => (
              <button
                key={t.threadId}
                onClick={() => setCurrentThreadId(t.threadId)}
                className={`w-full text-left px-3 py-2 text-sm truncate rounded-xl transition-colors ${
                  currentThreadId === t.threadId 
                    ? "bg-neutral-800 text-white" 
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>

      <div className="flex-1 flex h-screen bg-[#0a0a0a] overflow-hidden relative">

        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col relative h-full">



          {/* Main Content Area */}
          {!isMounted ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8" />
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight leading-tight">
                  Make a wish{userName ? `, ${userName}` : ""}
                </h1>
              </div>
              {/* Action Cards */}
              <div className="w-full max-w-3xl flex flex-col items-center">
                <p className="text-neutral-400 mb-6 font-medium">What can I help with tonight?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {actionCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleAction(card.id)}
                      className={`flex items-start text-left gap-4 p-5 rounded-2xl border transition-all ${card.bg} ${card.border}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {card.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-semibold">{card.title}</span>
                        <span className="text-sm text-neutral-400">{card.subtitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages area
            <div className="flex-1 overflow-y-auto p-6 space-y-6 mt-10">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Agent avatar */}
                  {msg.role === "agent" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center shrink-0 mr-3 mt-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full max-w-3xl">
                    <div
                      className={`rounded-3xl px-5 py-4 text-sm leading-relaxed ${msg.role === "user"
                        ? "bg-neutral-800 text-neutral-100 max-w-2xl ml-auto"
                        : "bg-neutral-900/40 border border-neutral-800/60 shadow-sm text-neutral-200"
                        }`}
                    >
                      {msg.role === "agent" ? (
                        <div className="text-neutral-200 markdown-body">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                              a: ({node, ...props}) => <a className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noreferrer" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                              code: ({node, inline, ...props}: any) => 
                                inline 
                                  ? <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300 text-xs" {...props} />
                                  : <code className="block bg-neutral-900/80 border border-neutral-700/50 p-3 rounded-lg overflow-x-auto text-xs my-3" {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                    {msg.role === "agent" && msg.content.includes("https://meet.google.com/") && (
                      <div className="pl-2">
                        {(() => {
                          const meetLinkMatch = msg.content.match(/(https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+)/);
                          if (meetLinkMatch) {
                            return (
                              <a
                                href={meetLinkMatch[1]}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl px-4 py-2 transition-colors shadow-sm"
                              >
                                Join Meeting →
                              </a>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center shrink-0 mr-3">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-3">
                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input — always at bottom */}
          <div className="p-4 w-full max-w-3xl mx-auto">
            <div className="w-full relative flex items-center bg-[#111111] border border-neutral-800/60 rounded-[20px] p-2 shadow-2xl transition-colors">
              <div className="pl-3 pr-2 flex items-center justify-center">
                <img src="/logo.png" alt="Ginnie Logo" className="w-10 h-10 rounded-full bg-[#10b981]/10 p-1 object-contain shrink-0" />
              </div>

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
                placeholder="Message Ginnie..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 py-2.5 text-base px-2 resize-none custom-scrollbar max-h-48"
                style={{ minHeight: '44px' }}
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-neutral-400 hover:text-white transition-colors mr-2 disabled:opacity-30 border border-neutral-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>

            <p className="text-center text-[10px] text-neutral-600 mt-3">
              Ginnie can make mistakes. Consider verifying important information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}