"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, X, Eye, Video, Image as ImageIcon, UploadCloud, Check } from "lucide-react";
import { upsertMedia } from "@/app/actions/media";
import { useRouter } from "next/navigation";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/media-utils";

type MediaItem = {
  id: string;
  title?: string | null;
  url: string;
  type: string;
  category?: string | null;
  isPublished: boolean;
};

export function AdminUploadMediaTrigger({ onCreated }: { onCreated?: (item: MediaItem) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Facilities");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [previewBroken, setPreviewBroken] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setPreviewBroken(false);
      if (!title) setTitle(file.name.split('.')[0]);
    }
  };

  const cleanup = () => {
    setIsOpen(false);
    setPreviewUrl("");
    setTitle("");
    setIsSubmitting(false);
    setErrorMsg("");
    setSuccessMsg("");
    setPreviewBroken(false);
  };
  const renderPreview = () => {
    if (!previewUrl) {
      return <div className="text-slate-600 flex flex-col items-center"><Eye className="h-10 w-10 mb-3 opacity-20 animate-pulse" /><span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Awaiting source...</span></div>;
    }

    if (previewUrl.startsWith("blob:")) {
      const isVideo = previewUrl && (document.querySelector('input[name="mediaFile"]') as HTMLInputElement)?.files?.[0]?.type.startsWith("video/");
      if (isVideo) {
        return <video key={previewUrl} src={previewUrl} controls className="w-full h-full object-contain" />;
      }
      return <img key={previewUrl} src={previewUrl} className="w-full h-full object-contain" alt="Preview" />;
    }

    const embedInfo = getEmbedUrl(previewUrl);
    const blockedEmbedHosts = ["instagram", "tiktok", "facebook", "twitter"];
    if (embedInfo?.type && blockedEmbedHosts.includes(embedInfo.type)) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
          <ImageIcon className="h-8 w-8 text-slate-400 mb-3" />
          <p className="text-xs text-slate-200 font-bold uppercase tracking-wide">{embedInfo.type} link detected</p>
          <p className="text-[10px] text-slate-400 mt-1">Live embed may be blocked by host policy.</p>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="mt-3 text-[10px] text-primary underline break-all">
            Open source link
          </a>
        </div>
      );
    }
    if (embedInfo?.embedUrl) {
      return <iframe key={previewUrl} src={embedInfo.embedUrl} className="w-full h-full border-0" allowFullScreen />;
    }

    if (embedInfo?.type === "video" || previewUrl.match(/\.(mp4|mov|webm)$/i)) {
      return <video key={previewUrl} src={previewUrl} controls className="w-full h-full object-contain" />;
    }

    const thumb = getThumbnailUrl(previewUrl);
    if (thumb && (thumb.startsWith("/") || thumb.startsWith("http"))) {
      return (
        <div className="relative w-full h-full">
          {previewBroken ? (
            <div className="text-slate-400 text-xs font-bold h-full w-full flex items-center justify-center">Preview unavailable</div>
          ) : (
            <img key={previewUrl} src={thumb} className="w-full h-full object-contain" alt="" onError={() => setPreviewBroken(true)} />
          )}
          {embedInfo?.type === "link" && <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] px-2 py-1 rounded">External Link Host</div>}
        </div>
      );
    }

    return <div className="text-slate-400 text-xs font-bold">Preview unavailable</div>;
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setIsSubmitting(true);
  setErrorMsg("");
  setSuccessMsg("");

  try {
    const formData = new FormData(e.currentTarget);

    const mediaFile = formData.get("mediaFile") as File;
    if (!mediaFile || mediaFile.size === 0) {
      formData.set("url", previewUrl);
    }

    console.log("Submitting media...");

    const result = await upsertMedia(formData);

    console.log("SERVER RESULT:", result);

    if (result && result.success) {
      setSuccessMsg("Saved to vault.");
      if (result.data) onCreated?.(result.data);
      router.refresh();

      setTimeout(() => {
        cleanup();
      }, 1200);
    } else {
      setErrorMsg(result?.error || "Failed to save media.");
      setIsSubmitting(false);
    }
  } catch (error: unknown) {
    console.error("UPLOAD ERROR:", error);
    setErrorMsg(error instanceof Error ? error.message : "Unexpected error occurred.");
    setIsSubmitting(false);
  }
};

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
        <Plus className="mr-2 h-4 w-4" /> Pulse Upload
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/20">
             
             <div className="md:w-1/2 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden group border-b md:border-b-0 md:border-r border-white/5">
                <div className="absolute top-4 left-4 z-10">
                   <span className="bg-white/10 backdrop-blur-md text-white/70 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-white/5">Pulse Preview</span>
                </div>
                
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 flex items-center justify-center group-hover:ring-primary/30 transition-all duration-500">
                   {renderPreview()}
                </div>
  
                {previewUrl && (
                  <div className="mt-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-2 duration-500">
                     <p className="text-white font-bold text-lg line-clamp-1">{title || "Untitled Preview"}</p>
                     <div className="flex items-center mt-2 space-x-2">
                        <span className="text-primary text-[8px] px-2 py-0.5 rounded-full border border-primary/30 uppercase tracking-tighter font-black">Sync Ready</span>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{category}</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-2xl font-bold font-heading text-slate-900">Media Vault</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cloud Sync Hub</p>
                     </div>
                     <button type="button" onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <X className="h-5 w-5" />
                     </button>
                  </div>
                  
                  {errorMsg && <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold animate-in zoom-in">{errorMsg}</div>}
                  {successMsg && <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl font-bold animate-in zoom-in flex items-center"><Check className="h-4 w-4 mr-2" /> {successMsg}</div>}

                  <form id="pulse-upload-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Display Title</label>
                        <input 
                          name="title" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 font-bold placeholder:text-slate-300 shadow-sm" 
                          placeholder="Event or Scene Title"
                          required 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Type</label>
                          <select name="type" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold shadow-sm">
                            <option value="image">Image</option>
                            <option value="video">Direct Video</option>
                            <option value="link">Social Embed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                          <select 
                            name="category" 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold shadow-sm"
                          >
                            <option value="Facilities">Facilities</option>
                            <option value="Events">Events</option>
                            <option value="Environment">Environment</option>
                          </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Source (File or URL)</label>
                        <div className="flex flex-col space-y-3">
                          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center hover:border-primary/50 transition-colors cursor-pointer group relative">
                            <input 
                              type="file"
                              name="mediaFile"
                              accept="image/*,video/mp4,video/quicktime,video/webm"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors mb-1" />
                            <span className="text-[10px] font-bold text-slate-400">Click to Attach Native File</span>
                          </div>
                          <div className="relative">
                            <input 
                              name="url" 
                              value={previewUrl.startsWith("blob:") ? "" : previewUrl}
                              onChange={(e) => {
                                setPreviewUrl(e.target.value);
                                setPreviewBroken(false);
                              }}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium placeholder:text-slate-300 pr-12 shadow-sm text-sm" 
                              placeholder="Or paste URL" 
                            />
                          </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isPublished" value="true" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 border-2 border-transparent rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                          <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Visibility</span>
                        </div>
                    </div>
                  </form>
                </div>

                <div className="mt-8 flex flex-col space-y-3">
                   <Button type="submit" form="pulse-upload-form" disabled={isSubmitting} className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20">
                      {isSubmitting ? "Saving..." : "Save to Vault"}
                   </Button>
                   <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="w-full h-12 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      Discard Changes
                   </Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
