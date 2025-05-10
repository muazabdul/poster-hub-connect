
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

// Mock categories data
const categoriesData: Category[] = [
  {
    id: "govt-schemes",
    name: "Government Schemes",
    description: "Posters about various government welfare schemes and programs.",
    count: 15
  },
  {
    id: "digital-services",
    name: "Digital Services",
    description: "Materials promoting digital services available at CSCs.",
    count: 12
  },
  {
    id: "banking",
    name: "Banking Services",
    description: "Promotional content for banking and financial services.",
    count: 8
  },
  {
    id: "education",
    name: "Education",
    description: "Materials related to educational programs and digital literacy.",
    count: 10
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Content focused on agricultural services and farmer programs.",
    count: 7
  },
  {
    id: "health",
    name: "Health Services",
    description: "Health-related schemes and services promotional materials.",
    count: 9
  },
  {
    id: "insurance",
    name: "Insurance",
    description: "Various insurance schemes and programs available at CSCs.",
    count: 6
  },
  {
    id: "festivals",
    name: "Festivals & Events",
    description: "Seasonal and festival-related promotional materials.",
    count: 14
  }
];

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = searchQuery 
    ? categoriesData.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoriesData;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Browse posters by category to find what you need.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <Link to={`/dashboard?category=${category.id}`}>
                  <div className="bg-brand-purple h-2"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Folder className="h-5 w-5 mr-2 text-brand-purple" />
                        {category.name}
                      </CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand-deepPurple">
                        {category.count}
                      </span>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-brand-light text-brand-purple hover:bg-brand-light/80 hover:text-brand-deepPurple"
                      variant="secondary"
                    >
                      View Posters
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
