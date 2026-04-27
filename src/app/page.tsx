import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Sparkles, 
  Gem, 
  Projector, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { HeroSlider } from "@/components/ui/HeroSlider";

// Use improved icons for features
const features = [
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777322161/crc_production_assets/media__1776271813071.jpg", title: "Peaceful Environment", desc: "A serene atmosphere perfectly suited for retreats and relaxation." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777316930/crc_production_assets/crc4.jpg", title: "Luxury Rooms", desc: "Premium comfort designed for singles, couples, and groups." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777316922/crc_production_assets/crc1.jpg", title: "Event Halls", desc: "Spacious areas for meetings, spiritual gatherings, and celebrations." },
  { img: "https://res.cloudinary.com/didymerkz/image/upload/v1777316926/crc_production_assets/crc2.jpg", title: "Secure Environment", desc: "24/7 top-notch security for your complete peace of mind." },
];

const rooms = [
  { name: "Goshen Ultra", price: "Premium", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777317041/crc_production_assets/goshen_ultra.mp4", desc: "Our highest tier suite with exclusive amenities." },
  { name: "Bethel", price: "Executive", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777317599/crc_production_assets/Bethel.mov", desc: "Spacious and elegant accommodation." },
  { name: "Zion Signature", price: "Deluxe", type: "video", url: "https://res.cloudinary.com/didymerkz/video/upload/v1777318481/crc_production_assets/Zionssignature.mov", desc: "A signature experience with premium finishing." },
];

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <HeroSlider />
        
        <div className="relative z-10 text-center px-4 max-w-4xl max-w-screen-xl mx-auto flex flex-col items-center">
          <span className="text-primary-light font-medium tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Welcome to Christian Retreat Centre
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Making your experience <span className="text-primary">wonderful</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            A place of peace, comfort, retreats, accommodation, and memorable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" asChild>
              <a href="https://wa.me/2349069168041" target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black" asChild>
              <Link href="/accommodation">Explore Facilities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] group">
              <img 
                src="/images/crc1.jpg" 
                alt="CRC Gazebo Facility" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">
                Discover a Haven of <span className="text-primary">Peace</span> & <span className="text-primary">Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Christian Retreat Centre is a peaceful destination for retreats, accommodation, meetings, celebrations, family relaxation, spiritual gatherings, and memorable experiences in the heart of Lagos, Nigeria.
              </p>
              <ul className="space-y-4 mb-8">
                {['Serene & spiritually uplifting environment', 'Luxurious and comfortable rooms', 'State-of-the-art event halls', 'Family & children friendly spaces'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/about">Read Our Story <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-12">Why Choose CRC</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-white border-0 overflow-hidden shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    src={feature.img} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <CardHeader className="pt-6 pb-2 text-center">
                  <CardTitle className="text-xl font-bold font-heading text-slate-800 group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Premium Accommodation</h2>
              <p className="text-gray-500 max-w-2xl text-lg">Experience luxury and comfort in our meticulously designed rooms and suites.</p>
            </div>
            <Button variant="outline" className="hidden md:flex" asChild>
              <Link href="/accommodation">View All Rooms</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rooms.map((room, idx) => (
              <Card key={idx} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  {room.type === "video" ? (
                    <video 
                      src={room.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <img 
                      src={room.url} 
                      alt={room.name} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur pb-1 px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                    {room.price}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{room.name}</CardTitle>
                  <CardDescription className="text-base">{room.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex gap-3">
                  <Button className="w-full" asChild>
                    <a href={`https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(room.name)}%20at%20Christian%20Retreat%20Centre.%20Please%20share%20availability%20and%20price.`} target="_blank" rel="noopener noreferrer">
                      Book on WhatsApp
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden bg-black flex items-center">
        {/* Parallax background effect with real image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://res.cloudinary.com/didymerkz/image/upload/v1777322161/crc_production_assets/media__1776271813071.jpg" 
             alt="Luxury Stay" 
             className="w-full h-full object-cover opacity-40 fixed mix-blend-overlay"
             style={{ backgroundAttachment: 'fixed' }} // Simulated simple parallax
           />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-primary-dark/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Ready to book your stay or event?</h2>
          <p className="text-lg md:text-xl text-primary-light mb-10 max-w-2xl mx-auto">
            Contact our dedicated hospitality team to arrange your perfect retreat experience.
          </p>
          <Button size="lg" className="bg-white text-primary-dark hover:bg-gray-100 hover:scale-105 transition-transform px-8 h-14 text-lg" asChild>
             <a href="https://wa.me/2349069168041?text=Hello,%20I%20would%20like%20to%20make%20an%20enquiry%20about%20Christian%20Retreat%20Centre." target="_blank" rel="noopener noreferrer">
                Contact Us Now on WhatsApp
             </a>
          </Button>
        </div>
      </section>
    </>
  );
}
