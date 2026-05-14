  import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
  import { Button } from "@/components/ui/Button";
  import { Calendar, Tag, ArrowRight } from "lucide-react";
  import { PageHero } from "@/components/ui/PageHero";

  export const metadata = {
    title: "Announcements & Events | CRC",
    description: "Stay updated with the latest news, upcoming events, retreat schedules, and church programs at the Christian Retreat Centre.",
  };

  import { getPrisma } from "@/lib/prisma";
  import Link from "next/link";

  const prisma = getPrisma();

  export const dynamic = 'force-dynamic';

  import { getEmbedUrl } from "@/lib/media-utils";

  import { resolveSocialUrl } from "@/app/actions/resolve-url";

  export default async function AnnouncementsPage() {
    let announcements: any[] = [];
    
    try {
      const rawAnnouncements = await prisma.announcement.findMany({
        where: { 
          isDeleted: false, 
          status: "PUBLISHED" 
        },
        orderBy: { 
          publishedAt: 'desc' 
        }
      });

      // Resolve URLs for previews (Safely)
      announcements = await Promise.all(rawAnnouncements.map(async (a) => {
        try {
          if (a.featuredImg && (a.featuredImg.includes("tiktok.com") || a.featuredImg.includes("youtu.be"))) {
            const resolved = await resolveSocialUrl(a.featuredImg);
            if (resolved) {
               return { ...a, resolvedMedia: resolved };
            }
          }
        } catch (e) {
          console.warn("URL Resolution failed for:", a.featuredImg, e);
        }
        return a;
      }));
    } catch (error) {
      console.warn("Database connection failed or schema missing, rendering empty state.", error);
      announcements = [];
    }

    const featured = announcements.find(a => a.isFeatured) || announcements[0];
    const list = announcements.filter(a => a.id !== featured?.id);

    const renderMedia = (url: string, type: string, className: string, resolvedMedia?: any) => {
      const embed = resolvedMedia || getEmbedUrl(url);
      const isVideo = embed?.type === 'video' || url.match(/\.(mp4|mov|webm)$/i);
      const placeholder = isVideo ? url.replace(/\.(mp4|mov|webm)$/i, '.jpg') : url;

      const wrapLink = (content: React.ReactNode) => {
        if (embed?.type && ["instagram", "tiktok", "facebook", "youtube"].includes(embed.type)) {
          return <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">{content}</a>;
        }
        return content;
      };

      if (isVideo) {
        return (
          <div className="relative w-full h-full">
            <img src={placeholder || "/images/placeholder.jpg"} alt="Media Preview" className={className} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/90 text-white rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      }
      if (embed?.type && ["instagram", "tiktok", "facebook", "youtube"].includes(embed.type)) {
        if (embed.type === "tiktok" && embed.id) {
          return wrapLink(
            <div className="w-full h-full overflow-y-auto custom-scrollbar bg-black">
              <iframe 
                src={`https://www.tiktok.com/embed/v2/${embed.id}`}
                className="w-full min-h-[750px] border-0"
                scrolling="no"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          );
        }
        if (embed.type === "youtube" && embed.id) {
          return wrapLink(
            <div className="w-full h-full overflow-hidden">
              <iframe 
                src={`https://www.youtube.com/embed/${embed.id}?autoplay=0&mute=1`}
                className="w-full h-full border-0"
                scrolling="no"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          );
        }
        if (embed.type === "instagram" && embed.id) {
          return wrapLink(
            <iframe 
              src={`https://www.instagram.com/p/${embed.id}/embed`}
              className="w-full h-full border-0 pointer-events-none"
            />
          );
        }
        return wrapLink(
          <div className={`${className} bg-slate-950 flex flex-col items-center justify-center text-primary`}>
            <div className="bg-primary/20 p-4 rounded-full animate-pulse mb-3">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{embed.type} Content</span>
          </div>
        );
      }
      return <img src={url || "/images/placeholder.jpg"} alt="Media" className={className} />;
    };

    return (
      <div className="bg-white min-h-screen">
        <PageHero 
          title="Announcements"
          subtitle="Stay updated with our latest news, upcoming programs, and special events."
          bgMediaUrl="/images/events.jpg"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-16">
          
          {/* LATEST / HIGHLIGHTED */}
          {featured ? (
            <div className="mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center">
                <span className="w-10 h-[2px] bg-primary mr-4"></span> Featured
              </h2>
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row group transition-all duration-500">
                <div className="lg:w-3/5 relative h-80 lg:h-[480px] overflow-hidden bg-slate-50">
                  {featured.featuredImg ? renderMedia(featured.featuredImg, "image", "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105", featured.resolvedMedia) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center" />
                  )}
                  {featured.category && (
                    <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      {featured.category}
                    </div>
                  )}
                </div>
                <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center h-80 lg:h-[480px] overflow-y-auto">
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                    <Calendar className="h-4 w-4 mr-2 text-primary" /> 
                    {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold font-heading mb-6 text-slate-900 leading-tight tracking-tight">{featured.title}</h3>
                  <p className="text-slate-600 text-base mb-10 leading-relaxed line-clamp-4">
                    {featured.content.replace(/<[^>]+>/g, '')}
                  </p>
                  <div>
                    <Button className="group h-14 px-8 rounded-2xl" size="lg" asChild>
                      <Link href={`/announcements/${featured.id}`}>
                        Read More <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* FEED GRID */}
          {list.length > 0 ? (
            <>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-10 flex items-center">
                <span className="w-10 h-[1px] bg-slate-200 mr-4"></span> Recent Updates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {list.map(post => (
                  <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden h-[550px] rounded-[2rem] bg-white group">
                    <div className="relative h-60 min-h-[240px] overflow-hidden bg-slate-50">
                      {post.featuredImg ? renderMedia(post.featuredImg, "image", "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110", post.resolvedMedia) : (
                        <div className="w-full h-full bg-slate-100" />
                      )}
                    </div>
                    <CardHeader className="pt-8 px-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="inline-flex items-center text-[8px] font-bold uppercase tracking-widest text-primary">
                          {post.category && post.category}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow px-8 pb-4">
                      <CardDescription className="text-sm line-clamp-3 leading-relaxed text-slate-600">
                        {post.content.replace(/<[^>]+>/g, '')}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-4">
                      <Button variant="ghost" className="text-primary p-0 h-auto hover:bg-transparent font-bold text-[10px] uppercase tracking-widest group/btn" asChild>
                        <Link href={`/announcements/${post.id}`} className="flex items-center">
                          View Details <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : null}

          {announcements.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">No Announcements</h3>
              <p className="text-gray-500">There are currently no published events or updates. Please check back later!</p>
            </div>
          )}

        </div>
      </div>
    );
  }
