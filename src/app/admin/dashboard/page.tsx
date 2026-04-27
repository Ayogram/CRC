import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, MousePointerClick, Image as ImageIcon, DoorOpen, Bell, TrendingUp } from "lucide-react";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

export const metadata = {
  title: "Dashboard | CRC Admin",
};

export default async function AdminDashboardPage() {
  let mediaCount = 0;
  let announcementCount = 0;

  try {
    mediaCount = await prisma.media.count({ where: { isDeleted: false } });
    announcementCount = await prisma.announcement.count({ where: { isDeleted: false } });
  } catch (error) {
    console.warn("DB not ready for dashboard stats", error);
  }

  const stats = [
    { title: "Total Visitors", value: "812", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "WhatsApp Clicks", value: "48", icon: MousePointerClick, color: "text-green-500", bg: "bg-green-100" },
    { title: "Media Uploaded", value: mediaCount.toString(), icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-100" },
    { title: "Active Rooms", value: "12", icon: DoorOpen, color: "text-orange-500", bg: "bg-orange-100" },
    { title: "Announcements", value: announcementCount.toString(), icon: Bell, color: "text-red-500", bg: "bg-red-100" },
    { title: "Conversion Mode", value: "Smart", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the Christian Retreat Centre administration portal.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-0 shadow-sm border-b-4 hover:-translate-y-1 transition-transform border-b-transparent hover:border-b-primary">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`h-14 w-14 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-7 w-7" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY & CHARTS PLACEHOLDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-gray-100">
                {[
                  { text: "New contact message from John Doe", time: "2 hours ago", type: "message" },
                  { text: "Admin updated 'Goshen Ultra' room details", time: "5 hours ago", type: "update" },
                  { text: "New announcement 'Easter Retreat' published", time: "1 day ago", type: "post" },
                  { text: "5 new media files uploaded to gallery", time: "2 days ago", type: "media" },
                ].map((item, i) => (
                  <div key={i} className="p-4 flex items-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-primary mx-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{item.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm flex flex-col items-center justify-center min-h-[300px] bg-slate-50">
           <TrendingUp className="h-16 w-16 text-slate-300 mb-4" />
           <p className="text-slate-500 font-medium text-lg">Analytics Chart Integration</p>
           <p className="text-sm text-slate-400">Visitor traffic visualization will appear here.</p>
        </Card>
      </div>
    </div>
  );
}
