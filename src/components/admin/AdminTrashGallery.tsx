"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCcw, Trash2, FileText, ImageIcon, Search, X, Loader2 } from "lucide-react";
import { restoreAnnouncement, permanentDeleteAnnouncement } from "@/app/actions/announcements";
import { restoreMedia, permanentDeleteMedia } from "@/app/actions/media";

export function AdminTrashGallery({ 
  initialAnnouncements, 
  initialMedia 
}: { 
  initialAnnouncements: any[], 
  initialMedia: any[] 
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [media, setMedia] = useState(initialMedia);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleRestore(id: string, type: 'announcement' | 'media') {
    setLoadingId(id);
    if (type === 'announcement') {
      await restoreAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } else {
      await restoreMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    }
    setLoadingId(null);
  }

  async function handlePermanentDelete(id: string, type: 'announcement' | 'media') {
    if (!confirm("This will permanently remove this item from the database. Are you sure?")) return;
    setLoadingId(id);
    if (type === 'announcement') {
      await permanentDeleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } else {
      await permanentDeleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    }
    setLoadingId(null);
  }

  const isEmpty = announcements.length === 0 && media.length === 0;

  return (
    <div className="space-y-8">
      {/* ANNOUNCEMENTS TRASH */}
      <section>
        <h3 className="text-lg font-bold font-heading text-slate-700 mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-slate-400" /> Announcements Trash
        </h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {announcements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-400 italic">Deleted {new Date(item.updatedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-100 hover:bg-blue-50" onClick={() => handleRestore(item.id, 'announcement')} disabled={!!loadingId}>
                        <RefreshCcw className="h-4 w-4 mr-1" /> Restore
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handlePermanentDelete(item.id, 'announcement')} disabled={!!loadingId}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-400 text-sm">No announcements in trash.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MEDIA TRASH */}
      <section>
        <h3 className="text-lg font-bold font-heading text-slate-700 mb-4 flex items-center">
          <ImageIcon className="mr-2 h-5 w-5 text-slate-400" /> Media Trash
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-3 group relative">
                 <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover grayscale" alt="" />
                    )}
                 </div>
                 <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-3">{item.title || "Untitled"}</div>
                 <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8 px-1 text-blue-600" onClick={() => handleRestore(item.id, 'media')} disabled={!!loadingId}>
                      <RefreshCcw className="h-3 w-3 mr-1" /> Restore
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 h-8 w-8 p-0" onClick={() => handlePermanentDelete(item.id, 'media')} disabled={!!loadingId}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                 </div>
              </div>
            ))}
            {media.length === 0 && (
               <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
                 No media in trash.
               </div>
            )}
        </div>
      </section>
    </div>
  );
}
