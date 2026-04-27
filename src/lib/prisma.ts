import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let cachedPrisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!cachedPrisma) {
    try {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL is not set.");
      }
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      cachedPrisma = new PrismaClient({ adapter });
    } catch (error) {
      console.warn("[Safe-Mock] Prisma failed to initialize (database offline or misconfigured):", error);
      const dbUnavailable = async () => {
        throw new Error("Database unavailable. Check DATABASE_URL and ensure PostgreSQL is running.");
      };
      // Keep readonly fallbacks for non-critical pages, but never fake writes.
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
