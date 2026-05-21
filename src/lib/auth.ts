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
          const { sendEmail } = await import("@/lib/email");
          await sendEmail({
            to: "christianretreatcentrelagos@gmail.com",
            subject: "New Admin Portal Login Detected (System Admin)",
            text: `A new login was detected on the Admin Portal using the System Admin fallback account.\n\nTime: ${new Date().toLocaleString()}\nDevice/Browser: ${credentials.userAgent || "Unknown Device"}\n\nIf this was not you, please secure your account immediately.`,
            html: `
              <h3>New Admin Portal Login Detected</h3>
              <p>A new login was detected on the Admin Portal using the System Admin fallback account.</p>
              <ul>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Device/Browser:</strong> ${credentials.userAgent || "Unknown Device"}</li>
              </ul>
              <p>If this was not you, please secure your account immediately.</p>
            `,
          });
          return { id: "1", name: "System Admin", email: credentials.email as string, role: "ADMIN" };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });
          
          if (user && user.password === credentials.password) {
            const { sendEmail } = await import("@/lib/email");
            await sendEmail({
              to: "christianretreatcentrelagos@gmail.com",
              subject: "New Admin Portal Login Detected",
              text: `A new login was detected on the Admin Portal.\n\nEmail: ${credentials.email}\nTime: ${new Date().toLocaleString()}\nDevice/Browser: ${credentials.userAgent || "Unknown Device"}\n\nIf this was not you, please secure your account immediately.`,
              html: `
                <h3>New Admin Portal Login Detected</h3>
                <p>A new login was detected on the Admin Portal.</p>
                <ul>
                  <li><strong>Email:</strong> ${credentials.email}</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Device/Browser:</strong> ${credentials.userAgent || "Unknown Device"}</li>
                </ul>
                <p>If this was not you, please secure your account immediately.</p>
              `,
            });
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
