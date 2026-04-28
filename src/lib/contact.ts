export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

import emailjs from "@emailjs/browser";

function envTrim(key: string) {
  const v = ((import.meta as any).env?.[key] as string | undefined) ?? "";
  return v.trim();
}

export async function sendContactMessage(payload: ContactFormPayload) {
  const serviceId = envTrim("VITE_EMAILJS_SERVICE_ID");
  const templateId = envTrim("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = envTrim("VITE_EMAILJS_PUBLIC_KEY");
  const toEmail = envTrim("VITE_EMAILJS_TO_EMAIL");

  const missing = [
    !serviceId ? "VITE_EMAILJS_SERVICE_ID" : null,
    !templateId ? "VITE_EMAILJS_TEMPLATE_ID" : null,
    !publicKey ? "VITE_EMAILJS_PUBLIC_KEY" : null,
  ].filter(Boolean) as string[];

  if (missing.length) {
    throw new Error(`Email service is not configured (missing: ${missing.join(", ")}).`);
  }

  const params = {
    to_email: toEmail,
    from_name: payload.name,
    reply_to: payload.email,
    from_email: payload.email,
    phone: payload.phone || "",
    subject: payload.subject,
    message: payload.message,
    year: String(new Date().getFullYear()),
  };

  try {
    await emailjs.send(serviceId, templateId, params, {
      publicKey,
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
