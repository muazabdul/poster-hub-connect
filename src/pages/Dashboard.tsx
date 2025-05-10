
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PosterCard from "@/components/dashboard/PosterCard";
import CategoryFilter from "@/components/dashboard/CategoryFilter";
import SearchBar from "@/components/dashboard/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoriesAPI, postersAPI } from "@/lib/api";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Poster {
  id: string;
  title: string;
  category_id: string;
  category_name: string;
  image_url: string;
  description?: string;
  service_url?: string;
  isNew?: boolean;
}

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        
        if (response.status !== 'success') {
          throw new Error(response.message || "Failed to load categories");
        }
        
        setCategories(response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name
        })));
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const response = await postersAPI.getPosters({
          category: selectedCategory || undefined,
          search: searchQuery || undefined
        });
        
        if (response.status !== 'success') {
          throw new Error(response.message || "Failed to load posters");
        }
        
        // Mark newest posters (first 3) as "new"
        const postersWithNew = response.data.map((poster: any, index: number) => ({
          ...poster,
          isNew: index < 3
        }));
        
        setPosters(postersWithNew);
      } catch (error) {
        console.error("Error fetching posters:", error);
        toast.error("Failed to load posters");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosters();
  }, [selectedCategory, searchQuery]);
  
  const filteredPosters = posters;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Marketing Materials</h1>
            <p className="text-muted-foreground">Browse and download posters for your CSC business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
            <SearchBar onSearch={(query) => setSearchQuery(query)} />
          </div>
          
          <div className="border rounded-lg p-2">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Materials</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="downloaded">Recently Downloaded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 h-64 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : filteredPosters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPosters.map(poster => (
                    <PosterCard 
                      key={poster.id}
                      id={poster.id}
                      title={poster.title}
                      category={poster.category_name || "Uncategorized"}
                      imageUrl={poster.image_url}
                      description={poster.description}
                      serviceUrl={poster.service_url}
                      isNew={poster.isNew}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posters found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posters.filter(poster => poster.isNew).map(poster => (
                  <PosterCard 
                    key={poster.id}
                    id={poster.id}
                    title={poster.title}
                    category={poster.category_name || "Uncategorized"}
                    imageUrl={poster.image_url}
                    description={poster.description}
                    serviceUrl={poster.service_url}
                    isNew={poster.isNew}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Popular posters will appear here based on download counts.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="downloaded">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your recently downloaded posters will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
