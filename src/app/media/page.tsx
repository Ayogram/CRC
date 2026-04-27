import { getPrisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { MediaGallery } from "@/components/ui/MediaGallery";
import { Metadata } from "next";
import { seedMedia, INITIAL_MEDIA } from "@/lib/seed";

const prisma = getPrisma();

export const metadata: Metadata = {
  title: "Media Gallery | Christian Retreat Centre",
  description: "Explore moments, spaces, events, and unforgettable experiences at CRC.",
};

// Fallback dummy media if DB is completely empty or offline
const FALLBACK_MEDIA = [
  { id: "f1", type: "video", category: "Facilities", url: "/images/goshen_ultra.mp4", title: "Goshen Ultra Suite" },
  { id: "f2", type: "image", category: "Events", url: "/images/events.jpg", title: "Annual Convention" },
  { id: "f3", type: "image", category: "Environment", url: "/images/media__1776271813071.jpg", title: "Serene Garden View" },
  { id: "f4", type: "video", category: "Environment", url: "/images/childrenplayground.mp4", title: "Children's Playground" },
];

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  let mediaItems: any[] = [];
  
  try {
    mediaItems = await prisma.media.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });


  } catch (error) {
    console.warn("[CRC-Recovery] Media fetch failed, using professional fallback:", error);
    mediaItems = INITIAL_MEDIA;
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHero 
        title="Media Gallery"
        subtitle="Explore moments, spaces, events, and unforgettable experiences at CRC."
        bgMediaUrl="/images/events.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
         <MediaGallery initialMedia={mediaItems} />
      </div>
    </div>
  );
}
