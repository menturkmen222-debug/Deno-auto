// main.ts
import { handleUpload } from "./routes/upload.ts";
import { handleSchedule } from "./routes/schedule.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/upload-video" && req.method === "POST") {
    return handleUpload(req);
  }

  if (url.pathname === "/queue-status") {
  return handleStatus();
}
  
  if (url.pathname === "/run-schedule" && req.method === "POST") {
    // GitHub Actionsdan kelganligini tekshirish (ixtiyoriy)
    return handleSchedule();
  }

  return new Response("Not found", { status: 404 });
});
