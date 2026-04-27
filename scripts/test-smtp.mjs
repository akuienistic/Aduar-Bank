import fs from "node:fs";
import path from "node:path";

function parseEnvFile(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[m[1]] = v;
  }
  return env;
}

const candidates = [".env", ".dev.vars", "env"].map((p) => path.join(process.cwd(), p));
const envPath = candidates.find((p) => fs.existsSync(p));
if (!envPath) {
  console.error("No env file found. Create one of: .env, .dev.vars, env");
  process.exit(2);
}

const envFromFile = parseEnvFile(fs.readFileSync(envPath, "utf8"));

// set process.env for the serverless handler
for (const [k, v] of Object.entries(envFromFile)) {
  if (v) process.env[k] = v;
}

const { default: handler } = await import("../api/contact.js").catch(async () => import("../api/contact.ts"));

const req = {
  method: "POST",
  body: {
    name: "SMTP Test",
    email: "test.sender@example.com",
    phone: "+211 920 000 000",
    subject: "SMTP contact form test",
    message: "If you received this, SMTP sending works.",
  },
};

const res = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log("status", this.statusCode ?? 200);
    console.log(JSON.stringify(data));
  },
};

await handler(req, res);

