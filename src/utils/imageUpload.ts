
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Uploads an image file to Supabase storage
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    // Create storage bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error("Error creating bucket:", bucketError);
      throw bucketError;
    }

    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    toast.error("Failed to upload image");
    return null;
  }
};
