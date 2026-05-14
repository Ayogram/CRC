"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, X, Image as ImageIcon, Check, Video } from "lucide-react";
import { upsertAnnouncement } from "@/app/actions/announcements";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getEmbedUrl } from "@/lib/media-utils";
import { resolveSocialUrl } from "@/app/actions/resolve-url";

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
  const [resolvedEmbed, setResolvedEmbed] = useState<{ type: string, id: string } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    const handleResolve = async () => {
      if (!previewUrl || previewUrl.startsWith("blob:")) {
        setResolvedEmbed(null);
        return;
      }

      // Check direct first
      const direct = getEmbedUrl(previewUrl);
      if (direct?.id) {
        setResolvedEmbed({ type: direct.type, id: direct.id });
        return;
      }

      // Check if it's a short link or mobile link that needs resolving
      if (previewUrl.includes("tiktok.com") || previewUrl.includes("vt.tiktok.com") || previewUrl.includes("bit.ly") || previewUrl.includes("t.co")) {
        setIsResolving(true);
        const result = await resolveSocialUrl(previewUrl);
        if (result && result.id) {
          setResolvedEmbed({ type: result.type || 'tiktok', id: result.id });
        }
        setIsResolving(false);
      }
    };
    handleResolve();
  }, [previewUrl]);
  const [titlePreview, setTitlePreview] = useState("");
  const [contentPreview, setContentPreview] = useState("");
  const [categoryPreview, setCategoryPreview] = useState("General");
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
    setCategoryPreview("General");
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
    
    // Safety check: if previewUrl is a blob (from file upload), 
    // clear the featuredImg text field so server doesn't get a blob URL string
    const featuredImgText = formData.get("featuredImg") as string;
    if (featuredImgText && featuredImgText.startsWith("blob:")) {
      formData.set("featuredImg", "");
    }

    try {
      const result = await upsertAnnouncement(formData);
      if (result?.success) {
        setSuccessMsg("Announcement successfully published to the pulse feed.");
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

  const renderLivePreviewMedia = () => {
    if (!previewUrl) return <ImageIcon className="h-10 w-10 opacity-20 text-slate-400" />;
    
    if (isResolving) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-primary p-4">
           <Plus className="h-8 w-8 animate-spin mb-2" />
           <span className="text-[10px] font-black uppercase tracking-widest">Resolving Social Link...</span>
        </div>
      );
    }

    if (resolvedEmbed) {
       if (resolvedEmbed.type === "tiktok") {
         return (
           <iframe 
             src={`https://www.tiktok.com/embed/v2/${resolvedEmbed.id}`}
             className="w-full h-full border-0"
             allowFullScreen
             allow="autoplay; encrypted-media"
           />
         );
       }
       if (resolvedEmbed.type === "youtube") {
         return (
           <iframe 
             src={`https://www.youtube.com/embed/${resolvedEmbed.id}?autoplay=1&mute=1&loop=1&playlist=${resolvedEmbed.id}`}
             className="w-full h-full border-0"
             allow="autoplay; encrypted-media"
             allowFullScreen
           />
         );
       }
       if (resolvedEmbed.type === "instagram") {
         return (
           <iframe 
             src={`https://www.instagram.com/p/${resolvedEmbed.id}/embed`}
             className="w-full h-full border-0"

           />
         );
       }
    }

    if (fileType === "video") {
      return <video src={previewUrl} autoPlay muted loop className="w-full h-full object-cover" />;
    }
    
    const embed = getEmbedUrl(previewUrl);
    if (embed?.type && ["youtube", "instagram", "tiktok", "facebook"].includes(embed.type)) {
      if (embed.type === "facebook") {
        return (
          <iframe 
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(previewUrl)}&show_text=0&width=560`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        );
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-primary p-4 text-center">
          <Video className="h-8 w-8 mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{embed.type} Content Detected</span>
        </div>
      );
    }

    return (
      <img
        src={previewUrl}
        alt="Preview"
        className="w-full h-full object-cover"
        onError={() => setPreviewBroken(true)}
      />
    );
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
        <Plus className="mr-2 h-4 w-4" /> New Announcement
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden border border-white/20 flex flex-col md:flex-row max-h-[90vh]">
             
             {/* LEFT SIDE: PREMIUM LIVE PREVIEW CARD */}
             <div className="md:w-[40%] bg-slate-50 p-8 flex flex-col border-r border-slate-100 overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Pulse Live Preview</span>
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col group transition-all duration-500 hover:shadow-primary/5">
                   <div className="relative h-56 bg-slate-200 overflow-hidden flex items-center justify-center">
                      {renderLivePreviewMedia()}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                        {categoryPreview}
                      </div>
                   </div>
                   <div className="p-8 flex flex-col flex-grow">
                      <h4 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight tracking-tight">{titlePreview || "Your Headline Here"}</h4>
                      <p className="text-sm text-slate-500 line-clamp-5 leading-relaxed italic mb-8">
                        {contentPreview || "Type your announcement content to see it appear here in real-time..."}
                      </p>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                               <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Ready</span>
                         </div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PREVIEW</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* RIGHT SIDE: FORM */}
             <div className="md:w-[60%] p-8 lg:p-12 overflow-y-auto bg-white flex flex-col">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <h3 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Deploy Bulletin</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mt-1">Cloud Stream Interface</p>
                   </div>
                   <button type="button" onClick={() => setIsOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                      <X className="h-6 w-6" />
                   </button>
                </div>
                
                <form id="announcement-form" onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl font-bold animate-in zoom-in">{errorMsg}</div>}
                  {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-2xl font-bold animate-in zoom-in flex items-center"><Check className="h-4 w-4 mr-2" /> {successMsg}</div>}

                  <div className="grid grid-cols-2 gap-6">
                     <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Bulletin Headline</label>
                        <input
                          name="title"
                          value={titlePreview}
                          onChange={(e) => setTitlePreview(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm"
                          placeholder="Catchy & descriptive title"
                          required
                        />
                     </div>
                     
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Stream Category</label>
                        <select 
                          name="category" 
                          value={categoryPreview}
                          onChange={(e) => setCategoryPreview(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 shadow-sm"
                        >
                          <option value="General">General</option>
                          <option value="Program">Program</option>
                          <option value="Event">Event</option>
                          <option value="Notice">Notice</option>
                        </select>
                     </div>
                     
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Pulse State</label>
                        <select name="status" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 shadow-sm">
                          <option value="DRAFT">Draft (Internal)</option>
                          <option value="PUBLISHED">Published (Live)</option>
                        </select>
                     </div>

                     <div className="col-span-2 space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Visual Media Attachment</label>
                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="relative group">
                              <input 
                                type="file" 
                                name="featuredImgFile" 
                                accept="image/*,video/mp4,video/quicktime,video/webm"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="w-full h-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-primary group-hover:bg-primary/[0.02] transition-all bg-slate-50/50">
                                 <Plus className="h-5 w-5 text-slate-300 group-hover:text-primary mb-1" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Device File</span>
                              </div>
                           </div>
                           
                           <div className="relative">
                              <input 
                                name="featuredImg" 
                                value={previewUrl.startsWith("blob:") ? "" : previewUrl}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  setPreviewUrl(url);
                                  setPreviewBroken(false);
                                  if (url.match(/\.(mp4|mov|webm)$/i)) setFileType("video");
                                  else setFileType("image");
                                }}
                                className="w-full h-full px-6 py-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-medium placeholder:text-slate-300 shadow-sm" 
                                placeholder="External URL / Link" 
                              />
                           </div>
                        </div>
                     </div>

                     <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Bulletin Content</label>
                        <textarea
                          name="content"
                          rows={4}
                          value={contentPreview}
                          onChange={(e) => setContentPreview(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none"
                          placeholder="Tell the full story here..."
                          required
                        />
                     </div>
                     
                  </div>
                </form>
                
                <div className="mt-auto pt-10 flex flex-col space-y-4">
                   <Button type="submit" form="announcement-form" disabled={isSubmitting} className="w-full h-16 text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all font-bold">
                      {isSubmitting ? "Syncing..." : "Pulse Announcement"}
                   </Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
