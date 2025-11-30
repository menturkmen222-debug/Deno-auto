// routes/schedule.ts
import { getPendingVideos, updateVideoStatus } from "../db/queue.ts";
import { generateMetadata } from "../services/groq.ts";
import { uploadToYouTube } from "../services/platforms/youtube.ts";
// boshqa platform importlari ham qo'shiladi

const PLATFORM_UPLOADERS = {
  youtube: uploadToYouTube,
  // tiktok: uploadToTikTok,
  // instagram: uploadToInstagram,
  // facebook: uploadToFacebook,
};

export async function handleSchedule(): Promise<Response> {
  const pending = await getPendingVideos();
  if (pending.length === 0) {
    return new Response("No pending videos", { status: 200 });
  }

  for (const video of pending) {
    try {
      await updateVideoStatus(video.id, "processing");
      
      const meta = await generateMetadata(video.prompt);
      await updateVideoStatus(video.id, "processing", meta);

      const uploader = PLATFORM_UPLOADERS[video.channel];
      if (!uploader) {
        throw new Error(`No uploader for ${video.channel}`);
      }

      const success = await uploader({ ...video, ...meta });
      await updateVideoStatus(video.id, success ? "uploaded" : "failed");
    } catch (err) {
      console.error(`Failed to process ${video.id}:`, err);
      await updateVideoStatus(video.id, "failed");
    }
  }

  return new Response(`Processed ${pending.length} videos`, { status: 200 });
}
