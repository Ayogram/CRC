import NextAuth from "next-auth";
import { getPrisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = getPrisma();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      ...authConfig.providers[0] as any,
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Hardcoded fallback
        if (
          credentials.email === "christianretreatcentrelagos@gmail.com" &&
          credentials.password === "Admin@CRC2026"
        ) {
          return { id: "1", name: "System Admin", email: credentials.email as string, role: "ADMIN" };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });
          
          if (user && user.password === credentials.password) {
            return { id: user.id, name: user.name || "Admin", email: user.email, role: user.role };
          }
        } catch (error) {
          console.error("Auth DB error:", error);
        }

        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret_for_crc_development_only_12345"
});
