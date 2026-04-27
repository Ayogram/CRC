"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const prisma = getPrisma();

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    // 1. Save to Database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message
      }
    });

    // 2. Simulate Email Delivery via console
    // In production, implement Nodemailer/Resend passing process.env parameters
    console.log(`
      ===================================
      [EMAIL SERVER SIMULATION]
      To: christianretreatcentrelagos@gmail.com
      From: CRC Website <noreply@crc.com>
      Subject: New Contact Message from ${name}

      Name: ${name}
      Email: ${email}
      Phone: ${phone || "N/A"}
      
      Message:
      ${message}
      ===================================
    `);

    revalidatePath("/admin/contact"); // In case admin has a contact viewer later
    return { success: true };

  } catch (error) {
    console.error("Contact Form error:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
