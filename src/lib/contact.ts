export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const EMAILJS_TO_EMAIL = (import.meta as any).env?.VITE_EMAILJS_TO_EMAIL as string | undefined;

export async function sendContactMessage(payload: ContactFormPayload) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("Email service is not configured. Please set VITE_EMAILJS_* environment variables.");
  }

  const params = {
    to_email: EMAILJS_TO_EMAIL || "",
    from_name: payload.name,
    reply_to: payload.email,
    from_email: payload.email,
    phone: payload.phone || "",
    subject: payload.subject,
    message: payload.message,
    year: String(new Date().getFullYear()),
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, {
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  } catch (e) {
    const err = e as any;
    const msg =
      err?.text ||
      err?.message ||
      (typeof err === "string" ? err : "") ||
      "Failed to send message";
    throw new Error(msg);
  }
}
