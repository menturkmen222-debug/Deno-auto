// routes/upload.ts
import { uploadToCloudinary } from "../services/cloudinary.ts";
import { enqueueVideo } from "../db/queue.ts";

export async function handleUpload(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await req.formData();
  const videoFile = formData.get("video") as File;
  const prompt = formData.get("prompt")?.toString() || "";
  const channel = formData.get("channel")?.toString() as any;

  if (!videoFile || !prompt || !["youtube", "tiktok", "instagram", "facebook"].includes(channel)) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const videoUrl = await uploadToCloudinary(videoFile);
    const id = await enqueueVideo({ videoUrl, prompt, channel });
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
