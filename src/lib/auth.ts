import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Admin Portal",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@crc.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Hardcoded fallback for production readiness without immediate DB seeding
        if (
          credentials.email === "christianretreatcentrelagos@gmail.com" &&
          credentials.password === "Admin@CRC2026"
        ) {
          return { id: "1", name: "System Admin", email: credentials.email, role: "ADMIN" };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });
          
          if (user && user.password === credentials.password) { // Note: Use bcrypt in real prod
            return { id: user.id, name: user.name || "Admin", email: user.email, role: user.role };
          }
        } catch (error) {
          console.error("Auth DB error:", error);
        }

        return null; // Login failed
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret_for_crc_development_only_12345"
});
