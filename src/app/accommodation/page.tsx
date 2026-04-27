import { getPrisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { AccommodationClient } from "@/components/ui/AccommodationClient";
import { seedMedia, INITIAL_ROOMS, INITIAL_DORMS, INITIAL_FACILITIES } from "@/lib/seed";

const prisma = getPrisma();

export const metadata = {
  title: "Accommodation & Facilities | Christian Retreat Centre",
  description: "Experience comfort, luxury, and premium hospitality designed for your perfect stay.",
};

export default async function AccommodationPage() {
  let rooms: any[] = [];
  let dormitories: any[] = [];
  let facilities: any[] = [];

  try {
    const dbRooms = await prisma.room.findMany();
    const dbDorms = await prisma.dormitory.findMany();
    const dbFacs = await prisma.facility.findMany();

    // Intelligent Merging System
    // We map over INITIAL arrays to preserve order and completeness.
    // If the database has an item with matching name, it overrides. Otherwise fallback object is used.
    rooms = INITIAL_ROOMS.map(init => {
      const db = dbRooms.find(r => r.name === init.name);
      return db ? { ...init, ...db } : init;
    });

    dormitories = INITIAL_DORMS.map(init => {
      const db = dbDorms.find(d => d.name === init.name);
      return db ? { ...init, ...db, details: (db as any).details?.length > 0 ? (db as any).details : init.details } : init;
    });

    facilities = INITIAL_FACILITIES.map(init => {
      const db = dbFacs.find(f => f.name === init.name);
      return db ? { ...init, ...db, details: (db as any).details?.length > 0 ? (db as any).details : init.details } : init;
    });

  } catch (error) {
    console.error("[CRC-Sync] Database fetch failed, using professional fallbacks:", error);
    rooms = INITIAL_ROOMS;
    dormitories = INITIAL_DORMS;
    facilities = INITIAL_FACILITIES;
  }

  return (
    <div className="bg-background min-h-screen">
      <PageHero 
        title="Accommodation & Facilities"
        subtitle="Experience comfort, luxury, and premium hospitality designed for your perfect stay."
        bgMediaUrl="/images/crclux.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
        <AccommodationClient 
          initialRooms={rooms} 
          initialDormitories={dormitories} 
          initialFacilities={facilities} 
        />
      </div>
    </div>
  );
}
