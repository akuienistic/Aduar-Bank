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

type BrandEmailTheme = {
  brandName: string;
  logoUrl?: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  fontFamily: string;
  headingFamily: string;
  websiteUrl?: string;
};

function normalizeHexColor(input: string | undefined, fallback: string) {
  const v = (input ?? "").trim();
  if (!v) return fallback;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v}`;
  return fallback;
}

function getWebsiteUrl() {
  const explicit = (process.env.WEBSITE_URL || process.env.SITE_URL || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelUrl = (process.env.VERCEL_URL || "").trim();
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/+$/, "");

  return undefined;
}

function getBrandTheme(): BrandEmailTheme {
  const brandName = (process.env.BRAND_NAME || "Aduar Bank").trim() || "Aduar Bank";
  const fontFamily =
    (process.env.BRAND_FONT_FAMILY || 'Montserrat, system-ui, -apple-system, "Segoe UI", Arial, sans-serif').trim();
  const headingFamily =
    (process.env.BRAND_HEADING_FONT_FAMILY || 'Outfit, system-ui, -apple-system, "Segoe UI", Arial, sans-serif').trim();

  // Defaults match your current UI palette.
  const primary = normalizeHexColor(process.env.BRAND_PRIMARY, "#1f3a6d");
  const accent = normalizeHexColor(process.env.BRAND_ACCENT, "#cc6a2e");
  const background = normalizeHexColor(process.env.BRAND_BACKGROUND, "#fbf7ee");
  const surface = normalizeHexColor(process.env.BRAND_SURFACE, "#ffffff");
  const text = normalizeHexColor(process.env.BRAND_TEXT, "#13233a");
  const muted = normalizeHexColor(process.env.BRAND_MUTED, "#667085");

  const websiteUrl = getWebsiteUrl();
  const logoUrlRaw = (process.env.BRAND_LOGO_URL || "").trim();
  const logoUrl = logoUrlRaw ? logoUrlRaw : undefined;

  return {
    brandName,
    logoUrl,
    primary,
    accent,
    background,
    surface,
    text,
    muted,
    fontFamily,
    headingFamily,
    websiteUrl,
  };
}

function inlineLogoFallbackDataUri(theme: BrandEmailTheme) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="44" viewBox="0 0 180 44">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${theme.accent}"/><stop offset="1" stop-color="${theme.primary}"/>` +
    `</linearGradient></defs>` +
    `<circle cx="22" cy="22" r="20" fill="url(#g)"/>` +
    `<text x="22" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="white">AB</text>` +
    `<text x="54" y="28" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="${theme.primary}">${escapeHtml(theme.brandName)}</text>` +
    `</svg>`;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function renderContactEmail(payload: ContactPayload, theme: BrandEmailTheme) {
  const safe = {
    name: escapeHtml(payload.name),
    email: escapeHtml(payload.email),
    phone: payload.phone ? escapeHtml(payload.phone) : "",
    subject: escapeHtml(payload.subject),
    message: escapeHtml(payload.message).replace(/\n/g, "<br/>"),
  };

  const preheader = `New message from ${payload.name}: ${payload.subject}`;
  const logoSrc = theme.logoUrl || inlineLogoFallbackDataUri(theme);
  const brandTitle = escapeHtml(theme.brandName);
  const website = theme.websiteUrl ? escapeHtml(theme.websiteUrl) : "";

  const headingFont = theme.headingFamily || theme.fontFamily;
  const bodyFont = theme.fontFamily;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>New contact message — ${brandTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:${theme.background};font-family:${bodyFont};color:${theme.text};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${theme.background};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 8px 16px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <img src="${logoSrc}" width="180" height="44" alt="${brandTitle}" style="display:block;border:0;outline:none;text-decoration:none;" />
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      ${
                        website
                          ? `<a href="${website}" style="font-size:12px;color:${theme.muted};text-decoration:none;">${website}</a>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background:${theme.surface};border:1px solid rgba(31,58,109,0.12);border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);">
                <div style="background:${theme.primary};padding:18px 20px;">
                  <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);text-align:center;">
                    Website contact
                  </div>
                  <div style="margin-top:6px;font-family:${headingFont};font-size:22px;line-height:1.25;font-weight:800;color:#ffffff;text-align:center;">
                    New Message Received
                  </div>
                </div>

                <div style="padding:18px 20px 22px 20px;">
                  <div style="font-size:13px;color:${theme.muted};margin-bottom:12px;">
                    A visitor submitted the contact form on your website.
                  </div>

                  <div style="padding:12px 14px;border-radius:14px;border:1px solid rgba(31,58,109,0.12);">
                    <div style="font-size:11px;color:${theme.muted};text-transform:uppercase;letter-spacing:0.12em;">Subject</div>
                    <div style="margin-top:6px;font-family:${headingFont};font-size:16px;font-weight:800;color:${theme.text};">
                      ${safe.subject}
                    </div>
                  </div>

                  <div style="height:12px;"></div>

                  <div style="padding:14px;border-radius:14px;border:1px solid rgba(31,58,109,0.12);">
                    <div style="font-size:11px;color:${theme.muted};text-transform:uppercase;letter-spacing:0.12em;">Message</div>
                    <div style="margin-top:8px;font-size:15px;line-height:1.6;color:${theme.text};">
                      ${safe.message}
                    </div>
                  </div>

                  <div style="height:12px;"></div>

                  <div style="padding:14px;border-radius:14px;border:1px solid rgba(31,58,109,0.12);">
                    <div style="font-size:11px;color:${theme.muted};text-transform:uppercase;letter-spacing:0.12em;">Sender</div>
                    <div style="margin-top:8px;font-size:14px;line-height:1.7;color:${theme.text};">
                      <div><strong>Name:</strong> ${safe.name}</div>
                      <div><strong>Email:</strong> <a href="mailto:${safe.email}" style="color:${theme.primary};text-decoration:none;">${safe.email}</a></div>
                      ${safe.phone ? `<div><strong>Phone:</strong> ${safe.phone}</div>` : ""}
                    </div>
                  </div>

                  <div style="margin-top:14px;padding:12px 14px;border-radius:14px;background:rgba(204,106,46,0.12);border:1px solid rgba(204,106,46,0.22);">
                    <div style="font-size:13px;color:${theme.text};">
                      Reply to this email to respond, or reply directly to
                      <a href="mailto:${safe.email}" style="color:${theme.accent};font-weight:800;text-decoration:none;">${safe.email}</a>.
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 8px 6px 8px;font-size:12px;color:${theme.muted};text-align:center;">
                © ${new Date().getFullYear()} ${brandTitle}. This email was generated by the website contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderContactText(payload: ContactPayload, theme: BrandEmailTheme) {
  const parts = [
    `${theme.brandName} — Contact form submission`,
    "",
    `Subject: ${payload.subject}`,
    `From: ${payload.name} <${payload.email}>`,
    payload.phone ? `Phone: ${payload.phone}` : "",
    "",
    payload.message,
  ].filter(Boolean);
  return parts.join("\n");
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

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
      method: req.method ?? null,
      hint: "Send a POST request to /api/contact",
    });
  }

  await loadDotenv();

  try {
    // SMTP-only. (Do not use Resend/MailChannels/etc.)
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT || "465");
    const SMTP_USER = process.env.SMTP_USER || process.env.SMTP_USERNAME;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const theme = getBrandTheme();
    const MAIL_FROM = process.env.MAIL_FROM || (SMTP_USER ? `${theme.brandName} <${SMTP_USER}>` : undefined);
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

    const html = renderContactEmail(payload, theme);
    const text = renderContactText(payload, theme);

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
      subject: `${payload.subject}`.slice(0, 180),
      html,
      text,
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
