import { corsair } from "../../../corsair";

function decodeBase64(data: string) {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function extractBody(payload: any): string {
  if (!payload) return "";

  if (payload.parts) {
    let htmlPart = payload.parts.find((p: any) => p.mimeType === "text/html");
    if (htmlPart?.body?.data) return decodeBase64(htmlPart.body.data);

    for (const part of payload.parts) {
      if (part.parts) {
        const extracted = extractBody(part);
        if (extracted) return extracted;
      }
    }

    let textPart = payload.parts.find((p: any) => p.mimeType === "text/plain");
    if (textPart?.body?.data) {
      return `<div style="white-space: pre-wrap; font-family: sans-serif; padding: 1rem;">${decodeBase64(textPart.body.data)}</div>`;
    }
  } else if (payload.body?.data) {
    const decoded = decodeBase64(payload.body.data);
    return payload.mimeType === "text/html"
      ? decoded
      : `<div style="white-space: pre-wrap; font-family: sans-serif; padding: 1rem;">${decoded}</div>`;
  }
  return "<div style='padding: 1rem; color: #666;'>No content available to display.</div>";
}

export async function fetchInboxData(userId: string, folder: string, messageId?: string, pageToken?: string, q?: string) {
  try {
    const gmailApi = corsair.withTenant(userId).gmail.api;

    // Fetch messages list
    const response = await gmailApi.messages.list({
      userId: "me",
      maxResults: 15,
      labelIds: q ? undefined : [folder],
      ...(q ? { q: folder === "INBOX" ? `in:inbox ${q}` : `in:${folder} ${q}` } : {}),
      ...(pageToken ? { pageToken } : {})
    });

    let emails: any[] = [];
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
          const date = headers?.find((h: any) => h.name === "Date")?.value || "";

          return {
            id: msg.id!,
            snippet: detail.snippet,
            subject,
            from: from.split('<')[0].trim(),
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          };
        })
      );
      emails = messageDetails;
    }

    let selectedEmail: any = null;
    // Fetch specific message if selected
    if (messageId) {
      const detail = await gmailApi.messages.get({
        userId: "me",
        id: messageId,
        format: "full"
      });

      const headers = detail.payload?.headers;
      const subject = headers?.find((h: any) => h.name === "Subject")?.value || "No Subject";
      const from = headers?.find((h: any) => h.name === "From")?.value || "Unknown Sender";
      const date = headers?.find((h: any) => h.name === "Date")?.value || "";
      const bodyHtml = extractBody(detail.payload);

      selectedEmail = {
        id: messageId,
        subject,
        from,
        date: new Date(date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }),
        bodyHtml
      };
    }

    return { isConnected: true, emails, selectedEmail, nextPageToken: response.nextPageToken };
  } catch (error: any) {
    if (error.message && error.message.includes("Account not found for tenant")) {
      return { isConnected: false, emails: [], selectedEmail: null, nextPageToken: undefined };
    }
    console.error("Error fetching inbox data:", error);
    throw error;
  }
}
