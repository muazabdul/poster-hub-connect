import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { uploadImage } from "@/utils/imageUpload";
import ImageUploader from "./ImageUploader";
import { categorySchema, CategoryFormValues, CategoryData } from "@/schemas/categorySchema";

interface CategoryFormProps {
  onSuccess: () => void;
  initialData?: CategoryData;
}

const CategoryForm = ({ onSuccess, initialData }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnail || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = !!initialData?.id;
  const { isAdmin, user } = useAuth();
  const isMobile = useIsMobile();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    // Store the file for later upload
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Saving category...", isEditing ? "updating" : "creating", {
        values,
        id: initialData?.id,
        userId: user.id
      });
      
      let thumbnailUrl = initialData?.thumbnail || null;
      
      // Upload new image if selected
      if (imageFile) {
        thumbnailUrl = await uploadImage(imageFile, "category_thumbnails", "category_thumbnails");
        if (!thumbnailUrl) {
          toast.error("Failed to upload thumbnail");
          setIsLoading(false);
          return;
        }
      }
      
      if (isEditing && initialData?.id) {
        await updateCategory(initialData.id, values, thumbnailUrl);
      } else {
        await createCategory(values, thumbnailUrl);
      }
      
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category. Please try again.", {
        description: error.message || "Database connection issue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (values: CategoryFormValues, thumbnailUrl: string | null) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: values.name,
        description: values.description,
        thumbnail: thumbnailUrl,
      })
      .select();
      
    if (error) {
      console.error("Error creating category:", error);
      throw error;
    }
    console.log("Category created successfully:", data);
    toast.success("Category added successfully!");
  };

  const updateCategory = async (id: string, values: CategoryFormValues, thumbnailUrl: string | null) => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: values.name,
        description: values.description,
        thumbnail: thumbnailUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error("Error updating category:", error);
      throw error;
    }
    console.log("Category updated successfully:", data);
    toast.success("Category updated successfully!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a description for the category..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short description of what this category contains.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              label="Category Thumbnail"
              aspectRatio={isMobile ? "video" : "square"}
              required={!isEditing}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-brand-purple hover:bg-brand-darkPurple w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating Category...' : 'Adding Category...'}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Category' : 'Add Category'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
