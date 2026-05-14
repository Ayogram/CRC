import { getPrisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, Phone, User, Calendar, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const prisma = getPrisma();

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function deleteMessage(id: string) {
    "use server";
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Contact Messages</h1>
          <p className="text-slate-500">View and manage messages sent from the contact form.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-full">
           <span className="text-primary font-bold text-sm">{messages.length} Total Messages</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-20 text-center">
            <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No messages found yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <Card key={msg.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{msg.name}</CardTitle>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5">
                       <Calendar className="h-3 w-3 mr-1" />
                       {new Intl.DateTimeFormat('en-US', { 
                         month: 'short', 
                         day: 'numeric', 
                         year: 'numeric', 
                         hour: 'numeric', 
                         minute: '2-digit', 
                         hour12: true 
                       }).format(new Date(msg.createdAt))}
                    </div>
                  </div>
                </div>
                <form action={deleteMessage.bind(null, msg.id)}>
                   <button type="submit" className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                   </button>
                </form>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
