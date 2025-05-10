
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Users, Image, FolderIcon } from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalPosters: number;
  totalDownloads: number;
  totalCategories: number;
}

const AdminDashboard = () => {
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosters: 0,
    totalDownloads: 0,
    totalCategories: 0
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total posters
        const { count: postersCount, error: postersError } = await supabase
          .from('posters')
          .select('*', { count: 'exact', head: true });

        // Fetch total downloads
        const { count: downloadsCount, error: downloadsError } = await supabase
          .from('downloads')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total categories
        const { count: categoriesCount, error: categoriesError } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        if (usersError || postersError || downloadsError || categoriesError) {
          console.error("Error fetching admin stats", { usersError, postersError, downloadsError, categoriesError });
          return;
        }

        setAdminStats({
          totalUsers: usersCount || 0,
          totalPosters: postersCount || 0,
          totalDownloads: downloadsCount || 0,
          totalCategories: categoriesCount || 0
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchAdminStats();
  }, []);

  const handleViewAllUsers = () => {
    // Using window.dispatchEvent to communicate with parent component
    window.dispatchEvent(new CustomEvent('adminNavigate', { detail: { tab: 'users' } }));
  };

  const handleViewAllPosters = () => {
    window.dispatchEvent(new CustomEvent('adminNavigate', { detail: { tab: 'posters' } }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{adminStats.totalUsers.toLocaleString()}</h3>
                <p className="text-xs flex items-center mt-1 text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" /> 
                  <span>12% from last month</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posters</p>
                <h3 className="text-2xl font-bold mt-1">{adminStats.totalPosters.toLocaleString()}</h3>
                <p className="text-xs flex items-center mt-1 text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" /> 
                  <span>8% from last month</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Image className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <h3 className="text-2xl font-bold mt-1">{adminStats.totalDownloads.toLocaleString()}</h3>
                <p className="text-xs flex items-center mt-1 text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" /> 
                  <span>15% from last month</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 text-green-600"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <h3 className="text-2xl font-bold mt-1">{adminStats.totalCategories.toLocaleString()}</h3>
                <p className="text-xs flex items-center mt-1 text-muted-foreground">
                  <span>All categories active</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FolderIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <DashboardMetrics />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">John Smith</td>
                    <td className="px-4 py-3 text-sm">john.smith@example.com</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">Emma Wilson</td>
                    <td className="px-4 py-3 text-sm">emma@example.com</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Dave Robertson</td>
                    <td className="px-4 py-3 text-sm">dave@example.com</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" size="sm" onClick={handleViewAllUsers}>View All</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Posters</CardTitle>
            <CardDescription>Most downloaded posters</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Poster</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">PM Kisan Scheme</td>
                    <td className="px-4 py-3 text-sm">Government Schemes</td>
                    <td className="px-4 py-3 text-sm font-medium">1,245</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm">Digital Banking Services</td>
                    <td className="px-4 py-3 text-sm">Banking</td>
                    <td className="px-4 py-3 text-sm font-medium">892</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">Aadhaar Card Services</td>
                    <td className="px-4 py-3 text-sm">Digital Services</td>
                    <td className="px-4 py-3 text-sm font-medium">567</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" size="sm" onClick={handleViewAllPosters}>View All</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
