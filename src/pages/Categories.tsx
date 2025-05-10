import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { categoriesAPI } from "@/lib/api";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  thumbnail?: string | null; 
  count?: number;
}

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getCategories();
        
        if (response.status !== 'success') {
          throw new Error(response.message || "Failed to load categories");
        }
        
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (cat.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Browse posters by category to find what you need.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-64 flex items-center justify-center">
                  <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
                </Card>
              ))
            ) : filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No categories found.</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow overflow-hidden h-64 flex flex-col">
                  <Link to={`/dashboard?category=${category.id}`} className="h-full flex flex-col">
                    <div className="bg-brand-purple h-2"></div>
                    {category.thumbnail ? (
                      <div className="relative overflow-hidden h-32">
                        <img 
                          src={category.thumbnail} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-brand-deepPurple">
                            {category.count || 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 bg-muted flex items-center justify-center">
                        <Folder className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {category.description || "No description available."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button 
                        className="w-full bg-brand-light text-brand-purple hover:bg-brand-light/80 hover:text-brand-deepPurple"
                        variant="secondary"
                      >
                        View Posters
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
