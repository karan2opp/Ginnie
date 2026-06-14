import { auth } from "@clerk/nextjs/server";
import { getGoogleClient } from "@/modules/auth/auth.service";
import { google } from "googleapis";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ViewSelector } from "@/components/ViewSelector";
import { getMonthGrid, getWeekGrid, getDateStr, parseGoogleEvents } from "@/lib/calendar-utils";

export default async function CalendarPage({ searchParams }: any) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const view = params?.view || "month";
  const dateParam = params?.date;

  let targetDate = dateParam ? new Date(dateParam) : new Date();

  // Next/Prev dates logic
  let prevDate = new Date(targetDate);
  let nextDate = new Date(targetDate);

  if (view === "day") {
    prevDate.setDate(targetDate.getDate() - 1);
    nextDate.setDate(targetDate.getDate() + 1);
  } else if (view === "week") {
    prevDate.setDate(targetDate.getDate() - 7);
    nextDate.setDate(targetDate.getDate() + 7);
  } else if (view === "month") {
    prevDate.setMonth(targetDate.getMonth() - 1);
    nextDate.setMonth(targetDate.getMonth() + 1);
  } else if (view === "year") {
    prevDate.setFullYear(targetDate.getFullYear() - 1);
    nextDate.setFullYear(targetDate.getFullYear() + 1);
  }

  const prevDateStr = getDateStr(prevDate);
  const nextDateStr = getDateStr(nextDate);
  const todayStr = getDateStr(new Date());

  let isConnected = false;
  let errorMsg: string | null = null;
  let eventsByDate: Record<string, any[]> = {};

  let timeMinStr = "";
  let timeMaxStr = "";
  
  let monthDays: any[] = [];
  let weekDays: any[] = [];

  if (view === "month" || view === "year") {
    monthDays = getMonthGrid(targetDate);
    timeMinStr = monthDays[0].date.toISOString();
    timeMaxStr = monthDays[monthDays.length - 1].date.toISOString();
  } else if (view === "week") {
    weekDays = getWeekGrid(targetDate);
    timeMinStr = weekDays[0].date.toISOString();
    
    let endOfLastDay = new Date(weekDays[6].date);
    endOfLastDay.setDate(endOfLastDay.getDate() + 1);
    timeMaxStr = endOfLastDay.toISOString();
  } else if (view === "day") {
    let startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    let endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
    timeMinStr = startOfDay.toISOString();
    timeMaxStr = endOfDay.toISOString();
  }

  try {
    const googleClient = await getGoogleClient(userId);
    if (googleClient) {
      isConnected = true;
      const calendar = google.calendar({ version: "v3", auth: googleClient });
      
      let queryTimeMin = timeMinStr;
      let queryTimeMax = timeMaxStr;

      if (view === "year") {
         let startOfYear = new Date(targetDate.getFullYear(), 0, 1);
         let endOfYear = new Date(targetDate.getFullYear() + 1, 0, 1);
         queryTimeMin = startOfYear.toISOString();
         queryTimeMax = endOfYear.toISOString();
      }

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: queryTimeMin,
        timeMax: queryTimeMax,
        maxResults: 2500,
        singleEvents: true,
        orderBy: "startTime",
      });

      eventsByDate = parseGoogleEvents(response.data.items || []);
    }
  } catch (error: any) {
    console.error("Failed to fetch calendar:", error);
    errorMsg = error.message || "Unknown error";
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let headerTitle = "";
  if (view === "day") {
     headerTitle = `${monthNames[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;
  } else if (view === "week") {
     headerTitle = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  } else if (view === "month") {
     headerTitle = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  } else {
     headerTitle = `${targetDate.getFullYear()}`;
  }

  const navLinks = [
    { name: "Inbox", href: "/inbox?folder=INBOX", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4", isActive: false },
    { name: "Calendar", href: "/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", isActive: true },
    { name: "Chat with Ginnie", href: "/chat", icon: "M13 10V3L4 14h7v7l9-11h-7z", isActive: false }
  ];

  // Helper for rendering Day/Week Grid columns
  const renderTimeGridColumn = (dateStr: string) => {
    const dayEvents = eventsByDate[dateStr] || [];
    const allDayEvents = dayEvents.filter(e => e.isAllDay);
    const timedEvents = dayEvents.filter(e => !e.isAllDay);

    return (
      <div className="flex-1 min-w-0 border-r border-neutral-800/40 flex flex-col relative" key={dateStr}>
        <div className="border-b border-neutral-800/60 p-1 min-h-[40px] bg-neutral-900/30 flex flex-col gap-1 shrink-0 z-20">
          {allDayEvents.map(e => (
            <a key={e.id} href={e.htmlLink} target="_blank" rel="noreferrer" className="block px-1.5 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300 truncate font-semibold border border-indigo-500/30 hover:bg-indigo-500/30">
              {e.summary}
            </a>
          ))}
        </div>
        
        <div className="relative h-[1440px] w-full shrink-0">
          {Array.from({length: 24}).map((_, i) => (
            <div key={i} className="absolute w-full border-b border-neutral-800/20" style={{top: `${i * 60}px`, height: '60px'}} />
          ))}

          {timedEvents.map(e => (
            <a 
              key={e.id} 
              href={e.htmlLink} 
              target="_blank" 
              rel="noreferrer"
              className="absolute left-1 right-1 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-[10px] leading-tight rounded border border-neutral-700 p-1 overflow-hidden shadow-sm z-10 transition-colors"
              style={{
                top: `${(e.startHour + e.startMin/60) * 60}px`,
                height: `${Math.max(e.durationHours * 60, 20)}px`
              }}
            >
              <span className="font-semibold block truncate">{e.summary}</span>
              <span className="text-neutral-400 block truncate">{e.timeString}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <Sidebar currentPath={`/calendar?view=${view}`} navLinks={navLinks} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-neutral-800/60 bg-neutral-950 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href={`/calendar?view=${view}&date=${todayStr}`} className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm">
                Today
              </Link>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <Link href={`/calendar?view=${view}&date=${prevDateStr}`} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </Link>
                <div className="w-px h-5 bg-neutral-800"></div>
                <Link href={`/calendar?view=${view}&date=${nextDateStr}`} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white w-56 truncate">
              {headerTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ViewSelector />
            <Link href="https://calendar.google.com/calendar/r/eventedit" target="_blank" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Event
            </Link>
          </div>
        </header>

        {/* Calendar Body */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
          {errorMsg ? (
            <div className="m-10 bg-neutral-900/50 border border-red-500/20 p-8 rounded-3xl max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
              <p className="text-neutral-400 font-mono text-sm">{errorMsg}</p>
            </div>
          ) : !isConnected ? (
            <div className="m-auto text-center py-20 max-w-sm">
              <h2 className="text-2xl font-bold text-white mb-2">Not Connected</h2>
              <p className="text-neutral-500 mb-8">Please connect your Google account to view your calendar.</p>
              <Link href="/connect" className="inline-flex bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                Connect Google
              </Link>
            </div>
          ) : (
            <>
              {/* MONTH VIEW */}
              {view === "month" && (
                <div className="flex-1 flex flex-col p-8">
                  <div className="flex-1 flex flex-col min-h-0 bg-neutral-900/30 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-7 border-b border-neutral-800/60 bg-neutral-900/80 shrink-0">
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                        <div key={d} className="py-3 text-center text-xs font-bold tracking-widest text-neutral-500">{d}</div>
                      ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7 grid-rows-6">
                      {monthDays.map((day, idx) => {
                        const dayEvents = eventsByDate[day.dateStr] || [];
                        return (
                          <div 
                            key={day.dateStr} 
                            className={`min-h-[80px] p-2 flex flex-col gap-1 border-r border-b border-neutral-800/40 ${!day.isCurrentMonth ? 'bg-neutral-950/50' : 'bg-transparent'} ${idx % 7 === 6 ? 'border-r-0' : ''} ${idx >= 35 ? 'border-b-0' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${day.isToday ? 'bg-indigo-600 text-white shadow-md' : day.isCurrentMonth ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                {day.date.getDate()}
                              </span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                              {dayEvents.map((event) => (
                                <a key={event.id} href={event.htmlLink} target="_blank" rel="noreferrer" className={`block px-2 py-1 text-xs rounded-md truncate transition-colors border ${event.isAllDay ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30' : 'bg-neutral-800/50 text-neutral-300 border-transparent hover:bg-neutral-800'}`}>
                                  {!event.isAllDay && <span className="font-semibold text-neutral-400 mr-1">{event.timeString}</span>}
                                  {event.summary}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* WEEK VIEW */}
              {view === "week" && (
                <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
                  <div className="flex border-b border-neutral-800/60 bg-neutral-900/50 shrink-0 pl-16">
                    {weekDays.map(day => (
                      <div key={day.dateStr} className="flex-1 py-3 text-center border-r border-neutral-800/40">
                        <div className="text-xs font-bold tracking-widest text-neutral-500 mb-1">{['SUN','MON','TUE','WED','THU','FRI','SAT'][day.date.getDay()]}</div>
                        <div className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-lg font-medium ${day.isToday ? 'bg-indigo-600 text-white' : 'text-neutral-200'}`}>
                          {day.date.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto flex relative custom-scrollbar">
                    {/* Time labels */}
                    <div className="w-16 shrink-0 relative bg-neutral-950 border-r border-neutral-800/40 z-10">
                      <div className="h-[40px] border-b border-neutral-800/60 bg-neutral-900/30" />
                      <div className="relative h-[1440px]">
                        {Array.from({length: 24}).map((_, i) => (
                          <div key={i} className="absolute w-full text-right pr-2 text-xs text-neutral-500 -mt-2" style={{top: `${i * 60}px`}}>
                            {i === 0 ? '' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Grid Columns */}
                    <div className="flex-1 flex">
                      {weekDays.map(day => renderTimeGridColumn(day.dateStr))}
                    </div>
                  </div>
                </div>
              )}

              {/* DAY VIEW */}
              {view === "day" && (
                <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
                  <div className="flex border-b border-neutral-800/60 bg-neutral-900/50 shrink-0 pl-16">
                    <div className="flex-1 py-3 text-center">
                      <div className="text-xs font-bold tracking-widest text-neutral-500 mb-1">{['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'][targetDate.getDay()]}</div>
                      <div className="inline-flex w-10 h-10 items-center justify-center rounded-full text-xl font-medium bg-indigo-600 text-white shadow-lg">
                        {targetDate.getDate()}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto flex relative custom-scrollbar">
                    {/* Time labels */}
                    <div className="w-16 shrink-0 relative bg-neutral-950 border-r border-neutral-800/40 z-10">
                      <div className="h-[40px] border-b border-neutral-800/60 bg-neutral-900/30" />
                      <div className="relative h-[1440px]">
                        {Array.from({length: 24}).map((_, i) => (
                          <div key={i} className="absolute w-full text-right pr-2 text-xs text-neutral-500 -mt-2" style={{top: `${i * 60}px`}}>
                            {i === 0 ? '' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Grid Column */}
                    <div className="flex-1 flex max-w-4xl mx-auto border-x border-neutral-800/40">
                      {renderTimeGridColumn(getDateStr(targetDate))}
                    </div>
                  </div>
                </div>
              )}

              {/* YEAR VIEW */}
              {view === "year" && (
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({length: 12}).map((_, mIndex) => {
                      const mDays = getMonthGrid(new Date(targetDate.getFullYear(), mIndex, 1));
                      return (
                        <div key={mIndex} className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4">
                          <h3 className="font-bold text-neutral-200 mb-3 ml-1">{monthNames[mIndex]}</h3>
                          <div className="grid grid-cols-7 gap-1">
                            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-center text-[10px] text-neutral-600 font-bold mb-1">{d}</div>)}
                            {mDays.map(d => (
                              <div key={d.dateStr} className={`aspect-square flex items-center justify-center text-xs rounded-full ${!d.isCurrentMonth ? 'text-transparent' : d.isToday ? 'bg-indigo-600 text-white' : eventsByDate[d.dateStr] ? 'bg-neutral-800 text-indigo-300 font-bold border border-indigo-500/30' : 'text-neutral-400 hover:bg-neutral-800 transition-colors'}`}>
                                {d.isCurrentMonth ? d.date.getDate() : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 6px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #555; }
      `}} />
    </div>
  );
}
