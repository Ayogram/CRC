"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Play, X, Image as ImageIcon, Video, Search, ExternalLink } from "lucide-react";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/media-utils";

export function MediaGallery({ initialMedia }: { initialMedia: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const CATEGORIES = ["All", "Facilities", "Events", "Environment"];

  const filteredMedia = initialMedia.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-6 transition-all duration-300"
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search media..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* GALLERY GRID */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map(media => {
            const embedInfo = media.resolvedMedia || getEmbedUrl(media.url);
            const thumb = getThumbnailUrl(media.url, media.type);
            const isExternal = ["youtube", "instagram", "tiktok", "facebook", "twitter"].includes(embedInfo?.type || "");
            const sourceLabel = isExternal ? embedInfo?.type : null;

            const handleCardClick = () => {
              setSelectedMedia(media);
            };

            return (
              <div 
                key={media.id || media.url || crypto.randomUUID()} 
                className="group relative aspect-video flex-col bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-800"
                onClick={handleCardClick}
              >
                {media.type === "video" || (isExternal && embedInfo?.id) ? (
                  <div className="relative w-full h-full">
                    {embedInfo?.type === "tiktok" ? (
                      <div className="w-full h-full scale-110 overflow-y-auto custom-scrollbar bg-black">
                        <iframe src={`https://www.tiktok.com/embed/v2/${embedInfo.id}`} className="w-full min-h-[750px] border-0" scrolling="no" />
                      </div>
                    ) : embedInfo?.type === "youtube" ? (
                      <iframe src={`https://www.youtube.com/embed/${embedInfo.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embedInfo.id}`} className="w-full h-full border-0 pointer-events-none" scrolling="no" />
                    ) : (
                      <video src={media.url} autoPlay muted loop className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                ) : (
                  <img 
                    src={thumb || "/images/placeholder.jpg"} 
                    alt={media.title || "Media"} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                
                {/* SOURCE BADGE */}
                {sourceLabel && (
                  <div className="absolute top-4 left-4 z-20">
                     <span className="bg-black/60 backdrop-blur-md text-white text-[8px] px-2 py-1 rounded-full uppercase font-black tracking-widest border border-white/10">
                        {sourceLabel}
                     </span>
                  </div>
                )}

                {/* LIGHT OVERLAY ON HOVER - REMOVED DARK GRADIENT AS PER REQUEST */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center text-white mb-2">
                    {media.type === "video" || isExternal ? <Video className="h-4 w-4 mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                    <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-md">{media.category || "General"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-lg">
                    {media.title || "Untitled"}
                  </h3>
                </div>

                {/* PLAY ICON OVERLAY FOR VIDEOS/EXTERNALS */}
                {(media.type === "video" || isExternal) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-primary/90 backdrop-blur-md text-white rounded-full p-4 transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                      {isExternal && embedInfo?.type !== 'youtube' ? <ExternalLink className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">No Matching Results</p>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50 group"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-6xl w-full flex flex-col h-full justify-center">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
              {(() => {
                const embedInfo = selectedMedia.resolvedMedia || getEmbedUrl(selectedMedia.url);
                
                if (embedInfo?.type === "tiktok" && embedInfo.id) {
                  return (
                    <iframe 
                      src={`https://www.tiktok.com/embed/v2/${embedInfo.id}`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  );
                }

                if (selectedMedia.type === "video" || selectedMedia.url.match(/\.(mp4|mov|webm)$/i)) {
                  const mediaUrl = selectedMedia.url.includes('res.cloudinary.com') 
                    ? selectedMedia.url.replace('/upload/', '/upload/q_auto,f_auto/') 
                    : selectedMedia.url;
                  
                  return (
                    <video 
                      key={selectedMedia.url}
                      controls
                      autoPlay
                      muted={true}
                      src={mediaUrl}
                      className="w-full h-full object-contain"
                      ref={(el) => { if (el) el.muted = true; }}
                    />
                  );
                }

                if (embedInfo?.type === "youtube" && embedInfo.id) {
                  return (
                    <iframe 
                      src={`https://www.youtube.com/embed/${embedInfo.id}?autoplay=1`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                if (embedInfo?.type === "instagram" && embedInfo.id) {
                  return (
                    <iframe 
                      src={`https://www.instagram.com/p/${embedInfo.id}/embed`}
                      className="w-full h-full border-0"
                    />
                  );
                }

                return (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.title} 
                    className="w-full h-full object-contain"
                  />
                );
              })()}
            </div>
            <div className="mt-8 flex flex-col items-center text-center">
                <span className="text-primary-light uppercase tracking-[0.2em] text-xs font-bold mb-2">{selectedMedia.category || "Media"}</span>
                <h3 className="text-3xl md:text-4xl font-bold font-heading text-white">{selectedMedia.title || "Untitled"}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
