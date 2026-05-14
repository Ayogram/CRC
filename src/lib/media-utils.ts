const FALLBACK_PREVIEW =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='540' viewBox='0 0 960 540'%3E%3Crect width='960' height='540' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' fill='%239CA3AF' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle'%3EPreview unavailable%3C/text%3E%3C/svg%3E";

export type SocialSource = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'video' | 'image' | 'link';

export function getEmbedUrl(url: string) {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { type: 'youtube' as SocialSource, id: ytMatch[1], embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };

  // Instagram
  const igMatch = url.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reels|reel)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) return { type: 'instagram' as SocialSource, id: igMatch[1], embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed` };

  // TikTok (Only match full numeric IDs directly)
  const ttMatch = url.match(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (ttMatch) return { type: 'tiktok' as SocialSource, id: ttMatch[1], embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}` };

  // Facebook
  const fbMatch = url.match(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/.*\/videos\/(\d+)/);
  if (fbMatch) return { type: 'facebook' as SocialSource, id: fbMatch[1], embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0` };

  // Twitter / X
  const twMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
  if (twMatch) return { type: 'twitter' as SocialSource, id: twMatch[1], embedUrl: `https://twitframe.com/show?url=${encodeURIComponent(url)}` };

  // Direct video
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return { type: 'video' as SocialSource, url };

  // Image
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?.*)?$/i)) return { type: 'image' as SocialSource, url };

  // Default to link
  return { type: 'link' as SocialSource, url };
}

export function getThumbnailUrl(url: string, type?: string) {
  if (!url) return FALLBACK_PREVIEW;

  if (type === 'video' || url.match(/\.(mp4|webm|ogg|mov)$/i)) return null; 

  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?.*)?$/i)) return url;

  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;

  // TikTok/Instagram placeholders
  if (url.includes("tiktok.com")) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000000'/%3E%3Ctext x='50%25' y='50%25' fill='%23ffffff' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3ETikTok%3C/text%3E%3C/svg%3E";
  if (url.includes("instagram.com")) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E1306C'/%3E%3Ctext x='50%25' y='50%25' fill='%23ffffff' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle'%3EInstagram%3C/text%3E%3C/svg%3E";

  return FALLBACK_PREVIEW;
}

export function getSourceLabel(type: SocialSource) {
  const labels: Record<string, string> = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    twitter: 'X / Twitter',
    video: 'Direct Video',
    image: 'Image',
    link: 'External Link'
  };
  return labels[type] || 'Unknown';
}
