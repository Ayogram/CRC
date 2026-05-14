
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
// No arguments, let it find DATABASE_URL from process.env
const prisma = new PrismaClient();

const INITIAL_MEDIA = [
  { title: "Annual Convention", category: "Events", type: "image", url: "/images/events.jpg", isPublished: true },
  { title: "Serene Garden", category: "Environment", type: "image", url: "/images/media__1776271813071.jpg", isPublished: true },
  { title: "Convention Hall", category: "Events", type: "image", url: "/images/media__1776271649661.jpg", isPublished: true },
];

const INITIAL_ROOMS = [
  { name: "Beulah", description: "Comfortable and cozy room perfect for personal retreats and quiet times.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa", "Mini center table", "Tea cup & tray", "Electric jug", "Waste bin"] },
  { name: "Bethel", description: "A beautifully appointed room offering a perfect blend of comfort and peaceful aesthetics.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Sofa", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Electric jug", "Spoon/cup/tray", "Towel", "Waste bin"] },
  { name: "Rehoboth", description: "Expansive and relaxing room offering standard luxury at a great value.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa/couch", "Waste bin", "Electric jug", "Tea spoon", "Tea cup & tray", "Bedside lamp", "Towel"] },
  { name: "Zion Signature", description: "Our signature experience room with a serene view and premium finishing.", amenities: ["Big bed", "AC", "Refrigerator", "Smart TV", "Mirror", "Luxury restroom", "Bedside lamp", "Center rug", "Reading table & chair", "Intercom", "Couch/sofa", "Mini center table", "Electric kettle", "Tray/cup/spoon", "Extra pillow", "Bed runner", "Wardrobe", "Water heater", "Bedside stool", "Waste bin", "Towel", "Complimentary breakfast", "Access to gazebo"] },
  { name: "Goshen Ultra", description: "Our highest tier suite offering unmatched luxury and space. Designed for executives and special guests.", amenities: ["Microwave", "Suite", "Two ACs", "Complimentary breakfast", "2 bedside lamps", "Couch", "Two sofas", "Two 32-inch TVs", "Center rug", "Access to gazebo"] }
];

const INITIAL_DORMS = [
  { 
    name: "12 Bed Dormitory", 
    capacity: 12, 
    description: "Comfortable shared lodging designed for smaller groups, retreats, workers, and team stays.", 
    details: ["Sleeps up to 12 guests", "Spacious sleeping arrangement", "Secure and clean environment", "Ideal for church groups and retreats", "Well ventilated", "Convenient access to facilities"],
    mediaUrls: ["/images/12beddom.MOV"] 
  },
  { 
    name: "24 Bed Dormitory", 
    capacity: 24, 
    description: "Large-capacity group accommodation perfect for camps, conferences, and large team lodging.", 
    details: ["Sleeps up to 24 guests", "Organized sleeping layout", "Great for large church groups", "Safe and comfortable environment", "Easy access to restrooms and venue facilities", "Budget-friendly group stay option"],
    mediaUrls: ["/images/24beddom.MOV"] 
  }
];

const INITIAL_FACILITIES = [
  { 
    name: "Victory Hall", 
    description: "A grand hall suitable for major conferences, church services, and grand receptions.", 
    details: [
      "Professional PA sound system", 
      "Crown CX18 subwoofers", 
      "Toppro KS215 3-way passive speakers", 
      "Peavey PV215D powered enclosures", 
      "Deep bass, clear vocals, and high-volume sound coverage"
    ],
    mediaUrls: ["/images/victory.mp4"], 
    category: "Halls" 
  },
  { 
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
    mediaUrls: ["/images/redemption.mp4"], 
    category: "Halls" 
  },
  { name: "Children Playground", description: "A safe, fun, and engaging outdoor space for children's activities.", details: ["Safe environment", "Interactive play sets", "Supervised area"], mediaUrls: ["/images/childrenplayground.MP4"], category: "Outdoor" },
  { name: "Garden", description: "Beautifully landscaped serene garden perfect for outdoor relaxation.", details: ["Serene atmosphere", "Beautiful landscaping", "Great for photography"], mediaUrls: ["/images/media__1776271813071.jpg"], category: "Outdoor" },
  { 
    name: "Reception Area", 
    description: "A stylish and welcoming reception space designed to receive guests in comfort and elegance.", 
    details: ["Premium waiting lounge atmosphere", "Beautiful modern interior finish", "Great first impression", "Comfortable seating area", "Suitable for check-ins"],
    mediaUrls: ["/images/receptionareas.mp4"], 
    category: "Indoor" 
  }
];

async function main() {
  console.log("Seeding started...");

  for (const item of INITIAL_MEDIA) {
    await prisma.media.create({ data: item });
  }

  for (const item of INITIAL_ROOMS) {
    await prisma.room.create({ data: item });
  }

  for (const item of INITIAL_DORMS) {
    await prisma.dormitory.create({ data: item });
  }

  for (const item of INITIAL_FACILITIES) {
    await prisma.facility.create({ data: item });
  }

  // Create admin user
  await prisma.user.create({
    data: {
      email: "christianretreatcentrelagos@gmail.com",
      password: "Admin@CRC2026",
      name: "System Admin",
      role: "ADMIN"
    }
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
