"use server";

import { sendEmail } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

export async function requestPasswordReset(email: string) {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  if (email !== "christianretreatcentrelagos@gmail.com") {
    // Only allow resetting the specific admin email as per user request
    return { success: false, error: "Invalid admin email." };
  }

  // Create a mock reset token/link
  // In a real app, generate a secure token, store it in DB with expiry, and verify it on the reset page.
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${email}`;
  
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
