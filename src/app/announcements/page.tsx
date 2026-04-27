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

  export default async function AnnouncementsPage() {
    let announcements: any[] = [];
    
    try {
      announcements = await prisma.announcement.findMany({
        where: { 
          isDeleted: false, 
          status: "PUBLISHED" 
        },
        orderBy: { 
          publishedAt: 'desc' 
        }
      });
    } catch (error) {
      console.warn("Database connection failed or schema missing, rendering empty state.", error);
      // fallback to empty state
      announcements = [];
    }

    const featured = announcements.find(a => a.isFeatured) || announcements[0];
    const list = announcements.filter(a => a.id !== featured?.id);
    return (
      <div className="bg-background min-h-screen">
        <PageHero 
          title="Announcements"
          subtitle="Stay updated with upcoming programs, special events, and important notices."
          bgMediaUrl="/images/events.jpg"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-16">
          
          {/* LATEST / HIGHLIGHTED */}
          {featured ? (
            <div className="mb-16">
              <h2 className="text-2xl font-bold font-heading mb-8 flex items-center">
                <span className="w-2 h-6 bg-primary mr-3 rounded-full"></span> Featured Announcement
              </h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row group transition-shadow hover:shadow-2xl">
                <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
                  {featured.featuredImg ? (
                    <img 
                      src={featured.featuredImg} 
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse" />
                  )}
                  {featured.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {featured.category}
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" /> 
                    {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-3xl font-bold font-heading mb-4 text-foreground leading-tight">{featured.title}</h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed line-clamp-3">
                    {featured.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                  </p>
                  <div>
                    <Button className="group" size="lg" asChild>
                      <Link href={`/announcements/${featured.id}`}>
                        Read Full Story <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
              <h2 className="text-2xl font-bold font-heading mb-8 flex items-center">
                <span className="w-2 h-6 bg-gray-300 mr-3 rounded-full"></span> Recent Updates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {list.map(post => (
                  <Card key={post.id} className="border-0 shadow-md hover:shadow-xl transition-shadow flex flex-col overflow-hidden h-full">
                    <div className="relative h-48 overflow-hidden group">
                      {post.featuredImg ? (
                        <img 
                          src={post.featuredImg} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <CardHeader className="pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-primary">
                          {post.category && <><Tag className="h-3 w-3 mr-1" /> {post.category}</>}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <CardTitle className="text-xl line-clamp-2 leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="text-sm line-clamp-3 leading-relaxed text-gray-600">
                        {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" className="text-primary p-0 h-auto hover:bg-transparent hover:underline" asChild>
                        <Link href={`/announcements/${post.id}`}>
                          Continue Reading <ArrowRight className="ml-1 h-3 w-3" />
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
