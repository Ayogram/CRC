import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNavigation, AdminHeader } from "@/components/admin/AdminNavigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/admin/media");
  }

  const userName = session?.user?.name || "Administrator";

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased text-gray-900 overflow-hidden">
      
      <AdminNavigation userName={userName} />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col md:overflow-hidden pt-16 md:pt-0 h-screen overflow-y-auto">
        <AdminHeader userName={userName} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
}

function Image(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  );
}
