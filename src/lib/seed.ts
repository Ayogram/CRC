import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

export const INITIAL_MEDIA = [
  { id: "media-1", title: "Annual Convention", category: "Events", type: "image", url: "/images/events.jpg" },
  { id: "media-2", title: "Serene Garden", category: "Environment", type: "image", url: "/images/media__1776271813071.jpg" },
  { id: "media-3", title: "Convention Hall", category: "Events", type: "image", url: "/images/media__1776271649661.jpg" },
];

export const INITIAL_ROOMS = [
  { id: "room-beulah", name: "Beulah", description: "Comfortable and cozy room perfect for personal retreats and quiet times.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa", "Mini center table", "Tea cup & tray", "Electric jug", "Waste bin"] },
  { id: "room-bethel", name: "Bethel", description: "A beautifully appointed room offering a perfect blend of comfort and peaceful aesthetics.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Sofa", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Electric jug", "Spoon/cup/tray", "Towel", "Waste bin"] },
  { id: "room-rehoboth", name: "Rehoboth", description: "Expansive and relaxing room offering standard luxury at a great value.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa/couch", "Waste bin", "Electric jug", "Tea spoon", "Tea cup & tray", "Bedside lamp", "Towel"] },
  { id: "room-zionsignature", name: "Zion Signature", description: "Our signature experience room with a serene view and premium finishing.", amenities: ["Big bed", "AC", "Refrigerator", "Smart TV", "Mirror", "Luxury restroom", "Bedside lamp", "Center rug", "Reading table & chair", "Intercom", "Couch/sofa", "Mini center table", "Electric kettle", "Tray/cup/spoon", "Extra pillow", "Bed runner", "Wardrobe", "Water heater", "Bedside stool", "Waste bin", "Towel", "Complimentary breakfast", "Access to gazebo"] },
  { id: "room-goshenultra", name: "Goshen Ultra", description: "Our highest tier suite offering unmatched luxury and space. Designed for executives and special guests.", amenities: ["Microwave", "Suite", "Two ACs", "Complimentary breakfast", "2 bedside lamps", "Couch", "Two sofas", "Two 32-inch TVs", "Center rug", "Access to gazebo"] }
];

export const INITIAL_DORMS = [
  { 
    id: "dorm-12", 
    name: "12 Bed Dormitory", 
    capacity: 12, 
    description: "Comfortable shared lodging designed for smaller groups, retreats, workers, and team stays.", 
    details: ["Sleeps up to 12 guests", "Spacious sleeping arrangement", "Secure and clean environment", "Ideal for church groups and retreats", "Well ventilated", "Convenient access to facilities"],
    mediaUrls: ["https://res.cloudinary.com/didymerkz/video/upload/v1777321591/crc_production_assets/12beddom.mp4"] 
  },
  { 
    id: "dorm-24", 
    name: "24 Bed Dormitory", 
    capacity: 24, 
    description: "Large-capacity group accommodation perfect for camps, conferences, and large team lodging.", 
    details: ["Sleeps up to 24 guests", "Organized sleeping layout", "Great for large church groups", "Safe and comfortable environment", "Easy access to restrooms and venue facilities", "Budget-friendly group stay option"],
    mediaUrls: ["/images/24beddom.MOV"] 
  }
];

export const INITIAL_FACILITIES = [
  { 
    id: "fac-victory", 
    name: "Victory Hall", 
    description: "A grand hall suitable for major conferences, church services, and grand receptions.", 
    details: [
      "Professional PA sound system", 
      "Crown CX18 subwoofers", 
      "Toppro KS215 3-way passive speakers", 
      "Peavey PV215D powered enclosures", 
      "Deep bass, clear vocals, and high-volume sound coverage"
    ],
    mediaUrls: ["https://res.cloudinary.com/didymerkz/video/upload/v1777322161/crc_production_assets/victory.mp4"], 
    category: "Halls" 
  },
  { 
    id: "fac-redemption", 
    name: "Redemption Hall", 
    description: "A premium event venue designed for elegant celebrations, conferences, worship programs, and high-class gatherings.", 
    details: [
      "Crown CX18 18\" subwoofers (1,200W RMS / 2,400W peak)", 
      "Toppro KS215 3-way speakers (3,000W program)", 
      "Peavey PV215D powered enclosures (2,500W max)",
      "Professional amplifiers and DJ-ready flight cases",
      "Beam 230 moving head lights", 
      "LED par can lights & aluminium truss lighting rig", 
      "Large crystal chandelier & recessed ceiling downlights", 
      "16 floor-standing AC units (1.5HP each)", 
      "Frost machine available for atmosphere", 
      "Two (2) 52-inch TVs for presentations & live viewing"
    ],
    mediaUrls: ["https://res.cloudinary.com/didymerkz/video/upload/v1777322187/crc_production_assets/redemption.mp4"], 
    category: "Halls" 
  },
  { id: "fac-playground", name: "Children Playground", description: "A safe, fun, and engaging outdoor space for children's activities.", details: ["Safe environment", "Interactive play sets", "Supervised area"], mediaUrls: ["https://res.cloudinary.com/didymerkz/video/upload/v1777322223/crc_production_assets/childrenplayground.mp4"], category: "Outdoor" },
  { id: "fac-garden", name: "Garden", description: "Beautifully landscaped serene garden perfect for outdoor relaxation.", details: ["Serene atmosphere", "Beautiful landscaping", "Great for photography"], mediaUrls: ["https://res.cloudinary.com/didymerkz/image/upload/v1777316922/crc_production_assets/media__1776271813071.jpg"], category: "Outdoor" },
  { 
    id: "fac-reception", 
    name: "Reception Area", 
    description: "A stylish and welcoming reception space designed to receive guests in comfort and elegance.", 
    details: ["Premium waiting lounge atmosphere", "Beautiful modern interior finish", "Great first impression", "Comfortable seating area", "Suitable for check-ins"],
    mediaUrls: ["https://res.cloudinary.com/didymerkz/video/upload/v1777322249/crc_production_assets/receptionareas.mp4"], 
    category: "Indoor" 
  }
];

export async function seedMedia() {
  console.log("Seeding site data...");
  
  for (const item of INITIAL_MEDIA) {
    const exists = await prisma.media.findFirst({ where: { url: item.url } });
    if (!exists) {
      // Need to omit id to let prisma generate it or use standard creation
      const { id, ...data } = item;
      await prisma.media.create({ data });
    }
  }

  for (const item of INITIAL_ROOMS) {
    const exists = await prisma.room.findFirst({ where: { name: item.name } });
    if (!exists) {
      const { id, ...data } = item;
      await prisma.room.create({ data });
    } else {
      // Update amenities and descriptions forcefully to sync new changes
      const { id, ...data } = item;
      await prisma.room.update({ where: { name: item.name }, data });
    }
  }

  for (const item of INITIAL_DORMS) {
    const exists = await prisma.dormitory.findFirst({ where: { name: item.name } });
    if (!exists) {
      const { id, ...data } = item;
      await prisma.dormitory.create({ data });
    } else {
      const { id, ...data } = item;
      await prisma.dormitory.update({ where: { id: exists.id }, data });
    }
  }

  for (const item of INITIAL_FACILITIES) {
    const exists = await prisma.facility.findFirst({ where: { name: item.name } });
    if (!exists) {
      const { id, ...data } = item;
      await prisma.facility.create({ data });
    } else {
       const { id, ...data } = item;
       await prisma.facility.update({ where: { id: exists.id }, data });
    }
  }

  return true;
}
