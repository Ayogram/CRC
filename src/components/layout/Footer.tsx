"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

// Social SVGs
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const TikTokIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tighter text-primary-light">
              CRC
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              A place of peace, comfort, retreats, accommodation, and memorable experiences.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://web.facebook.com/crcikorodu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-light transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/crcikorodu?igsh=MTI1dHU4NHZzYjYxMA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-light transition-colors">
                <span className="sr-only">Instagram</span>
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@christianretreatcentre?_r=1&_d=emh06fb3a909l5&sec_uid=MS4wLjABAAAAi7_XdoTqzvPx19GwPa777fBpb6rql3rX-Ma2MAF07D2elokj__B6exkZ6PDyr3On&share_author_id=7368176337934992389&sharer_language=en&source=h5_m&u_code=e9k77b6gkd3k91&item_author_type=2&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=224E7501-E477-4EB8-ACFD-E93733920EA5&user_id=7273100360154907654&sec_user_id=MS4wLjABAAAA__DHEKnHmlYRMFSu25QoC2xFSs1KVSpfLlTy6UKjqwBM6YFNXjzZWajNIRels4T0&social_share_type=5&ug_btm=b6880,b5836&utm_campaign=client_share&share_app_id=1233" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-light transition-colors">
                <span className="sr-only">TikTok</span>
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-gray-300">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary-light transition-colors">About Us</Link></li>
              <li><Link href="/accommodation" className="hover:text-primary-light transition-colors">Rooms & Facilities</Link></li>
              <li><Link href="/media" className="hover:text-primary-light transition-colors">Gallery</Link></li>
              <li><Link href="/announcements" className="hover:text-primary-light transition-colors">Announcements</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-gray-300">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="flex-shrink-0 h-5 w-5 text-primary-light mt-0.5" />
                <span className="ml-3">1, CRC Close, End of Ago-Iwoye Street, Off Isawo Road, Agric Bus-Stop, Owutu, Ikorodu, Lagos State, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="flex-shrink-0 h-5 w-5 text-primary-light" />
                <span className="ml-3">09069168041</span>
              </li>
              <li className="flex items-center">
                <Mail className="flex-shrink-0 h-5 w-5 text-primary-light" />
                <span className="ml-3">christianretreatcentrelagos@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} Christian Retreat Centre. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
