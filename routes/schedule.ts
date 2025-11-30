import { getPendingVideo, markAsUploaded } from "../db/queue.ts";
import { generateMetadata } from "../services/groq.ts";
import { uploadToYouTube } from "../services/platforms/youtube.ts";
import { uploadToTikTok } from "../services/platforms/tiktok.ts";
import { uploadToInstagram } from "../services/platforms/instagram.ts";
import { uploadToFacebook } from "../services/platforms/facebook.ts";

const PLATFORMS = ["youtube", "tiktok", "instagram", "facebook"] as const;

export async function handleSchedule(): Promise<Response> {
  const video = await getPendingVideo(); // Bitta video oladi
  if (!video) return new Response("No pending videos", { status: 200 });

  const meta = await generateMetadata(video.prompt);
  const channelIndex = video.channelIndex;

  // Barcha platformalarga yuklash
  const results = await Promise.allSettled(
    PLATFORMS.map(async (platform) => {
      const uploader = {
        youtube: uploadToYouTube,
        tiktok: uploadToTikTok,
        instagram: uploadToInstagram,
        facebook: uploadToFacebook,
      }[platform];

      return await uploader({
        videoUrl: video.videoUrl,
        title: meta.title,
        description: meta.description,
        tags: meta.tags,
        channelIndex,
      });
    })
  );

  const success = results.every(r => r.status === "fulfilled");
  await markAsUploaded(video.id, success);

  return new Response(success ? "✅ Uploaded" : "⚠️ Partial fail", { status: 200 });
}
