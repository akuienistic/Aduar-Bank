export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(payload: ContactFormPayload) {
  const endpoint =
    (import.meta as any).env?.VITE_CONTACT_API_URL ||
    (import.meta as any).env?.VITE_CONTACT_ENDPOINT ||
    "/api/contact";

  const controller = new AbortController();
  const timeoutMs = Number((import.meta as any).env?.VITE_CONTACT_TIMEOUT_MS || 25_000);
  const t = window.setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 25_000);

  const res = await fetch(String(endpoint), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal,
  });

  window.clearTimeout(t);

  const text = await res.text().catch(() => "");
  let data: { ok?: boolean; error?: string } | null = null;

  try {
    data = text ? (JSON.parse(text) as { ok?: boolean; error?: string }) : null;
  } catch {
    data = null;
  }

  if (!res.ok || !data?.ok) {
    const msg =
      data?.error || text || `${res.status} ${res.statusText}` || "Failed to send message";
    throw new Error(msg);
  }
}
