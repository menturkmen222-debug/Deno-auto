// main.ts
import { handleUpload } from "./routes/upload.ts";
import { handleSchedule } from "./routes/schedule.ts";

// Tanlash uchun oddiy monitoring (ixtiyoriy)
async function handleHealth(): Promise<Response> {
  return new Response("✅ OK", { status: 200 });
}

// Asosiy server
Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  try {
    // Salomatlik tekshiruvi
    if (url.pathname === "/") {
      return handleHealth();
    }

    // Video yuklash — POST
    if (url.pathname === "/upload-video" && req.method === "POST") {
      return await handleUpload(req);
    }

    // Scheduler — POST (GitHub Actions tomonidan chaqiriladi)
    if (url.pathname === "/run-schedule" && req.method === "POST") {
      return await handleSchedule();
    }

    // Barcha boshqa so'rovlar — 404
    return new Response("❌ Not Found", { status: 404 });
  } catch (err) {
    console.error("Server xatosi:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
