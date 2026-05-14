
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding started...");

  const INITIAL_ROOMS = [
    { name: "Beulah", description: "Comfortable and cozy room perfect for personal retreats and quiet times.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa", "Mini center table", "Tea cup & tray", "Electric jug", "Waste bin"] },
    { name: "Bethel", description: "A beautifully appointed room offering a perfect blend of comfort and peaceful aesthetics.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Sofa", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Electric jug", "Spoon/cup/tray", "Towel", "Waste bin"] },
    { name: "Rehoboth", description: "Expansive and relaxing room offering standard luxury at a great value.", amenities: ["Big bed", "Smart TV", "Refrigerator", "Reading table", "Chair", "Bedside stool", "Wardrobe", "AC", "Mirror", "Water heater", "Luxury restroom", "Sofa/couch", "Waste bin", "Electric jug", "Tea spoon", "Tea cup & tray", "Bedside lamp", "Towel"] },
    { name: "Zion Signature", description: "Our signature experience room with a serene view and premium finishing.", amenities: ["Big bed", "AC", "Refrigerator", "Smart TV", "Mirror", "Luxury restroom", "Bedside lamp", "Center rug", "Reading table & chair", "Intercom", "Couch/sofa", "Mini center table", "Electric kettle", "Tray/cup/spoon", "Extra pillow", "Bed runner", "Wardrobe", "Water heater", "Bedside stool", "Waste bin", "Towel", "Complimentary breakfast", "Access to gazebo"] },
    { name: "Goshen Ultra", description: "Our highest tier suite offering unmatched luxury and space. Designed for executives and special guests.", amenities: ["Microwave", "Suite", "Two ACs", "Complimentary breakfast", "2 bedside lamps", "Couch", "Two sofas", "Two 32-inch TVs", "Center rug", "Access to gazebo"] }
  ];

  for (const item of INITIAL_ROOMS) {
    await prisma.room.upsert({
      where: { name: item.name },
      update: item,
      create: item,
    });
  }

  // Create admin user
  await prisma.user.upsert({
    where: { email: "christianretreatcentrelagos@gmail.com" },
    update: {},
    create: {
      email: "christianretreatcentrelagos@gmail.com",
      password: "Admin@CRC2026",
      name: "System Admin",
      role: "ADMIN"
    }
  });

  console.log("Seeding finished successfully!");
  await prisma.$disconnect();
}

main().catch(console.error);
