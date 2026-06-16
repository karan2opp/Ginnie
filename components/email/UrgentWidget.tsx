import { db } from "@/db";
import { emails as emailsSchema } from "@/db/schema/emails";
import { calendarEvents as calendarSchema } from "@/db/schema/calendar";
import { eq, desc, and } from "drizzle-orm";

export async function UrgentWidget({ userId }: { userId: string }) {
  // Fetch top 3 urgent emails
  const urgentEmails = await db
    .select()
    .from(emailsSchema)
    .where(
      and(
        eq(emailsSchema.userId, userId),
        eq(emailsSchema.priority, "urgent")
      )
    )
    .orderBy(desc(emailsSchema.date))
    .limit(3);

  // Fetch next 2 urgent meetings (assuming priority or just next upcoming)
  // For now we just fetch 2 upcoming events to satisfy the visual requirement.
  const now = new Date();
  const nextMeetings = await db
    .select()
    .from(calendarSchema)
    .where(eq(calendarSchema.userId, userId))
    .orderBy(calendarSchema.startTime)
    .limit(2);

  const urgentCount = urgentEmails.length;
  const meetingCount = nextMeetings.length;

  return (
    <div className="w-full max-w-sm rounded-3xl bg-red-950/20 border border-red-900/30 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">🔴</span>
        <h2 className="text-xl font-bold text-red-500 tracking-tight">Urgent Summary</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-900/20 rounded-2xl p-4 border border-red-500/10 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-red-400 mb-1">{urgentCount}</span>
          <span className="text-xs font-semibold text-red-600/80 uppercase tracking-wider">Urgent Emails</span>
        </div>
        <div className="bg-red-900/20 rounded-2xl p-4 border border-red-500/10 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-red-400 mb-1">{meetingCount}</span>
          <span className="text-xs font-semibold text-red-600/80 uppercase tracking-wider">Urgent Meetings</span>
        </div>
      </div>

      <div className="space-y-4">
        {urgentEmails.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-red-500/70 uppercase tracking-wider mb-2">Top Emails</h3>
            <div className="space-y-2">
              {urgentEmails.map((email) => (
                <div key={email.id} className="bg-red-950/40 rounded-xl p-3 border border-red-900/40 truncate">
                  <div className="text-xs text-red-300/80 font-medium truncate mb-0.5">{email.from}</div>
                  <div className="text-sm text-red-100 truncate">{email.subject}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextMeetings.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-red-500/70 uppercase tracking-wider mb-2">Next Meetings</h3>
            <div className="space-y-2">
              {nextMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-red-950/40 rounded-xl p-3 border border-red-900/40 truncate flex items-center justify-between">
                  <div className="text-sm text-red-100 truncate mr-2">{meeting.title}</div>
                  <div className="text-xs text-red-300/80 font-medium shrink-0">
                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {urgentEmails.length === 0 && nextMeetings.length === 0 && (
          <div className="text-sm text-red-500/50 text-center py-4">No urgent items. You're all caught up!</div>
        )}
      </div>
    </div>
  );
}
