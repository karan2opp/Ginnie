"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      setMessages(prev => [...prev, { role: "agent", content: data.reply || data.error }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  // Action pill click — prefills input
  function handlePill(label: string) {
    const prompts: Record<string, string> = {
      Write: "Write an email to ",
      Summarize: "Summarize my latest emails",
      Analyze: "Analyze my inbox and tell me what needs attention",
      "Create a meeting": "Create a calendar event for ",
    };
    setInput(prompts[label] || "");
  }

  const navLinks = [
    { name: "Inbox", href: "/inbox?folder=INBOX", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4", isActive: false },
    { name: "Calendar", href: "/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", isActive: false },
    { name: "Chat with Ginnie", href: "/chat", icon: "M13 10V3L4 14h7v7l9-11h-7z", isActive: true }
  ];

  const actionPills = [
    { icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", label: "Write", shortcut: "Alt W" },
    { icon: "M4 6h16M4 12h8m-8 6h16", label: "Summarize", shortcut: "Alt U" },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Analyze", shortcut: "Alt A" },
    { icon: "M12 4v16m8-8H4", label: "Create a meeting", shortcut: "Alt M" }
  ];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'w':
            e.preventDefault();
            handlePill("Write");
            break;
          case 'u':
            e.preventDefault();
            handlePill("Summarize");
            break;
          case 'a':
            e.preventDefault();
            handlePill("Analyze");
            break;
          case 'm':
            e.preventDefault();
            handlePill("Create a meeting");
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/chat" navLinks={navLinks}>
        <div className="flex-1 overflow-y-auto space-y-1 min-w-[200px] mt-4 pt-4 border-t border-neutral-800/40">
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
          <div className="space-y-1 mt-4 border-t border-neutral-800/40 pt-4">
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

          {/* Profile Icon */}
          <div className="absolute top-4 right-6 z-10">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
              <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Main Content Area */}
          {!isMounted ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8" />
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">
                  kya hukam hai mere aka
                  {userName && <><br />{userName}</>}
                </h1>
              </div>

              {/* Action Pills — only on welcome */}
              <div className="w-full max-w-3xl flex flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  {actionPills.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePill(pill.label)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900/60 border border-neutral-700 hover:bg-white hover:text-black hover:border-white transition-all text-sm font-medium text-neutral-300 group"
                    >
                      <svg className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pill.icon} />
                      </svg>
                      {pill.label}
                      {pill.shortcut && (
                        <span className="ml-1 px-2 py-0.5 text-[10px] bg-neutral-800 rounded text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-800 transition-colors">
                          {pill.shortcut}
                        </span>
                      )}
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
            <div className="w-full relative flex items-center bg-neutral-900/80 border border-neutral-700/60 rounded-[24px] p-2 shadow-2xl backdrop-blur-xl hover:border-neutral-600 transition-colors">
              <div className="pl-3 pr-2 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Message Ginnie..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-200 placeholder-neutral-500 py-3 text-lg"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors mr-1 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
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