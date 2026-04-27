import { getPrisma } from "@/lib/prisma";
import { AdminTrashGallery } from "@/components/admin/AdminTrashGallery";

const prisma = getPrisma();

export default async function AdminTrash() {
  let deletedAnnouncements: any[] = [];
  let deletedMedia: any[] = [];

  try {
    deletedAnnouncements = await prisma.announcement.findMany({
      where: { isDeleted: true },
      orderBy: { updatedAt: "desc" }
    });

    deletedMedia = await prisma.media.findMany({
      where: { isDeleted: true },
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    console.error("DB Not ready for Trash Management", error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Trash / Deleted Items</h1>
          <p className="text-slate-500">Restore items to their original location or permanently delete them from the system.</p>
        </div>
      </div>

      <AdminTrashGallery 
        initialAnnouncements={deletedAnnouncements} 
        initialMedia={deletedMedia} 
      />
    </div>
  );
}
