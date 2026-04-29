import path from "path";
import { pathToFileURL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

function localContactApiPlugin() {
  return {
    name: "local-contact-api",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.method !== "POST") return next();
        const url = req.url?.split("?")[0] ?? "";
        if (url !== "/api/contact") return next();

        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch {
            req.body = {};
          }

          try {
            const handler = await import(
              pathToFileURL(path.resolve(process.cwd(), "api/contact.ts")).href
            );
            const jsonRes = res as unknown as {
              status?: (code: number) => any;
              json?: (body: unknown) => void;
            };
            jsonRes.status = (code: number) => {
              res.statusCode = code;
              return jsonRes;
            };
            jsonRes.json = (body: unknown) => {
              res.setHeader("content-type", "application/json; charset=utf-8");
              res.end(JSON.stringify(body));
            };
            await handler.default(req, jsonRes as any);
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            );
          }
        });
      });
    },
  };
}

export default defineConfig({
  appType: "spa",
  plugins: [cloudflare(), localContactApiPlugin(), react(), tsconfigPaths(), tailwindcss()],
});
