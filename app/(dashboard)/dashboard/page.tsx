import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { navLinks } from "@/lib/nav";
import { fetchDashboardStats } from "./dashboard.service";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName = user?.firstName || "there";

  const { isConnected, stats } = await fetchDashboardStats(userId);

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath="/dashboard" navLinks={navLinks} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
        
        {/* Header Section */}
        <header className="px-10 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              Good morning, {firstName}
            </h1>
            <p className="text-neutral-500 font-medium text-lg">
              Here's your communication overview
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Live</span>
            </div>
            <span className="text-neutral-500 text-sm font-medium">Updated {timeString}</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="px-10 pb-10 flex flex-col gap-6 max-w-7xl">
          
          {!isConnected && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-red-400 font-bold mb-1">Not Connected to Google</h3>
                <p className="text-neutral-400 text-sm">Please connect your account to view your live communication stats.</p>
              </div>
              <Link href="/connect" className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors">
                Connect Now
              </Link>
            </div>
          )}

          {/* Focus Areas Banner */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="mt-1 text-[#10b981]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.6H22l-6 4.8 2.4 7.6-6-4.8-6 4.8 2.4-7.6-6-4.8h7.6z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Your Focus Areas</h2>
                <p className="text-neutral-400 text-sm">No focus areas set. Click <span className="text-[#10b981] font-semibold">Set up</span> to tell Ginnie AI what to prioritize.</p>
              </div>
            </div>
            <button className="px-6 py-2 border border-neutral-700 hover:border-neutral-500 rounded-xl text-white font-medium text-sm transition-colors relative z-10">
              Set up
            </button>
          </div>

          {/* 6 Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* INBOX */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">INBOX</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{stats.inboxTotal}</div>
                <div className="text-xs text-neutral-500">total messages</div>
              </div>
            </div>

            {/* UNREAD */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">UNREAD</span>
                <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{stats.unreadTotal}</div>
                <div className="text-xs text-neutral-500">need attention</div>
              </div>
            </div>

            {/* SENT */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">SENT</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{stats.sentTotal}</div>
                <div className="text-xs text-neutral-500">all time</div>
              </div>
            </div>

            {/* DRAFTS */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">DRAFTS</span>
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{stats.draftsTotal}</div>
                <div className="text-xs text-neutral-500">unsent</div>
              </div>
            </div>

            {/* MEETINGS */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">MEETINGS</span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{stats.meetingsThisWeek}</div>
                <div className="text-xs text-neutral-500">this week</div>
              </div>
            </div>

            {/* TODAY'S USAGE */}
            <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-neutral-800/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-neutral-500 tracking-wider">TODAY'S USAGE</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.requestsToday} <span className="text-xl text-neutral-500 font-normal">/ {stats.dailyLimit === Infinity ? '∞' : stats.dailyLimit}</span>
                </div>
                <div className="text-xs text-neutral-500">AI messages (Plan: {stats.plan.toUpperCase()})</div>
                
                {/* Progress bar */}
                {stats.dailyLimit !== Infinity && (
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${stats.requestsToday >= stats.dailyLimit ? 'bg-red-500' : 'bg-[#10b981]'}`}
                      style={{ width: `${Math.min((stats.requestsToday / stats.dailyLimit) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 6px; }
            .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #555; }
          `}} />
        </main>
      </div>
    </div>
  );
}
