
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  onImageRemove: () => void;
  label: string;
  aspectRatio?: "video" | "square"; 
  required?: boolean;
}

const ImageUploader = ({
  imagePreview,
  onImageChange,
  onImageRemove,
  label,
  aspectRatio = "square",
  required = false
}: ImageUploaderProps) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB. Please select a smaller image.");
      return;
    }
    
    onImageChange(file);
  };

  return (
    <div className="space-y-4">
      <FormLabel>{label}{required && " *"}</FormLabel>
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30",
          imagePreview ? "border-brand-purple" : "border-gray-300 hover:border-gray-400",
          aspectRatio === "video" ? "aspect-video" : "aspect-square"
        )}
      >
        {imagePreview ? (
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Image preview" 
              className="w-full h-full object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              Remove
            </Button>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <Image className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-center">Click to upload image</span>
            <span className="text-xs text-gray-500 mt-1 text-center">PNG, JPG, or SVG (max 5MB)</span>
            <Input 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
