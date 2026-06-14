import { google } from "googleapis";

export function getOAuthClient(redirectUriOverride?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUriOverride || process.env.GOOGLE_REDIRECT_URI!,
  );
}

export function getGoogleAuthUrl(redirectUriOverride?: string) {
  const oauth2Client = getOAuthClient(redirectUriOverride);

  const scopes = [
    // Gmail scopes
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    // Calendar scopes
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    // User info
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",   // gives you refresh token
    prompt: "consent",        // forces refresh token every time
    scope: scopes,
  });
}

export async function exchangeCodeForTokens(code: string, redirectUriOverride?: string) {
  const oauth2Client = getOAuthClient(redirectUriOverride);
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function getAuthenticatedClient(accessToken: string, refreshToken: string) {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({
    access_token:  accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}
