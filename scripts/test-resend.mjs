import fs from "node:fs";
import path from "node:path";

function parseDotEnvVars(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const varsPath = path.join(process.cwd(), ".dev.vars");
const varsText = fs.readFileSync(varsPath, "utf8");
const env = parseDotEnvVars(varsText);

const key = env.RESEND_API_KEY;
const from = env.RESEND_FROM;
if (!key || !from) {
  console.error("Missing RESEND_API_KEY or RESEND_FROM in .dev.vars");
  process.exit(2);
}

const payload = {
  from,
  to: ["ayuenajok@gmail.com"],
  subject: "Resend credentials test (local)",
  html: "<strong>If you got this, RESEND_API_KEY + RESEND_FROM work.</strong>",
};

const r = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const text = await r.text().catch(() => "");
console.log("status", r.status);
console.log(text);

if (!r.ok) process.exit(1);

