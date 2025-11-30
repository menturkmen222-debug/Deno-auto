# 🤖 Auto Video Uploader

AI yordamida video + promptni qabul qilib, YouTube, TikTok, Instagram, Facebookga avtomatik yuklaydigan tizim.

## 🌐 Arxitektura

- **Frontend**: Video + prompt + kanal kirish
- **Backend**: Deno Deploy (`/upload-video`, `/run-schedule`)
- **Storage**: Cloudinary
- **DB**: Deno KV (serverless queue)
- **AI**: Groq (Llama3)
- **Scheduler**: GitHub Actions (har 2 soatda)

## ⚙️ Sozlash

1. **Cloudinary**:
   - Hisob oching
   - `Upload preset` yarating (unsigned)
   - `CLOUDINARY_CLOUD_NAME` va `CLOUDINARY_UPLOAD_PRESET` ni yozib oling

2. **Groq**:
   - [console.groq.com](https://console.groq.com) dan API kalit oling
   - `GROQ_API_KEY` ni saqlang

3. **Platform Tokenlar**:
   - YouTube: OAuth 2.0 refresh token (5 ta)
   - TikTok/IG/FB: developer.dan long-lived access tokenlar
   - Har birini vergul bilan ajratib, muhit o'zgaruvchisi sifatida saqlang:
     ```
     YT_REFRESH_TOKENS=token1,token2,...
     TIKTOK_TOKENS=...
     ```

4. **Deno Deploy**:
   - Loyihani [dash.deno.com](https://dash.deno.com) ga ulang
   - Yuqoridagi `.env` qiymatlarni `Environment Variables` ga qo'shing

5. **GitHub Actions**:
   - `.github/workflows/schedule.yml` faylini `main` branchga qo'shing
   - `your-project.deno.dev` URLini to'g'rilang

## 🧪 Sinov

```bash
# Video yuklash
curl -X POST https://your-project.deno.dev/upload-video \
  -F "video=@/path/to/video.mp4" \
  -F "prompt=AI-generated cooking tutorial with futuristic kitchen" \
  -F "channel=youtube"
