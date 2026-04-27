export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(payload: ContactFormPayload) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

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
