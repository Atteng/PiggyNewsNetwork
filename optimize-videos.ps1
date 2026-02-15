# Video Optimization Script
# Follows naming convention:
# - 404.jpg / 404-mobile.jpg -> 404 page FALLBACK images (static)
# - 404-vid.mp4 / 404-mobile-vid.mp4 -> 404 page VIDEO backgrounds
# - bg-1.jpg / bg-1-mobile.jpg -> Home page FALLBACK images (static)
# - bg-1-vid.mp4 / bg-1-mobile-vid.mp4 -> Home page VIDEO backgrounds
# - bg-2.jpg -> Static background for other pages (News, Governance, etc.)

Write-Host "=== PiggyDAO Video Optimization ===" -ForegroundColor Magenta
Write-Host ""

# Create directory structure
Write-Host "Creating directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path public\videos\desktop, public\videos\mobile | Out-Null

# ===== 404 PAGE VIDEOS =====
Write-Host ""
Write-Host "Optimizing 404 PAGE videos..." -ForegroundColor Yellow
Write-Host "  Note: 404.jpg and 404-mobile.jpg are used as fallback images" -ForegroundColor Gray
Write-Host ""

# Desktop - 404-vid.mp4
Write-Host "  [1/4] Desktop MP4 (1080p)..." -ForegroundColor Gray
ffmpeg -i public\404-vid.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -vf scale=1920:1080 -movflags +faststart public\videos\desktop\404-vid.mp4 -y

Write-Host "  [2/4] Desktop WebM (1080p)..." -ForegroundColor Gray
ffmpeg -i public\404-vid.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k -vf scale=1920:1080 -deadline good -cpu-used 4 public\videos\desktop\404-vid.webm -y

# Mobile - 404-mobile-vid.mp4
Write-Host "  [3/4] Mobile MP4 (1080x1920 portrait)..." -ForegroundColor Gray
ffmpeg -i public\404-mobile-vid.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -vf scale=1080:1920 -movflags +faststart public\videos\mobile\404-vid.mp4 -y

Write-Host "  [4/4] Mobile WebM (1080x1920 portrait)..." -ForegroundColor Gray
ffmpeg -i public\404-mobile-vid.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -c:a libopus -b:a 96k -vf scale=1080:1920 -deadline good -cpu-used 4 public\videos\mobile\404-vid.webm -y

# Generate poster images from videos
Write-Host "  [5/6] Desktop poster (from video)..." -ForegroundColor Gray
ffmpeg -i public\404-vid.mp4 -ss 00:00:01 -vframes 1 -q:v 2 public\videos\desktop\404-vid-poster.jpg -y

Write-Host "  [6/6] Mobile poster (from video)..." -ForegroundColor Gray
ffmpeg -i public\404-mobile-vid.mp4 -ss 00:00:01 -vframes 1 -vf scale=1080:1920 -q:v 3 public\videos\mobile\404-vid-poster.jpg -y

# ===== HOME PAGE VIDEOS (bg-1) =====
Write-Host ""
Write-Host "Optimizing HOME PAGE videos (bg-1)..." -ForegroundColor Yellow
Write-Host "  Note: bg-1.jpg and bg-1-mobile.jpg are used as fallback images" -ForegroundColor Gray
Write-Host ""

# Desktop - bg-1-vid.mp4
Write-Host "  [1/6] Desktop MP4 (1080p)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-vid.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -vf scale=1920:1080 -movflags +faststart public\videos\desktop\bg-1-vid.mp4 -y

Write-Host "  [2/6] Desktop WebM (1080p)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-vid.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k -vf scale=1920:1080 -deadline good -cpu-used 4 public\videos\desktop\bg-1-vid.webm -y

# Mobile - bg-1-mobile-vid.mp4
Write-Host "  [3/6] Mobile MP4 (1080x1920 portrait)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-mobile-vid.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -vf scale=1080:1920 -movflags +faststart public\videos\mobile\bg-1-vid.mp4 -y

Write-Host "  [4/6] Mobile WebM (1080x1920 portrait)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-mobile-vid.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -c:a libopus -b:a 96k -vf scale=1080:1920 -deadline good -cpu-used 4 public\videos\mobile\bg-1-vid.webm -y

# Generate poster images from videos
Write-Host "  [5/6] Desktop poster (from video)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-vid.mp4 -ss 00:00:01 -vframes 1 -q:v 2 public\videos\desktop\bg-1-vid-poster.jpg -y

Write-Host "  [6/6] Mobile poster (from video)..." -ForegroundColor Gray
ffmpeg -i public\bg-1-mobile-vid.mp4 -ss 00:00:01 -vframes 1 -vf scale=1080:1920 -q:v 3 public\videos\mobile\bg-1-vid-poster.jpg -y

# ===== SUMMARY =====
Write-Host ""
Write-Host "=== Optimization Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Generated video files:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  404 Page:" -ForegroundColor White
Write-Host "    Desktop:" -ForegroundColor Gray
Write-Host "      - public/videos/desktop/404-vid.mp4" -ForegroundColor DarkGray
Write-Host "      - public/videos/desktop/404-vid.webm" -ForegroundColor DarkGray
Write-Host "      - public/videos/desktop/404-vid-poster.jpg" -ForegroundColor DarkGray
Write-Host "    Mobile:" -ForegroundColor Gray
Write-Host "      - public/videos/mobile/404-vid.mp4" -ForegroundColor DarkGray
Write-Host "      - public/videos/mobile/404-vid.webm" -ForegroundColor DarkGray
Write-Host "      - public/videos/mobile/404-vid-poster.jpg" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Home Page:" -ForegroundColor White
Write-Host "    Desktop:" -ForegroundColor Gray
Write-Host "      - public/videos/desktop/bg-1-vid.mp4" -ForegroundColor DarkGray
Write-Host "      - public/videos/desktop/bg-1-vid.webm" -ForegroundColor DarkGray
Write-Host "      - public/videos/desktop/bg-1-vid-poster.jpg" -ForegroundColor DarkGray
Write-Host "    Mobile:" -ForegroundColor Gray
Write-Host "      - public/videos/mobile/bg-1-vid.mp4" -ForegroundColor DarkGray
Write-Host "      - public/videos/mobile/bg-1-vid.webm" -ForegroundColor DarkGray
Write-Host "      - public/videos/mobile/bg-1-vid-poster.jpg" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Existing static backgrounds:" -ForegroundColor Cyan
Write-Host "  404 Page (fallback images):" -ForegroundColor White
Write-Host "    - public/404.jpg (desktop fallback)" -ForegroundColor Gray
Write-Host "    - public/404-mobile.jpg (mobile fallback)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Home Page (fallback images):" -ForegroundColor White
Write-Host "    - public/bg-1.jpg (desktop fallback)" -ForegroundColor Gray
Write-Host "    - public/bg-1-mobile.jpg (mobile fallback)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Other Pages (News, Governance, etc.):" -ForegroundColor White
Write-Host "    - public/bg-2.jpg (desktop & mobile)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next: Update your pages to use VideoBackground component!" -ForegroundColor Magenta
