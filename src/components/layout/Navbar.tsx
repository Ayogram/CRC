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
          
          <div className="hidden md:flex ml-10 mt-1 space-x-1">
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
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background shadow-xl absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href ? "text-primary bg-primary/10 font-bold" : "text-foreground hover:bg-primary/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/2349069168041"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full text-center px-6 py-3 rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
