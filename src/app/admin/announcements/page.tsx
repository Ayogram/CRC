import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

import { AdminAnnouncementsList } from "@/components/admin/AdminAnnouncementsList";
import { AdminNewAnnouncementTrigger } from "@/components/admin/NewAnnouncementTrigger";

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncements() {
  let announcements: Array<{
    id: string;
    title: string;
    content: string;
    category: string | null;
    status: string;
    isFeatured: boolean;
    isDeleted: boolean;
    featuredImg: string | null;
  }> = [];
  try {
    announcements = await prisma.announcement.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("DB Not ready for Admin Announcements", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-800">Announcements Manager</h1>
          <p className="text-slate-500">Create, edit, and manage dynamic announcements.</p>
        </div>
        <AdminNewAnnouncementTrigger />
      </div>

      <AdminAnnouncementsList initialAnnouncements={announcements} />
    </div>
  );
}
