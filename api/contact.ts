import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

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
}: Required<Pick<ContactPayload, "name" | "email" | "subject" | "message">> & { phone?: string }) {
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
                  <div style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.82);text-align:center;">
                    Contact form
                  </div>
                  <div style="margin-top:6px;font-size:20px;line-height:1.25;font-weight:700;color:#ffffff;text-align:center;">
                    New Message Received
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
              <td style="padding:16px 8px 6px 8px;font-size:12px;color:${muted};text-align:center;">
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

async function loadDotenv() {
  try {
    const dotenv = await import("dotenv");
    dotenv.config();
  } catch {
    // ignore missing dotenv in production or non-node environments
  }
}

function setCorsHeaders(res: VercelResponse) {
  // In production this is a Vercel `ServerResponse` which supports `setHeader`.
  // In local scripts/tests we may pass a minimal mock response object.
  if (typeof (res as any).setHeader !== "function") return;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  await loadDotenv();

  try {
    // SMTP-only. (Do not use Resend/MailChannels/etc.)
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT || "465");
    const SMTP_USER = process.env.SMTP_USER || process.env.SMTP_USERNAME;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const MAIL_FROM = process.env.MAIL_FROM || (SMTP_USER ? `Aduar Bank <${SMTP_USER}>` : undefined);
    const MAIL_TO = process.env.MAIL_TO || process.env.EMAIL_TO;
    const SMTP_SECURE =
      typeof process.env.SMTP_SECURE === "string"
        ? ["1", "true", "yes", "on"].includes(process.env.SMTP_SECURE.toLowerCase())
        : SMTP_PORT === 465;

    if (!SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing SMTP config. Set SMTP_USER (or SMTP_USERNAME) and SMTP_PASS (or SMTP_PASSWORD) in production environment variables.",
      });
    }

    if (!MAIL_FROM) {
      return res.status(500).json({
        ok: false,
        error: "Missing MAIL_FROM. Set MAIL_FROM (e.g. \"Aduar Bank <you@domain.com>\").",
      });
    }

    if (!MAIL_TO) {
      return res.status(500).json({
        ok: false,
        error: "Missing MAIL_TO. Set MAIL_TO to the inbox that should receive contact submissions.",
      });
    }

    const raw = (req.body ?? {}) as Partial<ContactPayload>;
    const payload: ContactPayload = {
      name: sanitizeText(String(raw.name ?? "")),
      email: sanitizeText(String(raw.email ?? "")),
      phone: raw.phone ? sanitizeText(String(raw.phone)) : "",
      subject: sanitizeText(String(raw.subject ?? "")),
      message: sanitizeText(String(raw.message ?? "")),
    };

    if (payload.name.length < 2) return res.status(400).json({ ok: false, error: "Invalid name" });
    if (!isValidEmail(payload.email))
      return res.status(400).json({ ok: false, error: "Invalid email" });
    if (payload.subject.length < 3)
      return res.status(400).json({ ok: false, error: "Invalid subject" });
    if (payload.message.length < 10)
      return res.status(400).json({ ok: false, error: "Invalid message" });

    const html = emailTemplate({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      subject: payload.subject,
      message: payload.message,
    });

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // Serverless-friendly timeouts (avoid hanging lambdas)
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
      // Common for 587 STARTTLS setups
      requireTLS: !SMTP_SECURE && SMTP_PORT === 587,
    });

    // Verify connection/auth first so failures are clearer (and faster) in production.
    try {
      await transporter.verify();
    } catch (err) {
      const e = err as any;
      return res.status(502).json({
        ok: false,
        error: "SMTP verify failed",
        details: {
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_SECURE,
          code: e?.code,
          command: e?.command,
          response: e?.response,
          message: e?.message,
        },
      });
    }

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `${payload.subject}`,
      html,
      replyTo: payload.email,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    const err = e as any;
    return res.status(502).json({
      ok: false,
      error: "Email send failed",
      details: {
        code: err?.code,
        command: err?.command,
        response: err?.response,
        message: err?.message ?? (e instanceof Error ? e.message : String(e)),
      },
    });
  }
}
