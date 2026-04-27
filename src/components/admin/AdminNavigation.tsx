"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Bell, LogOut, Menu, X, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminNavigation({ userName }: { userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Media Manager", href: "/admin/media", icon: ImageIcon },
    { name: "Announcements", href: "/admin/announcements", icon: Bell },
    { name: "Trash", href: "/admin/trash", icon: Trash2 },
  ];

  return (
    <>
      {/* MOBILE HAMBURGER TOGGLE */}
      <div className="md:hidden flex items-center justify-between bg-slate-950 px-4 py-3 h-16 w-full fixed top-0 z-50">
        <span className="text-white font-heading font-bold text-xl tracking-wider text-primary">CRC Admin</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"}`}>
        <div className="h-20 hidden md:flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <span className="text-white font-heading font-bold text-2xl tracking-wider text-primary">CRC Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-white" : "hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export function AdminHeader({ userName }: { userName: string }) {
  return (
    <header className="hidden md:flex h-20 bg-white border-b border-gray-200 items-center justify-between px-8 shadow-sm z-10 w-full shrink-0">
      <h2 className="text-xl font-bold font-heading text-slate-800">Admin Portal</h2>
      <div className="flex items-center space-x-4">
         <span className="text-sm font-medium text-slate-500">Logged in as <strong className="text-slate-800">{userName}</strong></span>
         <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
            {userName.charAt(0)}
         </div>
      </div>
    </header>
  );
}
