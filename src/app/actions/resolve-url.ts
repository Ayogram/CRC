"use server";

export async function resolveSocialUrl(url: string) {
  if (!url) return null;
  
  try {
    // TikTok oEmbed is great for short links
    if (url.includes("tiktok.com")) {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        // The embed_product_id or extracting from html
        // Example HTML: <blockquote ... data-video-id="7368254425441864966">
        const idMatch = data.html?.match(/data-video-id="(\d+)"/);
        if (idMatch) {
          return { type: 'tiktok', id: idMatch[1], title: data.title };
        }
      }
    }

    const response = await fetch(url, { 
      method: 'GET', // GET is safer than HEAD for redirects sometimes
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const finalUrl = response.url;
    
    // Extract ID from final URL
    // TikTok
    const ttMatch = finalUrl.match(/video\/(\d+)/);
    if (ttMatch) return { type: 'tiktok', id: ttMatch[1], finalUrl };

    // Instagram
    const igMatch = finalUrl.match(/(?:p|reels|reel)\/([a-zA-Z0-9_-]+)/);
    if (igMatch) return { type: 'instagram', id: igMatch[1], finalUrl };

    return { finalUrl };
  } catch (error) {
    console.error("Resolve URL error:", error);
    return null;
  }
}
