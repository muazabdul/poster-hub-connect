
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatsOverview from "@/components/admin/StatsOverview";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import RecentData from "@/components/admin/RecentData";

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
      <StatsOverview adminStats={adminStats} />
      
      <div className="mb-6">
        <DashboardMetrics />
      </div>
      
      <RecentData 
        onViewUsers={handleViewAllUsers} 
        onViewPosters={handleViewAllPosters} 
      />
    </>
  );
};

export default AdminDashboard;
