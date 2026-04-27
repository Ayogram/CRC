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
            const embedInfo = getEmbedUrl(media.url);
            const thumb = getThumbnailUrl(media.url, media.type);
            const isExternal = ["youtube", "instagram", "tiktok", "facebook"].includes(embedInfo?.type || "");

            return (
              <div 
                key={media.id || media.url || crypto.randomUUID()} 
                className="group relative aspect-video flex-col bg-slate-100 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100"
                onClick={() => setSelectedMedia(media)}
              >
                {media.type === "video" && !thumb ? (
                  <video 
                    key={media.url}
                    autoPlay 
                    loop 
                    muted={!media.url.includes("childrenplayground")} 
                    playsInline 
                    src={media.url}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                ) : (
                  <img 
                    src={thumb || "/images/placeholder.jpg"} 
                    alt={media.title || "Media"} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                
                {/* DARK OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center text-primary-light mb-2">
                    {media.type === "video" || isExternal ? <Video className="h-4 w-4 mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                    <span className="text-xs font-bold uppercase tracking-widest">{media.category || "General"}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {media.title || "Untitled"}
                  </h3>
                </div>

                {/* PLAY ICON OVERLAY FOR VIDEOS/EXTERNALS */}
                {(media.type === "video" || isExternal) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/20 backdrop-blur-md text-white rounded-full p-5 transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 ring-1 ring-white/30">
                      {isExternal ? <ExternalLink className="h-8 w-8" /> : <Play className="h-8 w-8 fill-current" />}
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
                const embedInfo = getEmbedUrl(selectedMedia.url);
                
                if (embedInfo?.type === "video") {
                  return (
                    <video 
                      key={selectedMedia.url}
                      controls
                      muted 
                      playsInline 
                      preload="metadata"
                      src={selectedMedia.url}
                      className="w-full h-full object-contain"
                    />
                  );
                }

                if (embedInfo?.embedUrl) {
                  return (
                    <iframe 
                      src={embedInfo.embedUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
