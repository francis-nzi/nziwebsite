import { ENV } from "./env";

export type NotificationPayload = { title: string; content: string; replyTo?: string };

/**
 * Emails the site owner. Never throws: the enquiry or booking is already saved
 * in the database, so a mail failure must not make the visitor's form fail.
 */
export async function notifyOwner({ title, content, replyTo }: NotificationPayload): Promise<boolean> {
  if (!ENV.resendApiKey || !ENV.notifyTo) {
    console.warn(`[Notification] Email not configured (RESEND_API_KEY / NOTIFY_TO). Saved to database only: ${title}`);
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${ENV.resendApiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: ENV.notifyFrom,
        to: ENV.notifyTo.split(",").map(s => s.trim()).filter(Boolean),
        subject: title,
        text: content,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`[Notification] Email failed (${response.status}): ${await response.text().catch(() => "")}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Notification] Email failed:", error);
    return false;
  }
}
