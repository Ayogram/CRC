"use server";

import { sendEmail } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";
import crypto from "crypto";

const prisma = getPrisma();

export async function requestPasswordReset(email: string) {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  if (email !== "christianretreatcentrelagos@gmail.com") {
    // Only allow resetting the specific admin email as per user request
    return { success: false, error: "Invalid admin email." };
  }

  // Generate a secure, signed token that expires in 5 minutes
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret_for_crc_development_only_12345";
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  const data = `${email}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest("hex");
  const resetToken = Buffer.from(`${data}:${signature}`).toString("base64");
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://christianretreatcentre.com"; // Adjust if necessary
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
  
  try {
    await sendEmail({
      to: "christianretreatcentrelagos@gmail.com",
      subject: "Admin Portal Password Reset Request",
      text: `You requested a password reset for the CRC Admin Portal.\n\nPlease click the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <h3>Admin Portal Password Reset</h3>
        <p>You requested a password reset for the CRC Admin Portal.</p>
        <p>Please click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to send reset link." };
  }
}

export async function verifyPasswordResetToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, expiresAtStr, signature] = decoded.split(":");
    
    if (!email || !expiresAtStr || !signature) {
      return { valid: false, error: "Invalid token format." };
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      return { valid: false, error: "Token has expired. Please request a new password reset." };
    }

    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback_secret_for_crc_development_only_12345";
    const data = `${email}:${expiresAt}`;
    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid or tampered token." };
    }

    return { valid: true, email };
  } catch (error) {
    return { valid: false, error: "Invalid token." };
  }
}
