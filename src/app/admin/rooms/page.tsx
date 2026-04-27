import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";

export const metadata = {
  title: "Rooms Management | CRC Admin",
};

export default function AdminRoomsPage() {
  const rooms = [
    { id: 1, name: "Goshen Ultra", type: "Premium Suite", price: "Premium", status: "Active" },
    { id: 2, name: "Bethel", type: "Executive Suite", price: "Executive", status: "Active" },
    { id: 3, name: "12 Bed Dormitory", type: "Dormitory", capacity: 12, status: "Active" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Rooms & Dormitories</h1>
          <p className="text-slate-500 mt-2">Manage accommodation listings, pricing, and media.</p>
        </div>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add New Room
        </Button>
      </div>

      <Card className="border-0 shadow-sm border-t-4 border-primary">
        <CardHeader className="border-b border-gray-100 bg-white">
          <CardTitle>All Accommodations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="px-6 py-4 font-medium text-slate-800">{room.name}</td>
                    <td className="px-6 py-4 text-slate-500">{room.type}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end space-x-2">
                       <Button variant="outline" size="sm" className="h-8 shadow-none border-gray-200">
                         <ImageIcon className="h-4 w-4 mr-1 text-slate-500" /> Media
                       </Button>
                       <Button variant="outline" size="sm" className="h-8 shadow-none border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                         <Edit className="h-4 w-4 mr-1" /> Edit
                       </Button>
                       <Button variant="outline" size="sm" className="h-8 shadow-none border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rooms.length === 0 && (
            <div className="text-center p-8 text-slate-500">No rooms found. Add one to get started.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
