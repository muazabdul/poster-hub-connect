
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MetricsData {
  name: string;
  posters: number;
  users: number;
  downloads: number;
}

export default function DashboardMetrics() {
  const [data, setData] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchMetricsData();
  }, [timeframe]);

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      
      // This is mock data - in a real implementation, you would fetch actual metrics from Supabase
      // For example, count new users, downloads, and poster uploads by date
      
      let mockData: MetricsData[];
      
      if (timeframe === 'week') {
        mockData = [
          { name: 'Mon', posters: 4, users: 7, downloads: 24 },
          { name: 'Tue', posters: 3, users: 5, downloads: 18 },
          { name: 'Wed', posters: 5, users: 8, downloads: 28 },
          { name: 'Thu', posters: 2, users: 6, downloads: 15 },
          { name: 'Fri', posters: 6, users: 9, downloads: 32 },
          { name: 'Sat', posters: 8, users: 11, downloads: 45 },
          { name: 'Sun', posters: 7, users: 10, downloads: 38 }
        ];
      } else if (timeframe === 'month') {
        mockData = [
          { name: 'Week 1', posters: 15, users: 25, downloads: 120 },
          { name: 'Week 2', posters: 18, users: 30, downloads: 145 },
          { name: 'Week 3', posters: 22, users: 35, downloads: 165 },
          { name: 'Week 4', posters: 25, users: 40, downloads: 190 }
        ];
      } else {
        mockData = [
          { name: 'Jan', posters: 65, users: 120, downloads: 450 },
          { name: 'Feb', posters: 75, users: 135, downloads: 520 },
          { name: 'Mar', posters: 85, users: 150, downloads: 580 },
          { name: 'Apr', posters: 95, users: 165, downloads: 650 },
          { name: 'May', posters: 110, users: 190, downloads: 720 },
          { name: 'Jun', posters: 125, users: 210, downloads: 800 }
        ];
      }
      
      setData(mockData);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      toast.error("Failed to load metrics data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dashboard Metrics</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-2 py-1 text-xs rounded ${timeframe === 'week' ? 'bg-brand-purple text-white' : 'bg-gray-100'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-2 py-1 text-xs rounded ${timeframe === 'month' ? 'bg-brand-purple text-white' : 'bg-gray-100'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeframe('year')}
              className={`px-2 py-1 text-xs rounded ${timeframe === 'year' ? 'bg-brand-purple text-white' : 'bg-gray-100'}`}
            >
              Year
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="posters" fill="#8884d8" name="New Posters" />
              <Bar dataKey="users" fill="#82ca9d" name="New Users" />
              <Bar dataKey="downloads" fill="#ffc658" name="Downloads" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
