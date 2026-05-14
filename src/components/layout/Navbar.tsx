"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Accommodation & Facilities", href: "/accommodation" },
    { name: "Media", href: "/media" },
    { name: "Announcements", href: "/announcements" },
    { name: "About CRC", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <nav className="bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="CRC Logo" className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="hidden lg:flex ml-10 mt-1 space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                  pathname === link.href ? "text-primary bg-primary/10 font-semibold" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/2349069168041"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark hover:scale-105 transition-all shadow-primary/20"
            >
              Book Now
            </a>
          </div>
          
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Animated and more premium */}
      <div 
        className={`lg:hidden absolute w-full bg-background border-b border-border shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-8 space-y-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-lg font-bold transition-all ${
                pathname === link.href 
                  ? "text-primary bg-primary/5 translate-x-2" 
                  : "text-foreground hover:bg-slate-50"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 px-2">
            <a
              href="https://wa.me/2349069168041"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-4 rounded-xl shadow-lg text-lg font-black text-white bg-primary hover:bg-primary-dark transition-transform active:scale-95"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
