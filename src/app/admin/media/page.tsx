import { getPrisma } from "@/lib/prisma";
import { AdminMediaGrid } from "@/components/admin/AdminMediaGrid";
import { AdminUploadMediaTrigger } from "@/components/admin/UploadMediaTrigger";

const prisma = getPrisma();

export const dynamic = "force-dynamic";

export default async function AdminMedia() {
  let mediaItems: Array<{
    id: string;
    url: string;
    type: string;
    category: string | null;
    title: string | null;
    isPublished: boolean;
    isDeleted: boolean;
  }> = [];

  try {
    mediaItems = await prisma.media.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    console.log("MEDIA ITEMS:", mediaItems);
  } catch (error) {
    console.error("DB Not ready for Admin Media", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Media Vault</h1>
          <p className="text-slate-500">
            Manage uploaded images and videos assigned to Facilities, Events, and Environment.
          </p>
        </div>

        <AdminUploadMediaTrigger />
      </div>

      <AdminMediaGrid initialMedia={mediaItems} />
    </div>
  );
}