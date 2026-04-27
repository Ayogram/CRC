"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Calendar, Tag, Check, X, AlertTriangle, UploadCloud } from "lucide-react";
import { deleteAnnouncement, setAnnouncementStatus, upsertAnnouncement } from "@/app/actions/announcements";

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  status: string;
  isFeatured: boolean;
  isDeleted?: boolean;
  featuredImg?: string | null;
};

export function AdminAnnouncementsList({ initialAnnouncements }: { initialAnnouncements: AnnouncementItem[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
const [editFileType, setEditFileType] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isToggling, setIsToggling] = useState<string | null>(null);
const [feedback, setFeedback] = useState("");

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");
    setModalSuccess("");

    const formData = new FormData(e.currentTarget);
    const featuredImgFile = formData.get("featuredImgFile") as File;
    if (!featuredImgFile || featuredImgFile.size === 0) {
      formData.set("featuredImg", editPreviewUrl);
    }

    try {
       const result = await upsertAnnouncement(formData);
       if (result?.success && result.data) {
         setModalSuccess("Announcement Updated Perfectly.");
         setAnnouncements(prev => prev.map(a => a.id === result.data.id ? result.data : a));
         setTimeout(() => {
           setEditingItem(null);
           router.refresh();
         }, 1500);
       } else {
         setModalError(result?.error || "Sync stream failed.");
         setIsSubmitting(false);
       }
    } catch {
       setModalError("Link Error: System link intermittent.");
       setIsSubmitting(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  useEffect(() => {
    if (editingItem && editingItem.featuredImg) {
      setEditPreviewUrl(editingItem.featuredImg);
      setEditFileType(editingItem.featuredImg.match(/\.(mp4|mov|webm)$/i) ? "video" : "image");
    } else {
      setEditPreviewUrl("");
      setEditFileType(null);
    }
    setModalError("");
    setModalSuccess("");
  }, [editingItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setEditPreviewUrl(URL.createObjectURL(file));
        setEditFileType(file.type.startsWith("video/") ? "video" : "image");
     }
  };

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setIsDeleting(id);
    const result = await deleteAnnouncement(id);
    if (result?.success) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      router.refresh();
    } else {
      setFeedback(result?.error || "Failed to delete");
    }
    setIsDeleting(null);
  }

  async function handleToggleStatus(item: AnnouncementItem) {
    setIsToggling(item.id);
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const result = await setAnnouncementStatus(item.id, nextStatus);
    if (result?.success && result.data) {
      setAnnouncements((prev) => prev.map((a) => (a.id === item.id ? result.data : a)));
      setFeedback(`Status updated: ${nextStatus}`);
      router.refresh();
    } else {
      setFeedback(result?.error || "Failed to update status");
    }
    setIsToggling(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {feedback && <p className="px-6 pt-4 text-xs text-slate-500">{feedback}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 italic font-medium">
          <thead className="bg-slate-50/50 uppercase tracking-widest text-[9px] font-black text-slate-400">
            <tr>
              <th className="px-6 py-4 text-left">Announcement Detail</th>
              <th className="px-6 py-4 text-left">Sync Status</th>
              <th className="px-6 py-4 text-left">Public Feed</th>
              <th className="px-6 py-4 text-right">Vault Control</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {announcements.filter(a => !a.isDeleted).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 mr-4 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                      {item.featuredImg ? (
                        <img src={item.featuredImg} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300"><Calendar className="h-5 w-5" /></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-800 line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center mt-1">
                        <Tag className="h-3 w-3 mr-1" /> {item.category || "General"}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.content || "No content"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-[9px] leading-5 font-black uppercase tracking-tighter rounded-full ${item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.isFeatured ? (
                    <span className="flex items-center text-primary text-[10px] font-black uppercase tracking-widest">
                      <Check className="h-4 w-4 mr-1 p-0.5 bg-primary/10 rounded-full" /> Featured
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Standard</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all" onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-2 text-[10px]"
                      onClick={() => handleToggleStatus(item)}
                      disabled={isToggling === item.id}
                    >
                      {isToggling === item.id ? "..." : item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                    >
                      {isDeleting === item.id ? <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {announcements.filter(a => !a.isDeleted).length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 mb-4 opacity-10" />
                    <p className="text-[11px] uppercase tracking-widest font-black">Secure Vault Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-900">Update Bulletin</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Protocol Sync Mode</p>
                </div>
                <button type="button" onClick={() => setEditingItem(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"><X className="h-5 w-5" /></button>
             </div>

             <div className="flex flex-col md:flex-row max-h-[80vh]">
               {/* PREVIEW SIDE */}
               <div className="md:w-1/3 bg-slate-900 p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 ring-1 ring-white/10 flex items-center justify-center">
                    {editPreviewUrl ? (
                      editFileType === "video" ? (
                        <video src={editPreviewUrl} autoPlay loop muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={editPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center">
                        <UploadCloud className="h-10 w-10 mb-2 opacity-20" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">No Pulse Image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-tighter font-black">Bulletin Preview Sync</p>
                  </div>
               </div>

               {/* FORM SIDE */}
               <form onSubmit={handleEditSubmit} className="md:w-2/3 p-8 space-y-5 overflow-y-auto bg-white">
                 {modalError && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold animate-in zoom-in">{modalError}</div>}
                 {modalSuccess && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-bold animate-in zoom-in flex items-center"><Check className="h-4 w-4 mr-2" /> {modalSuccess}</div>}

                 <input type="hidden" name="id" value={editingItem.id} />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Bulletin Title</label>
                      <input name="title" defaultValue={editingItem.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-primary focus:border-primary text-slate-800 font-bold" placeholder="Update Title" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Category</label>
                      <select name="category" defaultValue={editingItem.category || "General"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                        <option value="General">General</option>
                        <option value="Program">Program</option>
                        <option value="Event">Event</option>
                        <option value="Notice">Notice</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Status</label>
                      <select name="status" defaultValue={editingItem.status} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Update Attachment</label>
                      <div className="flex flex-col space-y-2">
                         <input 
                           type="file" 
                           name="featuredImgFile" 
                           accept="image/*,video/mp4,video/quicktime,video/webm"
                           onChange={handleFileChange}
                           className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                         />
                         <input 
                           name="featuredImg" 
                           value={editPreviewUrl.startsWith("blob:") ? "" : editPreviewUrl}
                           onChange={(e) => {
                             setEditPreviewUrl(e.target.value);
                             setEditFileType(null);
                           }}
                           className="w-full px-4 py-2 text-[10px] bg-slate-50 border border-slate-100 rounded-xl font-bold placeholder:text-slate-300" 
                           placeholder="External URL sync..." 
                         />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Bulletin Content</label>
                      <textarea name="content" defaultValue={editingItem.content} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold placeholder:text-slate-300 text-sm" placeholder="Bulletin content..." required />
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <input type="checkbox" name="isFeatured" value="true" defaultChecked={editingItem.isFeatured} className="h-5 w-5 text-primary rounded border-slate-300 focus:ring-primary" />
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Feature on Primary Feed</label>
                    </div>
                 </div>
                 <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400" onClick={() => setEditingItem(null)} disabled={isSubmitting}>Discard</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[160px] h-12 shadow-xl shadow-primary/20 rounded-2xl">
                      {isSubmitting ? (
                        <div className="flex items-center"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" /> Updating...</div>
                      ) : "Confirm Sync"}
                    </Button>
                 </div>
               </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
