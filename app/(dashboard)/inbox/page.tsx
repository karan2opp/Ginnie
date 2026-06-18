import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { fetchInboxData } from "./inbox.service";
import { EmailListClient } from "./EmailListClient";
import { InboxSearch } from "./InboxSearch";
import { ReplyWithAIChat } from "./ReplyWithAIChat";
import { navLinks } from "@/lib/nav";
export default async function InboxPage({ searchParams }: any) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const folder = params?.folder || "INBOX";
  const messageId = params?.messageId;
  const q = params?.q || "";

  let emails: any[] = [];
  let isConnected = false;
  let errorMsg: string | null = null;
  let selectedEmail: any = null;
  let nextPageToken: string | undefined = undefined;

  try {
    const data = await fetchInboxData(userId, folder, messageId, undefined, q);
    isConnected = data.isConnected;
    emails = data.emails;
    selectedEmail = data.selectedEmail;
    nextPageToken = data.nextPageToken;
  } catch (error: any) {
    console.error("Failed to fetch emails:", error);
    errorMsg = error.message || "Unknown error";
  }



  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath={messageId ? "" : `/inbox?folder=${folder}`} navLinks={navLinks} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Header */}
        {!messageId && (
          <header className="h-20 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 min-w-0">
            <h1 className="text-2xl font-bold text-white capitalize truncate pr-4">
              {folder.toLowerCase()}
            </h1>
            <InboxSearch />
          </header>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {errorMsg ? (
            <div className="m-10 max-w-md w-full bg-neutral-900/50 border border-red-500/20 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
              <p className="text-neutral-400 font-mono text-sm">{errorMsg}</p>
            </div>
          ) : !isConnected ? (
            <div className="m-auto text-center max-w-sm">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Not Connected</h2>
              <p className="text-neutral-500 mb-8">Please connect your Google account to access your mailbox.</p>
              <Link href="/connect" className="inline-flex bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                Connect Google
              </Link>
            </div>
          ) : (
            <>
              {/* Email List Column */}
              {!messageId && (
                <EmailListClient folder={folder} initialEmails={emails} initialNextPageToken={nextPageToken} q={q} />
              )}

              {/* Reading Pane Column */}
              {messageId && (
                <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a]">
                  {selectedEmail ? (
                    <>
                      {/* Unified Compact Header */}
                      <div className="h-16 px-4 border-b border-neutral-800/60 shrink-0 bg-neutral-950 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Back Button */}
                          <Link 
                            href={`/inbox?folder=${folder}`} 
                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                            title="Back to Inbox"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                          </Link>
                          
                          {/* Sender Avatar */}
                          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm text-sm">
                            {selectedEmail.from.charAt(0).toUpperCase()}
                          </div>
                          
                          {/* Subject & Sender Text */}
                          <div className="flex flex-col min-w-0 justify-center">
                            <h2 className="text-sm font-semibold text-white truncate leading-tight">{selectedEmail.subject}</h2>
                            <div className="flex items-center gap-2 text-xs text-neutral-400 leading-tight">
                              <span className="truncate">{selectedEmail.from}</span>
                              <span className="hidden sm:inline">&bull;</span>
                              <span className="hidden sm:inline">to me</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions & Date */}
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs text-neutral-500 hidden md:block">{selectedEmail.date}</span>
                          <div className="flex items-center gap-1 border-l border-neutral-800/60 pl-4">
                            <ReplyWithAIChat emailContext={selectedEmail} />
                            <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors" title="Reply">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors" title="Archive">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden px-10 pb-10 bg-neutral-950">
                        {/* 
                          Using an iframe prevents the email's inline styles from breaking the dark theme,
                          and provides a white canvas for standard HTML emails to look correct.
                        */}
                        <div className="w-full h-full bg-[#111111] rounded-xl shadow-2xl overflow-hidden border border-neutral-800/60">
                          <iframe 
                            srcDoc={`<style>*, body { color: #ffffff !important; background-color: #111111 !important; color-scheme: dark; } a, a * { color: #60a5fa !important; }</style>` + selectedEmail.bodyHtml}
                            className="w-full h-full"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="m-auto text-neutral-500">Loading message...</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
