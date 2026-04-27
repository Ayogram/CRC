"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Video, Image as ImageIcon, ExternalLink, X, Eye, Loader2, Check, UploadCloud } from "lucide-react";
import { deleteMedia, setMediaPublished, upsertMedia } from "@/app/actions/media";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/media-utils";
import { AdminUploadMediaTrigger } from "./UploadMediaTrigger";

type MediaItem = {
  id: string;
  url: string;
  type: string;
  category?: string | null;
  title?: string | null;
  isPublished: boolean;
  isDeleted?: boolean;
};

export function AdminMediaGrid({ initialMedia }: { initialMedia: MediaItem[] }) {
const [mediaItems, setMediaItems] = useState(initialMedia || []);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Move this item to trash?")) return;
    setIsDeleting(id);
    const result = await deleteMedia(id);
    if (result?.success) {
      setMediaItems(prev => prev.filter(m => m.id !== id));
      router.refresh();
    } else {
      setFeedback(result?.error || "Failed to delete");
    }
    setIsDeleting(null);
  }

  async function handleTogglePublish(item: MediaItem) {
    setIsToggling(item.id);
    const result = await setMediaPublished(item.id, !item.isPublished);
    if (result?.success && result.data) {
      setMediaItems((prev) => prev.map((m) => (m.id === item.id ? result.data : m)));
      setFeedback(`Visibility updated: ${result.data.isPublished ? "published" : "hidden"}.`);
      router.refresh();
    } else {
      setFeedback(result?.error || "Failed to update visibility");
    }
    setIsToggling(null);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");
    setModalSuccess("");

    const formData = new FormData(e.currentTarget);
    const mediaFile = formData.get("mediaFile") as File;
    if (!mediaFile || mediaFile.size === 0) {
      formData.set("url", previewUrl);
    }

    try {
      const result = await upsertMedia(formData);
      if (result?.success && result.data) {
        setModalSuccess("Vault Entry Updated Successfully.");
        setMediaItems(prev => prev.map(m => m.id === result.data.id ? result.data : m));
        setTimeout(() => {
          setEditingItem(null);
          router.refresh();
        }, 1500);
      } else {
        setModalError(result?.error || "Vault sync failed.");
        setIsSubmitting(false);
      }
    } catch {
      setModalError("Link Error: Protocol Interrupted.");
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

 return (
  <>
    {feedback && <p className="text-xs text-slate-500">{feedback}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       { mediaItems.map((item) => {
          const embedInfo = getEmbedUrl(item.url);
          const thumb = getThumbnailUrl(item.url, item.type);
          const isExternal = ["youtube", "instagram", "tiktok", "facebook", "twitter"].includes(embedInfo?.type || "");

          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  {item.type === 'video' && !thumb ? (
                    <video src={item.url} className="w-full h-full object-cover" controls muted playsInline preload="metadata" />
                  ) : (
                    <img src={thumb || "/images/placeholder.jpg"} className="w-full h-full object-cover" alt={item.title || "Media"} />
                  )}
                  
                  {isExternal && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                       <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                          <ExternalLink className="h-4 w-4 text-white" />
                       </div>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white rounded-full shadow-sm px-3 py-0.5 text-[8px] uppercase font-black tracking-widest flex items-center border border-white/10">
                    {item.type === 'video' || isExternal ? <Video className="h-2 w-2 mr-1.5" /> : <ImageIcon className="h-2 w-2 mr-1.5" />}
                    {item.category}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-slate-800 text-xs mb-3 line-clamp-1">{item.title || "Untitled File"}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Type: {item.type}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] px-2 py-0.5 font-black rounded-full uppercase tracking-widest ${item.isPublished ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {item.isPublished ? "Live" : "Stored"}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[9px]"
                        onClick={() => handleTogglePublish(item)}
                        disabled={isToggling === item.id}
                      >
                        {isToggling === item.id ? "..." : item.isPublished ? "Hide" : "Publish"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors" onClick={() => {
                        setEditingItem(item);
                        setPreviewUrl(item.url);
                        setModalError("");
                        setModalSuccess("");
                      }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                      >
                        {isDeleting === item.id ? <Loader2 className="animate-spin h-3 w-3" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                </div>
            </div>
          );
        })}
        
        {/* ADD NEW CARD - Minimalist Trigger */}
        <div className="aspect-video">
           <AdminUploadMediaTrigger onCreated={(item) => setMediaItems((prev) => [item, ...prev])} />
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] border border-white/20">
             
             {/* PREVIEW PANEL */}
             <div className="md:w-1/2 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10">
                   <span className="bg-white/10 backdrop-blur-md text-white/70 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-white/10">Live Vault Preview</span>
                </div>
                
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 flex items-center justify-center group-hover:ring-primary/40 transition-all duration-500">
                   {(() => {
                     if (!previewUrl) return <div className="text-slate-600 flex flex-col items-center"><Eye className="h-10 w-10 mb-3 opacity-20" /><span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Source Required</span></div>;
                     
                     if (previewUrl.startsWith("blob:")) {
                        const fileInput = document.querySelector('input[name="mediaFile"]') as HTMLInputElement;
                        const isVideo = fileInput?.files?.[0]?.type.startsWith("video/");
                        if (isVideo) {
                          return <video key={previewUrl} src={previewUrl} autoPlay loop muted className="w-full h-full object-contain" />;
                        }
                        return <img key={previewUrl} src={previewUrl} className="w-full h-full object-contain" alt="Preview" />;
                     }

                     const embedInfo = getEmbedUrl(previewUrl);
                     const blockedEmbedHosts = ["instagram", "tiktok", "facebook", "twitter"];
                     if (embedInfo?.type && blockedEmbedHosts.includes(embedInfo.type)) {
                       return (
                         <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                           <ImageIcon className="h-8 w-8 text-slate-500 mb-3" />
                           <p className="text-xs text-slate-200 font-bold uppercase tracking-wide">{embedInfo.type} link detected</p>
                           <p className="text-[10px] text-slate-400 mt-1">Host may block embedded previews.</p>
                           <a href={previewUrl} target="_blank" rel="noreferrer" className="mt-3 text-[10px] text-primary underline break-all">
                             Open source link
                           </a>
                         </div>
                       );
                     }
                     
                     if (embedInfo?.embedUrl) {
                       return (
                         <iframe key={previewUrl} src={embedInfo.embedUrl} className="w-full h-full border-0" allowFullScreen />
                       );
                     }
                     
                     if (embedInfo?.type === 'video' || previewUrl.match(/\.(mp4|mov|webm)$/i)) {
                        return <video key={previewUrl} src={previewUrl} controls autoPlay loop muted className="w-full h-full object-contain" />;
                     }

                     const thumb = getThumbnailUrl(previewUrl);
                     return <img key={previewUrl} src={thumb || "/images/placeholder.jpg"} className="w-full h-full object-contain" alt="" />;
                   })()}
                </div>

                {previewUrl && (
                  <div className="mt-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-2 duration-500">
                     <p className="text-white font-bold text-lg line-clamp-1">{editingItem.title || "Untitled Content"}</p>
                     <div className="flex items-center mt-2 space-x-2">
                        <span className="text-primary text-[8px] px-2 py-0.5 rounded-full border border-primary/30 uppercase tracking-tighter font-black">Sync Ready</span>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{editingItem.category}</p>
                     </div>
                  </div>
                )}
             </div>

             {/* FORM PANEL */}
             <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                   <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-2xl font-bold font-heading text-slate-900">Update Content</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Media Vault Sync</p>
                      </div>
                      <button type="button" onClick={() => setEditingItem(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X className="h-5 w-5" /></button>
                   </div>
                   
                   {modalError && <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold animate-in zoom-in">{modalError}</div>}
                   {modalSuccess && <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-bold animate-in zoom-in flex items-center"><Check className="h-4 w-4 mr-2" /> {modalSuccess}</div>}

                   <form id="edit-media-form" onSubmit={handleEditSubmit} className="space-y-6">
                     <input type="hidden" name="id" value={editingItem.id} />
                     
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Display Title</label>
                        <input 
                          name="title" 
                          defaultValue={editingItem.title || ""} 
                          onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 font-bold shadow-sm" 
                          placeholder="What should users see?"
                          required 
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Content Type</label>
                          <select 
                            name="type" 
                            defaultValue={editingItem.type} 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 font-bold appearance-none shadow-sm"
                          >
                            <option value="image">Static Image</option>
                            <option value="video">Direct Video</option>
                            <option value="link">Social Embed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                          <select 
                            name="category" 
                            defaultValue={editingItem.category || ""}
                            onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 font-bold appearance-none shadow-sm"
                          >
                            <option value="Facilities">Facilities</option>
                            <option value="Events">Events</option>
                            <option value="Environment">Environment</option>
                          </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Source (File override or URL)</label>
                        <div className="flex flex-col space-y-3">
                          <div className="relative group">
                            <input 
                              type="file"
                              name="mediaFile"
                              accept="image/*,video/mp4,video/quicktime,video/webm"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center group-hover:border-primary/50 transition-colors">
                              <UploadCloud className="h-4 w-4 mr-2 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-400">Replace Local Attachment</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input 
                              name="url" 
                              value={previewUrl.startsWith("blob:") ? "" : previewUrl}
                              onChange={(e) => setPreviewUrl(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 font-medium text-xs shadow-sm pr-10" 
                              placeholder="https://... or /images/..."
                            />
                            <div className="absolute right-3 top-3">
                               {previewUrl && !previewUrl.startsWith("blob:") && <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in" />}
                            </div>
                          </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input id="isPublishedCheckbox" type="checkbox" name="isPublished" value="true" defaultChecked={editingItem.isPublished} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Publicly Visible</span>
                        </div>
                     </div>
                   </form>
                </div>

                <div className="mt-8 flex flex-col space-y-3">
                   <Button type="submit" form="edit-media-form" disabled={isSubmitting} className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary-dark transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]">
                      {isSubmitting ? (
                        <div className="flex items-center"><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" /> Syncing...</div>
                      ) : "Confirm Changes"}
                   </Button>
                   <Button type="button" variant="ghost" disabled={isSubmitting} className="w-full h-12 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 transition-all" onClick={() => setEditingItem(null)}>
                      Discard
                   </Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
