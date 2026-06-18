import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema/emails";
import { eq, desc } from "drizzle-orm";
import { corsair } from "@/corsair";
import { scoreEmailPriority } from "@/lib/llm";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";
    const folder = searchParams.get("folder") || "INBOX";
    const pageToken = searchParams.get("pageToken") || undefined;

    // If fetching more emails for any folder via pageToken, or if it's not INBOX
    if (pageToken || folder !== "INBOX") {
      const gmailApi = corsair.withTenant(userId).gmail.api;
      
      const response = await gmailApi.messages.list({
        userId: "me",
        maxResults: 15,
        labelIds: [folder],
        ...(pageToken ? { pageToken } : {})
      });

      let newEmails: any[] = [];
      
      if (response.messages) {
        const messageDetails = await Promise.all(
          response.messages.map(async (msg: any) => {
            const detail = await gmailApi.messages.get({
              userId: "me",
              id: msg.id!,
              format: "full"
            });

            const headers = detail.payload?.headers;
            const subject = headers?.find((h: any) => h.name === "Subject")?.value || "No Subject";
            const from = headers?.find((h: any) => h.name === "From")?.value || "Unknown Sender";
            const date = headers?.find((h: any) => h.name === "Date")?.value || new Date().toISOString();

            const snippet = detail.snippet || "";
            const sender = from.split('<')[0].trim();
            
            // Only score priority if it's INBOX
            const priority = folder === "INBOX" ? await scoreEmailPriority(subject, snippet, sender) : "normal";

            return {
              id: msg.id!,
              userId,
              snippet,
              subject,
              from: sender,
              date: new Date(date),
              priority,
            };
          })
        );
        newEmails = messageDetails;

        // If it's INBOX, cache them in DB
        if (folder === "INBOX" && newEmails.length > 0) {
          await db.insert(emails).values(newEmails).onConflictDoNothing();
        }
      }

      // Filter locally for urgent/primary if needed
      let filteredEmails = newEmails;
      if (folder === "INBOX" && filter === "urgent") {
        filteredEmails = newEmails.filter(e => e.priority === "urgent");
      } else if (folder === "INBOX" && filter === "primary") {
        filteredEmails = newEmails.filter(e => e.priority === "primary");
      }

      // Format date for the frontend for non-INBOX, or keep as Date object for consistency
      return NextResponse.json({ 
        emails: filteredEmails, 
        nextPageToken: response.nextPageToken 
      });
    }

    // Default INBOX initial load: Query emails directly from DB
    let allEmails = await db.select().from(emails).where(eq(emails.userId, userId)).orderBy(desc(emails.date));
    let initialNextPageToken: string | undefined = undefined;

    // First time sync if DB is empty
    if (allEmails.length === 0) {
      try {
        const gmailApi = corsair.withTenant(userId).gmail.api;
        const response = await gmailApi.messages.list({
          userId: "me",
          maxResults: 15,
          labelIds: ["INBOX"]
        });
        
        initialNextPageToken = response.nextPageToken || undefined;

        if (response.messages) {
          const messageDetails = await Promise.all(
            response.messages.map(async (msg: any) => {
              const detail = await gmailApi.messages.get({
                userId: "me",
                id: msg.id!,
                format: "full"
              });

              const headers = detail.payload?.headers;
              const subject = headers?.find((h: any) => h.name === "Subject")?.value || "No Subject";
              const from = headers?.find((h: any) => h.name === "From")?.value || "Unknown Sender";
              const date = headers?.find((h: any) => h.name === "Date")?.value || new Date().toISOString();

              const snippet = detail.snippet || "";
              const sender = from.split('<')[0].trim();
              
              const priority = await scoreEmailPriority(subject, snippet, sender);

              return {
                id: msg.id!,
                userId,
                snippet,
                subject,
                from: sender,
                date: new Date(date),
                priority,
              };
            })
          );

          if (messageDetails.length > 0) {
            await db.insert(emails).values(messageDetails).onConflictDoNothing();
            // Refetch after sync
            allEmails = await db.select().from(emails).where(eq(emails.userId, userId)).orderBy(desc(emails.date));
          }
        }
      } catch (syncError) {
        console.error("Failed to sync emails on first load:", syncError);
      }
    }
    
    let filteredEmails = allEmails;
    if (filter === "urgent") {
      filteredEmails = allEmails.filter(e => e.priority === "urgent");
    } else if (filter === "primary") {
      filteredEmails = allEmails.filter(e => e.priority === "primary");
    }

    return NextResponse.json({ 
      emails: filteredEmails,
      nextPageToken: initialNextPageToken 
    });
  } catch (error) {
    console.error("[EMAILS_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

