"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, X, Image as ImageIcon, Check } from "lucide-react";
import { upsertAnnouncement } from "@/app/actions/announcements";
import { useRouter } from "next/navigation";
import { getThumbnailUrl } from "@/lib/media-utils";

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  status: string;
  featuredImg?: string | null;
  isFeatured: boolean;
};

export function AdminNewAnnouncementTrigger({ onCreated }: { onCreated?: (item: AnnouncementItem) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [titlePreview, setTitlePreview] = useState("");
  const [contentPreview, setContentPreview] = useState("");
  const [previewBroken, setPreviewBroken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewUrl(URL.createObjectURL(file));
        setFileType(file.type.startsWith("video/") ? "video" : "image");
        setPreviewBroken(false);
     }
  };

  const cleanup = () => {
    setIsOpen(false);
    setPreviewUrl("");
    setFileType(null);
    setTitlePreview("");
    setContentPreview("");
    setIsSubmitting(false);
    setErrorMsg("");
    setSuccessMsg("");
    setPreviewBroken(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    const featuredImgFile = formData.get("featuredImgFile") as File;
    
    if (!featuredImgFile || featuredImgFile.size === 0) {
      formData.set("featuredImg", previewUrl);
    }

    try {
      const result = await upsertAnnouncement(formData);
      if (result?.success) {
        setSuccessMsg("Announcement created.");
        if (result.data) onCreated?.(result.data);
        router.refresh();
        setTimeout(() => {
          cleanup();
        }, 1500);
      } else {
        setErrorMsg(result?.error || "Failed to establish secure link.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20">
        <Plus className="mr-2 h-4 w-4" /> New Announcement
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-white/20">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-800">Create Announcement</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">New Public Bulletin</p>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"><X /></button>
             </div>
             
             <div className="flex flex-col md:flex-row max-h-[80vh]">
               <div className="md:w-1/3 bg-slate-900 p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10 flex items-center justify-center">
                    {previewUrl ? (
                      fileType === "video" ? (
                        <video src={previewUrl} controls className="w-full h-full object-cover" />
                      ) : previewBroken ? (
                        <div className="text-slate-400 text-xs font-bold">Preview unavailable</div>
                      ) : (
                       <img
                        src={getThumbnailUrl(previewUrl) || "/images/placeholder.jpg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewBroken(true)}
                        />
                      )
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">No Media</span>
                      </div>
                    )}
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="md:w-2/3 p-8 space-y-5 overflow-y-auto bg-white">
                 {errorMsg && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">{errorMsg}</div>}
                 {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl font-medium flex items-center"><Check className="h-4 w-4 mr-2" /> {successMsg}</div>}

                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Bulletin Title</label>
                       <input
                         name="title"
                         value={titlePreview}
                         onChange={(e) => setTitlePreview(e.target.value)}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                         placeholder="Event or Notice Title"
                         required
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Category</label>
                       <select name="category" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                         <option value="General">General</option>
                         <option value="Program">Program</option>
                         <option value="Event">Event</option>
                         <option value="Notice">Notice</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Status</label>
                       <select name="status" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                         <option value="DRAFT">Draft</option>
                         <option value="PUBLISHED">Published</option>
                       </select>
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Featured Media</label>
                       <input 
                         type="file" 
                         name="featuredImgFile" 
                         accept="image/*,video/mp4,video/quicktime,video/webm"
                         onChange={handleFileChange}
                         className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                       />
                       <input 
                         name="featuredImg" 
                         value={previewUrl.startsWith("blob:") ? "" : previewUrl}
                        onChange={(e) => {
                                  const url = e.target.value;
                                  setPreviewUrl(url);
                                  setPreviewBroken(false);

                                  if (url.match(/\.(mp4|mov|webm)$/i)) {
                                    setFileType("video");
                                  } else {
                                    setFileType("image");
                                  }
                                }}
                         className="w-full px-4 py-2 mt-2 text-sm bg-slate-50 border border-slate-100 rounded-lg placeholder:text-slate-300" 
                         placeholder="Or paste URL" 
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Content Detail</label>
                      <textarea
                        name="content"
                        rows={4}
                        value={contentPreview}
                        onChange={(e) => setContentPreview(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                        placeholder="Describe the announcement..."
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                       <input type="checkbox" name="isFeatured" value="true" className="h-5 w-5 text-primary rounded" />
                       <label className="text-sm font-bold text-slate-600">Feature on Home Feed</label>
                    </div>
                 </div>
                 
                 <div className="pt-4 flex justify-end space-x-3">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Discard</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[160px] h-12 shadow-lg shadow-primary/20">
                      {isSubmitting ? "Saving..." : "Create Announcement"}
                    </Button>
                 </div>
                 <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Live Content Preview</p>
                   <h4 className="text-sm font-bold text-slate-900 mb-1">{titlePreview || "Announcement title"}</h4>
                   <p className="text-xs text-slate-600 line-clamp-3">{contentPreview || "Announcement content preview will show here."}</p>
                 </div>
               </form>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
