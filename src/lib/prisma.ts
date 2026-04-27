import { PrismaClient } from "@prisma/client";

let cachedPrisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!cachedPrisma) {
    try {
      cachedPrisma = new PrismaClient();
    } catch (error) {
      console.warn("[Safe-Mock] Prisma failed to initialize:", error);
      const dbUnavailable = async () => {
        throw new Error("Database unavailable. Check DATABASE_URL and ensure PostgreSQL is running.");
      };
      cachedPrisma = {
        user: { findUnique: async () => null, findMany: async () => [], create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable },
        announcement: { findMany: async () => [], findUnique: async () => null, create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable, count: async () => 0 },
        media: { findMany: async () => [], findUnique: async () => null, findFirst: async () => null, create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable, count: async () => 0 },
        room: { findMany: async () => [], findUnique: async () => null, findFirst: async () => null, create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable, count: async () => 0 },
        dormitory: { findMany: async () => [], findUnique: async () => null, findFirst: async () => null, create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable, count: async () => 0 },
        facility: { findMany: async () => [], findUnique: async () => null, findFirst: async () => null, create: dbUnavailable, update: dbUnavailable, delete: dbUnavailable, count: async () => 0 },
        contactMessage: { create: dbUnavailable, findMany: async () => [], delete: dbUnavailable },
      } as unknown as PrismaClient;
    }
  }
  return cachedPrisma;
}
