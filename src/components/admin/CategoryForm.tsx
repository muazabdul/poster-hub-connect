import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Image, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const categorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
});

interface CategoryFormProps {
  onSuccess: () => void;
  initialData?: {
    id?: string;
    name: string;
    description?: string;
    thumbnail?: string;
  };
}

const CategoryForm = ({ onSuccess, initialData }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnail || null);
  const isEditing = !!initialData?.id;
  
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    if (!imagePreview) {
      toast.error("Please upload a thumbnail for the category");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Saving category...", isEditing ? "updating" : "creating", {
        values,
        id: initialData?.id
      });
      
      // In a real implementation, this would upload the image to storage
      // For now, we'll just simulate this
      const thumbnail = imagePreview; // This would be the uploaded image URL
      
      if (isEditing && initialData?.id) {
        // Update existing category
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: values.name,
            description: values.description,
            // In a real implementation, we would update the thumbnail too
          })
          .eq('id', initialData.id)
          .select();
          
        if (error) {
          console.error("Error updating category:", error);
          throw error;
        }
        console.log("Category updated successfully:", data);
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: values.name,
            description: values.description,
            // In a real implementation, we would insert the thumbnail too
          })
          .select();
          
        if (error) {
          console.error("Error creating category:", error);
          throw error;
        }
        console.log("Category created successfully:", data);
        toast.success("Category added successfully!");
      }
      
      form.reset();
      setImagePreview(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB. Please select a smaller image.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="space-y-4">
            <div>
              <FormLabel>Category Thumbnail</FormLabel>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-square bg-muted/30",
                  imagePreview ? "border-brand-purple" : "border-gray-300 hover:border-gray-400"
                )}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Category thumbnail" 
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Image className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">Click to upload thumbnail</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG (max 5MB)</span>
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
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-brand-purple hover:bg-brand-darkPurple"
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
