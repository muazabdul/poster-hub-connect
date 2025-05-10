
import { Users, Image, FolderIcon } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

interface StatsOverviewProps {
  adminStats: {
    totalUsers: number;
    totalPosters: number;
    totalDownloads: number;
    totalCategories: number;
  };
}

const StatsOverview = ({ adminStats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Users"
        value={adminStats.totalUsers}
        icon={<Users className="h-6 w-6 text-brand-purple" />}
        change={{ 
          value: 12,
          isPositive: true,
          label: "12% from last month" 
        }}
      />
      
      <StatCard 
        title="Total Posters"
        value={adminStats.totalPosters}
        icon={<Image className="h-6 w-6 text-blue-600" />}
        change={{ 
          value: 8,
          isPositive: true,
          label: "8% from last month" 
        }}
      />
      
      <StatCard 
        title="Downloads"
        value={adminStats.totalDownloads}
        icon={
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
        }
        change={{ 
          value: 15,
          isPositive: true,
          label: "15% from last month" 
        }}
      />
      
      <StatCard 
        title="Categories"
        value={adminStats.totalCategories}
        icon={<FolderIcon className="h-6 w-6 text-orange-600" />}
        change={{ 
          value: 0,
          isPositive: false,
          label: "All categories active" 
        }}
      />
    </div>
  );
};

export default StatsOverview;
