"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Sparkles, 
  Gem, 
  Projector, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Play,
  X
} from "lucide-react";
import { HeroSlider } from "@/components/ui/HeroSlider";

// Use improved icons for features
const features = [
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777322805/crc_production_assets/media__1776271813071.jpg", title: "Peaceful Environment", desc: "A serene atmosphere perfectly suited for retreats and relaxation." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777322793/crc_production_assets/crclux.jpg", title: "Luxury Rooms", desc: "Premium comfort designed for singles, couples, and groups." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777322796/crc_production_assets/events.jpg", title: "Event Halls", desc: "Spacious areas for meetings, spiritual gatherings, and celebrations." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777323129/crc_production_assets/secured.jpg", title: "Secure Environment", desc: "24/7 top-notch security for your complete peace of mind." },
];

const rooms = [
  { name: "Goshen Ultra", price: "Premium", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777317041/crc_production_assets/goshen_ultra.mp4?v=1.1", desc: "Our highest tier suite with exclusive amenities." },
  { name: "Bethel", price: "Executive", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777317599/crc_production_assets/Bethel.mov?v=1.1", desc: "Spacious and elegant accommodation." },
  { name: "Zion Signature", price: "Deluxe", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777318481/crc_production_assets/Zionssignature.mov?v=1.1", desc: "A signature experience with premium finishing." },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const HomeVideoCard = ({ url, name, price, onClick, offset = "so_3" }: { url: string, name: string, price: string, onClick: () => void, offset?: string }) => {
    // Better regex to handle query parameters
    // Use the provided offset for an "attracting" preview frame
    const placeholder = url.split('?')[0].replace('/upload/', `/upload/${offset}/`).replace(/\.(mp4|mov|webm|mov)$/i, '.jpg');

    return (
      <div 
        className="block relative h-64 overflow-hidden bg-slate-100 group cursor-pointer"
        onClick={onClick}
      >
        <img 
          src={placeholder} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/30">
          <div className="bg-white/90 backdrop-blur rounded-full p-4 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
            <Play className="h-6 w-6 text-primary fill-current" />
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur pb-1 px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-lg z-10">
          {price}
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Watch Video
        </div>
      </div>
    );
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <HeroSlider />
        
        <div className="relative z-10 text-center px-4 max-w-screen-xl mx-auto flex flex-col items-center">
          <span className="text-[#8DC63F] font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Welcome to Christian Retreat Centre
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-white mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Making your experience <span className="text-[#8DC63F]">wonderful</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            A place of peace, comfort, retreats, accommodation, and memorable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" className="h-12 px-10 rounded-full bg-[#8DC63F] hover:bg-[#7db137] text-white font-bold shadow-lg" asChild>
              <a href="https://wa.me/2349069168041" target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-10 rounded-full text-white border-white hover:bg-white/10 font-bold backdrop-blur-sm" asChild>
              <Link href="/accommodation">Explore Facilities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5 group">
              <img 
                src="/images/crc1.jpg" 
                alt="CRC Gazebo Facility" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center">
                <span className="w-10 h-[2px] bg-primary mr-4"></span> About Us
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-8 tracking-tight leading-tight">
                Discover a Haven of <span className="text-primary underline decoration-primary/20 underline-offset-8">Divine Peace</span>
              </h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Christian Retreat Centre is a premier destination for spiritual growth, relaxation, and memorable experiences in the heart of Lagos, Nigeria.
              </p>
              <ul className="space-y-6 mb-12">
                {['Serene & spiritually uplifting environment', 'Luxurious and comfortable rooms', 'State-of-the-art event halls', 'Family & children friendly spaces'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-bold">
                    <div className="bg-primary/10 p-1.5 rounded-full mr-4">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" className="h-14 px-8 rounded-2xl" asChild>
                <Link href="/about">Read Our Full Story <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-20 tracking-tight">Why Choose CRC</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-white border-0 overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 group cursor-pointer rounded-[2rem]">
                <div className="h-56 w-full overflow-hidden relative">
                  <img 
                    src={feature.img} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <CardHeader className="pt-8 pb-2 text-center">
                  <CardTitle className="text-lg font-bold font-heading text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8 px-6">
                  <CardDescription className="text-slate-500 leading-relaxed text-sm">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Premium Accommodation</h2>
              <p className="text-slate-600">Experience luxury and comfort in our meticulously designed rooms and suites.</p>
            </div>
            <Button variant="outline" className="border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F] hover:text-white rounded-lg px-6 h-10 transition-all font-bold" asChild>
              <Link href="/accommodation">View All Rooms</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {rooms.map((room, idx) => {
              const customOffset = room.name.includes("Goshen") ? "so_22" : room.name.includes("Zion") ? "so_10" : "so_3";
              return (
                <Card key={idx} className="group overflow-hidden border-0 shadow-2xl shadow-slate-100 hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] bg-white">
                  {room.type === "video" ? (
                    <HomeVideoCard url={room.url} name={room.name} price={room.price} onClick={() => setSelectedVideo(room.url)} offset={customOffset} />
                  ) : (
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img 
                        src={room.url} 
                        alt={room.name} 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur pb-1 px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-lg">
                        {room.price}
                      </div>
                    </div>
                  )}
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{room.name}</CardTitle>
                    <CardDescription className="text-slate-500 leading-relaxed">{room.desc}</CardDescription>
                  </CardHeader>
                  <CardFooter className="px-8 pb-8 pt-0">
                    <Button className="w-full h-12 rounded-xl bg-[#8DC63F] hover:bg-[#7db137] text-white font-bold shadow-md" asChild>
                      <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(room.name)}%20at%20Christian%20Retreat%20Centre.`} target="_blank" rel="noopener noreferrer">
                        Book on WhatsApp
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-r from-[#1a2a1a] to-[#4a6a2a] flex items-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Ready to book your stay or event?</h2>
          <p className="text-sm md:text-base text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Contact our dedicated hospitality team to arrange your perfect retreat experience.
          </p>
          <Button size="lg" className="bg-white text-[#4a6a2a] hover:bg-slate-100 px-8 h-12 rounded-full text-sm font-bold shadow-xl" asChild>
             <a href="https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20make%20an%20enquiry%20about%20Christian%20Retreat%20Centre." target="_blank" rel="noopener noreferrer">
                Contact Us Now on WhatsApp
             </a>
          </Button>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50 group"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-5xl w-full">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              <video 
                src={selectedVideo.replace('/upload/', '/upload/q_auto,f_auto/')} 
                poster={selectedVideo.replace('/upload/', '/upload/so_3/').replace(/\.(mp4|mov|webm|mov)$/i, '.jpg')}
                autoPlay 
                loop 
                muted
                controls
                playsInline 
                preload="auto"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
