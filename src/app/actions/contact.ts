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

    // 2. Send Email Notification
    const { sendEmail } = await import("@/lib/email");
    await sendEmail({
      to: "christianretreatcentrelagos@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    revalidatePath("/admin/contact"); // In case admin has a contact viewer later
    return { success: true };

  } catch (error) {
    console.error("Contact Form error:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
