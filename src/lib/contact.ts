export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

import emailjs from "@emailjs/browser";

function envTrim(key: string) {
  const v = ((import.meta.env as any)?.[key] as string | undefined) ?? "";
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
    !toEmail ? "VITE_EMAILJS_TO_EMAIL" : null,
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
    const msg = err?.text || err?.message || (typeof err === "string" ? err : "") || "Failed to send message";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pkShort = publicKey ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}` : "";

    const msgLower = String(msg).toLowerCase();
    const hint =
      msgLower.includes("service id not found") || msgLower.includes("service_id not found")
        ? [
            "EmailJS could not find that Service ID.",
            "Fix: open EmailJS Dashboard → Email Services → copy the exact Service ID, then update VITE_EMAILJS_SERVICE_ID.",
            "Also ensure the Service + Template belong to the same EmailJS account as your Public Key.",
          ].join("\n")
        : "";

    throw new Error(
      `${msg}${hint ? `\n\n${hint}` : ""}\n\nDebug:\n- origin: ${origin}\n- serviceId: ${serviceId}\n- templateId: ${templateId}\n- publicKey: ${pkShort}`,
    );
  }
}
