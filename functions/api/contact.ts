import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
}

async function loadDotenv() {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") return;

  try {
    const dotenv = await import("dotenv");
    dotenv.config();
  } catch {
    // ignore missing dotenv in environments where it's not available
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(s: string) {
  return s.replace(/\r/g, "").trim();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailTemplate({
  name,
  email,
  phone,
  subject,
  message,
}: Required<Pick<ContactPayload, "name" | "email" | "subject" | "message">> & {
  phone?: string;
}) {
  // Site palette (approx) based on `src/styles.css`
  const trust = "#1f3a6d";
  const warm = "#cc6a2e";
  const sand = "#fbf7ee";
  const ink = "#13233a";
  const muted = "#667085";

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: phone ? escapeHtml(phone) : "",
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, "<br/>"),
  };

  const logoSvgDataUri =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${warm}"/>
            <stop offset="1" stop-color="${trust}"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#g)"/>
        <text x="20" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="white">AB</text>
        <text x="48" y="24" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="${trust}">Aduar Bank</text>
      </svg>`,
    );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New contact message — Aduar Bank</title>
  </head>
  <body style="margin:0;padding:0;background:${sand};font-family:Arial,Helvetica,sans-serif;color:${ink};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      New message from ${safe.name}: ${safe.subject}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${sand};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 8px 18px 8px;">
                <img src="${logoSvgDataUri}" width="160" height="40" alt="Aduar Bank" style="display:block;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid rgba(31,58,109,0.12);border-radius:16px;overflow:hidden;">
                <div style="background:${trust};padding:18px 20px;">
                  <div style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.82);">
                    Contact form
                  </div>
                  <div style="margin-top:6px;font-size:20px;line-height:1.25;font-weight:700;color:#ffffff;">
                    New message received
                  </div>
                </div>
                <div style="padding:18px 20px 8px 20px;">
                  <div style="font-size:14px;color:${muted};margin-bottom:10px;">
                    A visitor submitted the contact form on your website.
                  </div>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px 12px;border:1px solid rgba(31,58,109,0.12);border-radius:12px;">
                        <div style="font-size:12px;color:${muted};text-transform:uppercase;letter-spacing:0.08em;">Subject</div>
                        <div style="margin-top:6px;font-size:16px;font-weight:700;color:${ink};">${safe.subject}</div>
                      </td>
                    </tr>
                  </table>
                  <div style="height:14px;"></div>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px;border:1px solid rgba(31,58,109,0.12);border-radius:12px;">
                        <div style="font-size:12px;color:${muted};text-transform:uppercase;letter-spacing:0.08em;">Message</div>
                        <div style="margin-top:8px;font-size:15px;line-height:1.55;color:${ink};">${safe.message}</div>
                      </td>
                    </tr>
                  </table>
                  <div style="height:14px;"></div>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:12px;border:1px solid rgba(31,58,109,0.12);border-radius:12px;">
                        <div style="font-size:12px;color:${muted};text-transform:uppercase;letter-spacing:0.08em;">Sender</div>
                        <div style="margin-top:8px;font-size:14px;line-height:1.6;color:${ink};">
                          <div><strong>Name:</strong> ${safe.name}</div>
                          <div><strong>Email:</strong> <a href="mailto:${safe.email}" style="color:${trust};text-decoration:none;">${safe.email}</a></div>
                          ${safe.phone ? `<div><strong>Phone:</strong> ${safe.phone}</div>` : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style="padding:0 20px 18px 20px;">
                  <div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:rgba(204,106,46,0.10);border:1px solid rgba(204,106,46,0.20);">
                    <div style="font-size:13px;color:${ink};">
                      Reply directly to the sender at
                      <a href="mailto:${safe.email}" style="color:${warm};font-weight:700;text-decoration:none;">${safe.email}</a>.
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 8px 0 8px;font-size:12px;color:${muted};text-align:center;">
                © ${new Date().getFullYear()} Aduar Bank. This email was generated by the website contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function onRequest(context: {
  request: Request;
  env: Record<string, string | undefined>;
}) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (context.request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  return onRequestPost(context);
}

export async function onRequestPost(context: {
  request: Request;
  env: Record<string, string | undefined>;
}) {
  await loadDotenv();

  try {
    const smtpHost = context.env.SMTP_HOST;
    const smtpPort = context.env.SMTP_PORT;
    const smtpUser = context.env.SMTP_USER;
    const smtpPass = context.env.SMTP_PASS;
    const mailFrom = context.env.MAIL_FROM;
    const mailTo = context.env.MAIL_TO;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !mailFrom || !mailTo) {
      return json(
        {
          ok: false,
          error:
            "Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, and MAIL_TO in your deployment environment.",
        },
        { status: 500 },
      );
    }

    const raw = (await context.request.json()) as Partial<ContactPayload>;
    const payload: ContactPayload = {
      name: sanitizeText(String(raw.name ?? "")),
      email: sanitizeText(String(raw.email ?? "")),
      phone: raw.phone ? sanitizeText(String(raw.phone)) : "",
      subject: sanitizeText(String(raw.subject ?? "")),
      message: sanitizeText(String(raw.message ?? "")),
    };

    if (payload.name.length < 2) return json({ ok: false, error: "Invalid name" }, { status: 400 });
    if (!isValidEmail(payload.email))
      return json({ ok: false, error: "Invalid email" }, { status: 400 });
    if (payload.subject.length < 3)
      return json({ ok: false, error: "Invalid subject" }, { status: 400 });
    if (payload.message.length < 10)
      return json({ ok: false, error: "Invalid message" }, { status: 400 });

    const html = emailTemplate({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      subject: payload.subject,
      message: payload.message,
    });

    const emailSubject = `Contact: ${payload.subject}`;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const sendResult = await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: emailSubject,
      html,
    });

    if (!sendResult.accepted.length) {
      return json(
        { ok: false, error: "Failed to deliver email. Recipient not accepted." },
        { status: 502 },
      );
    }

    return json({ ok: true, messageId: sendResult.messageId });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
