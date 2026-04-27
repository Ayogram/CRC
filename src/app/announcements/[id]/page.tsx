import { getPrisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = getPrisma();

export default async function AnnouncementDetail({ params }: { params: { id: string } }) {
  let announcement;
  try {
    announcement = await prisma.announcement.findUnique({
      where: { id: params.id, isDeleted: false, status: "PUBLISHED" }
    });
  } catch (error) {
    // If DB connects fail
    return notFound();
  }

  if (!announcement) {
    return notFound();
  }

  // Safe rich text rendering 
  // In production, consider DOMPurify if users can submit malicious HTML. Here only Admins submit.
  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHero 
        title={announcement.title}
        subtitle={announcement.category || "Announcement"}
        bgMediaUrl={announcement.featuredImg || "/images/events.jpg"}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button variant="ghost" asChild className="mb-8">
           <Link href="/announcements">
             <ArrowLeft className="h-4 w-4 mr-2" /> Back to Announcements
           </Link>
        </Button>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
              <span className="inline-flex items-center text-primary font-bold uppercase tracking-wider">
                <Tag className="h-4 w-4 mr-2" /> {announcement.category || "General"}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
           </div>

           <div 
             className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl"
             dangerouslySetInnerHTML={{ __html: announcement.content }}
           />
        </div>
      </div>
    </div>
  );
}
