import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// This config is shared between Middleware and the main Auth object
// We keep it lightweight so it doesn't break the Vercel Edge limit
export const authConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Admin Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // We will override this in lib/auth.ts where we have DB access
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
