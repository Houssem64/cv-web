// POST /api/contact — sends the ticket form through Resend.
// Env: RESEND_API_KEY (required), CONTACT_TO, CONTACT_FROM (optional).

const TO = process.env.CONTACT_TO || "houssem.sysadmin@gmail.com";
// onboarding@resend.dev works without a verified domain, but only delivers to the Resend account owner's address.
const FROM = process.env.CONTACT_FROM || "Portfolio Ticket <onboarding@resend.dev>";

const LIMITS = { name: 120, email: 200, category: 60, priority: 30, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(500, { error: "Mail service not configured" });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (typeof data.website === "string" && data.website.trim()) return json(200, { ok: true });

  const field = (k: keyof typeof LIMITS) => String(data[k] ?? "").trim().slice(0, LIMITS[k]);
  const name = field("name");
  const email = field("email");
  const category = field("category") || "Other";
  const priority = field("priority") || "P3";
  const message = field("message");

  if (!EMAIL_RE.test(email)) return json(400, { error: "A valid email is required" });
  if (message.length < 10) return json(400, { error: "Message is too short" });

  const subject = `[${priority.split(" ")[0]}] ${category}${name ? ` — ${name}` : ""}`.replace(/[\r\n]+/g, " ");
  const html = `
    <div style="font-family:ui-monospace,Consolas,monospace;font-size:14px;color:#121a16">
      <p style="color:#5b6b63">new ticket from houssem-mehouachi.netlify.app</p>
      <table cellpadding="4">
        <tr><td style="color:#5b6b63">requester</td><td>${escape(name || "—")}</td></tr>
        <tr><td style="color:#5b6b63">email</td><td>${escape(email)}</td></tr>
        <tr><td style="color:#5b6b63">category</td><td>${escape(category)}</td></tr>
        <tr><td style="color:#5b6b63">priority</td><td>${escape(priority)}</td></tr>
      </table>
      <hr style="border:0;border-top:1px dashed #c9d1c8">
      <p style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escape(message)}</p>
    </div>`;
  const text = `requester: ${name || "—"}\nemail: ${email}\ncategory: ${category}\npriority: ${priority}\n\n${message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, html, text }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return json(502, { error: "Could not send right now" });
  }
  const { id } = (await res.json()) as { id?: string };
  return json(200, { ok: true, id });
};

export const config = { path: "/api/contact" };
