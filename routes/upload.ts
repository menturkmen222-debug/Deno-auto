import { uploadToCloudinary } from "../services/cloudinary.ts";
import { enqueueVideo } from "../db/queue.ts";

export async function handleUpload(req: Request): Promise<Response> {
  const formData = await req.formData();
  const video = formData.get("video") as File;
  const prompt = formData.get("prompt")?.toString() || "";
  const channelIndex = parseInt(formData.get("channelIndex")?.toString() || "0");

  if (!video || !prompt || channelIndex < 0 || channelIndex > 4) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const url = await uploadToCloudinary(video);
    await enqueueVideo({ videoUrl: url, prompt, channelIndex });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
