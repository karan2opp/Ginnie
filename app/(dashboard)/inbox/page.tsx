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
                      {/* Big Subject Header & Back Button */}
                      <div className="px-10 pt-10 pb-6 shrink-0 flex items-start gap-4">
                        <Link 
                          href={`/inbox?folder=${folder}`} 
                          className="mt-1 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                          title="Back to Inbox"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                        </Link>
                        <h1 className="text-3xl font-bold text-white leading-tight">{selectedEmail.subject}</h1>
                      </div>

                      {/* Main Scrollable Area - Changed to flex column to fill screen */}
                      <div className="flex-1 flex flex-col overflow-hidden px-10 pb-10 min-h-0">
                        {/* Sender Info Row */}
                        <div className="flex items-center justify-between mb-6 shrink-0">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-lg">
                              {selectedEmail.from.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-white text-base">{selectedEmail.from.split('<')[0]?.trim() || selectedEmail.from}</span>
                                {selectedEmail.from.includes('<') && (
                                  <span className="text-sm text-neutral-500">&lt;{selectedEmail.from.split('<')[1]}</span>
                                )}
                              </div>
                              <span className="text-xs text-neutral-500">To: you</span>
                            </div>
                          </div>
                          <span className="text-sm text-neutral-500">{selectedEmail.date}</span>
                        </div>

                        {/* Email Body Iframe in White Card */}
                        <div className="w-full flex-1 bg-white text-black rounded-xl shadow-lg overflow-hidden border border-neutral-200 mb-6 flex flex-col min-h-0">
                          <iframe 
                            srcDoc={`<style>body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2.5rem; line-height: 1.6; font-size: 15px; margin: 0; color: #000; background-color: #fff; word-wrap: break-word; } *, body { color: #000 !important; background-color: transparent !important; color-scheme: light; } a, a * { color: #2563eb !important; text-decoration: none; } a:hover { text-decoration: underline; } blockquote { border-left: 3px solid #ccc; padding-left: 1rem; margin-left: 0; color: #666 !important; }</style>` + selectedEmail.bodyHtml}
                            className="w-full flex-1"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                          />
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="flex items-center gap-3 shrink-0 relative z-50">
                          <ReplyWithAIChat emailContext={selectedEmail} />
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
