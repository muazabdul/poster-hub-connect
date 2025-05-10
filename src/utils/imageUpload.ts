
import { v4 as uuidv4 } from 'uuid';
import { uploadAPI } from "@/lib/api";
import { toast } from "sonner";

/**
 * Uploads an image file to the PHP backend
 * @param file The file to upload
 * @param bucketName The storage bucket name
 * @param folderPath The folder path within the bucket
 * @returns The public URL of the uploaded file or null if upload fails
 */
export const uploadImage = async (
  file: File,
  bucketName: string,
  folderPath: string
): Promise<string | null> => {
  try {
    const result = await uploadAPI.uploadImage(file, bucketName, folderPath);
    return result.publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    toast.error("Failed to upload image");
    return null;
  }
};
