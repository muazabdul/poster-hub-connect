
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PosterCard from "@/components/dashboard/PosterCard";
import CategoryFilter from "@/components/dashboard/CategoryFilter";
import SearchBar from "@/components/dashboard/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const categories = [
  { id: "govt-schemes", name: "Govt Schemes" },
  { id: "digital-services", name: "Digital Services" },
  { id: "banking", name: "Banking" },
  { id: "education", name: "Education" },
  { id: "agriculture", name: "Agriculture" },
  { id: "health", name: "Health" },
  { id: "insurance", name: "Insurance" },
  { id: "festivals", name: "Festivals & Events" },
];

const posters = [
  { 
    id: "1", 
    title: "PM Kisan Scheme", 
    category: "govt-schemes",
    imageUrl: "/placeholder.svg",
    isNew: true
  },
  { 
    id: "2", 
    title: "Digital Banking Services", 
    category: "banking",
    imageUrl: "/placeholder.svg",
  },
  { 
    id: "3", 
    title: "Aadhaar Card Services", 
    category: "digital-services",
    imageUrl: "/placeholder.svg",
  },
  { 
    id: "4", 
    title: "Digital Literacy Program", 
    category: "education",
    imageUrl: "/placeholder.svg",
    isNew: true
  },
  { 
    id: "5", 
    title: "Crop Insurance Scheme", 
    category: "agriculture",
    imageUrl: "/placeholder.svg",
  },
  { 
    id: "6", 
    title: "PMJAY Health Card", 
    category: "health",
    imageUrl: "/placeholder.svg",
  },
  { 
    id: "7", 
    title: "Life Insurance", 
    category: "insurance",
    imageUrl: "/placeholder.svg",
  },
  { 
    id: "8", 
    title: "Diwali Special Offers", 
    category: "festivals",
    imageUrl: "/placeholder.svg",
    isNew: true
  },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPosters = posters.filter(poster => {
    const matchesCategory = selectedCategory === null || poster.category === selectedCategory;
    const matchesSearch = poster.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              {filteredPosters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPosters.map(poster => (
                    <PosterCard 
                      key={poster.id}
                      id={poster.id}
                      title={poster.title}
                      category={categories.find(cat => cat.id === poster.category)?.name || poster.category}
                      imageUrl={poster.imageUrl}
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
                    category={categories.find(cat => cat.id === poster.category)?.name || poster.category}
                    imageUrl={poster.imageUrl}
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
