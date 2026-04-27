"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getEmbedUrl } from "@/lib/media-utils";


import { mkdir, writeFile } from "fs/promises";
import path from "path";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function upsertMedia(formData: FormData) {
  const prisma = getPrisma();
  const id = (formData.get("id") as string) || "";
  const title = (formData.get("title") as string) || "Untitled Content";
  const category = (formData.get("category") as string) || "Facilities";
  const isPublished = formData.get("isPublished") === "true";
  
  let typeSelection = (formData.get("type") as string) || "image";
  let url = (formData.get("url") as string) || "";
  const file = formData.get("mediaFile") as File;

  // Process Native File System Uploads
  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(file.name) || (file.type.includes("video") ? ".mp4" : ".jpg");
      const uniqueName = `media-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const destPath = path.join(uploadDir, uniqueName);
      await writeFile(destPath, buffer);
      
      url = `/uploads/${uniqueName}`;
      typeSelection = file.type.startsWith("video/") ? "video" : "image";
    } catch (e) {
      console.error("[FILE_WRITE_ERROR]", e);
      return { success: false, error: "System failed to securely commit your media attachment." };
    }
  }

  if (!url || !url.trim()) {
    return { success: false, error: "Please attach a file or provide a media URL." };
  }

  // Fallbacks if they didn't upload but still provided a URL (for example on edits)
  let finalType = typeSelection;
  if ((!file || file.size === 0) && url) {
    if (url.match(/\.(mp4|mov|webm)$/i)) {
      finalType = "video";
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?.*)?$/i)) {
      finalType = "image";
    } else {
      // Treat all social/external embeds as "link" so admin filtering stays consistent.
      finalType = "link";
    }
  }

  const data = {
    title,
    url,
    type: finalType,
    category,
    isPublished,
    isDeleted: false,
  };

  try {
    let result;
    if (id && id !== "") {
      result = await prisma.media.update({
        where: { id },
        data,
      });
      console.log("MEDIA UPDATED:", result);
    } else {
      result = await prisma.media.create({
        data,
      });
      console.log("MEDIA SAVED:", result);
    }
    revalidatePath("/admin/media");
    revalidatePath("/media");
    revalidatePath("/accommodation");
    console.log("MEDIA SAVED:", result);
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[UPSERT_MEDIA_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to save media") };
  }
}

export async function setMediaPublished(id: string, isPublished: boolean) {
  const prisma = getPrisma();
  try {
    const result = await prisma.media.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/admin/media");
    revalidatePath("/media");
    revalidatePath("/accommodation");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[TOGGLE_MEDIA_PUBLISH_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to update visibility") };
  }
}

export async function deleteMedia(id: string) {
  const prisma = getPrisma();

  try {
    const result = await prisma.media.update({
      where: { id },
      data: { isDeleted: true },
    });
    revalidatePath("/admin/media");
    revalidatePath("/media");
    revalidatePath("/accommodation");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[DELETE_MEDIA_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to delete media") };
  }
}

export async function restoreMedia(id: string) {
    const prisma = getPrisma();
  try {
    const result = await prisma.media.update({
      where: { id },
      data: { isDeleted: false },
    });
    revalidatePath("/admin/media");
    revalidatePath("/admin/trash");
    revalidatePath("/media");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("[RESTORE_MEDIA_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to restore media") };
  }
}

export async function permanentDeleteMedia(id: string) {
    const prisma = getPrisma();
  try {
    await prisma.media.delete({
      where: { id },
    });
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error: unknown) {
    console.error("[PERM_DELETE_ERROR]", error);
    return { success: false, error: getErrorMessage(error, "Failed to permanently delete media") };
  }
}
