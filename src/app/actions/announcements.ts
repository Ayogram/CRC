"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


import { mkdir, writeFile } from "fs/promises";
import path from "path";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function upsertAnnouncement(formData: FormData) {
   const prisma = getPrisma();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  
  let featuredImg = formData.get("featuredImg") as string | null;
  const file = formData.get("featuredImgFile") as File;

  // Process Native Node File Systems
  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(file.name) || (file.type.includes("video") ? ".mp4" : ".jpg");
      const uniqueName = `announce-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const destPath = path.join(uploadDir, uniqueName);
      await writeFile(destPath, buffer);
      
      featuredImg = `/uploads/${uniqueName}`;
    } catch (e) {
      console.error("[FILE_WRITE_ERROR]", e);
      return { success: false, error: "System failed to securely commit your file attachment." };
    }
  }

  const normalizedTitle = (title || "").trim();
  const normalizedContent = (content || "").trim();
  if (!normalizedTitle || !normalizedContent) {
    return { success: false, error: "Title and content are required." };
  }

  const data = {
    title: normalizedTitle,
    content: normalizedContent,
    category: category || "General",
    featuredImg,
    status: status || "DRAFT",
    isFeatured,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
  };

  try {
    let result;
    if (id && id !== "") {
      result = await prisma.announcement.update({
        where: { id },
        data,
      });
    } else {
      result = await prisma.announcement.create({
        data,
      });
    }
    revalidatePath("/admin/announcements");
    revalidatePath("/announcements");
    revalidatePath("/");
    console.log("ANNOUNCEMENT SAVED:", result);
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[UPSERT_ANNOUNCE_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to save announcement") };
  }
}

export async function setAnnouncementStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  const prisma = getPrisma();
  try {
    const result = await prisma.announcement.update({
      where: { id },
      data: {
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/announcements");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[TOGGLE_ANNOUNCEMENT_STATUS_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to update announcement status") };
  }
}

export async function deleteAnnouncement(id: string) {
  const prisma = getPrisma();
  try {
    const result = await prisma.announcement.update({
      where: { id },
      data: { isDeleted: true },
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/announcements");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[DELETE_ANNOUNCE_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete announcement") };
  }
}

export async function restoreAnnouncement(id: string) {
  const prisma = getPrisma();
  try {
    const result = await prisma.announcement.update({
      where: { id },
      data: { isDeleted: false },
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/admin/trash");
    revalidatePath("/announcements");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[RESTORE_ANNOUNCE_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to restore announcement") };
  }
}

export async function permanentDeleteAnnouncement(id: string) {
  const prisma = getPrisma();
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error: unknown) {
    console.error("[PERM_DELETE_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to permanently delete announcement") };
  }
}
