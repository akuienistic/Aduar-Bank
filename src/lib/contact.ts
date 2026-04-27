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

  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

  if (!res.ok || !data?.ok) {
    const msg = data?.error || "Failed to send message";
    throw new Error(msg);
  }
}

