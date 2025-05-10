
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { posterSchema } from "@/schemas/categorySchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Image, Upload, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface PosterFormProps {
  onSuccess: () => void;
  initialData?: {
    id?: string;
    title: string;
    category?: string;
    description?: string;
    serviceUrl?: string;
  };
}

const PosterForm = ({ onSuccess, initialData }: PosterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const isEditing = !!initialData?.id;
  
  const form = useForm<z.infer<typeof posterSchema>>({
    resolver: zodResolver(posterSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      serviceUrl: initialData?.serviceUrl || "",
    },
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = (values: z.infer<typeof posterSchema>) => {
    if (!imagePreview) {
      toast.error("Please upload an image for the poster");
      return;
    }
    
    setIsLoading(true);
    
    // This would be replaced with an actual API call
    console.log("Poster data:", {
      ...values,
      image: "Uploaded image data would go here",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Poster added successfully!");
      form.reset();
      setImagePreview(null);
      onSuccess();
    }, 1500);
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter poster title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Organizing posters by category is optional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service URL (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="https://example.com/service" 
                        {...field} 
                      />
                      <LinkIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Link to the website where this service is available.
                  </FormDescription>
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
                    <Textarea 
                      placeholder="Enter a description for the poster..." 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This description will be visible to admins only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <FormLabel>Poster Image</FormLabel>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-[3/4] bg-muted/30",
                  imagePreview ? "border-brand-purple" : "border-gray-300 hover:border-gray-400"
                )}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Poster preview" 
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
                    <span className="text-sm font-medium">Click to upload poster image</span>
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
            
            <FormDescription>
              Upload a high-quality image for the poster. This image will be shown to users and available for download.
            </FormDescription>
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
                {isEditing ? 'Updating Poster...' : 'Uploading Poster...'}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Poster' : 'Add Poster'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PosterForm;
