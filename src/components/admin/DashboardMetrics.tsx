
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricsData {
  name: string;
  posters: number;
  users: number;
  downloads: number;
}

interface MetricsSummary {
  totalUsers: number;
  totalPosters: number;
  totalDownloads: number;
  totalCategories: number;
  userGrowth: number;
  posterGrowth: number;
  downloadsGrowth: number;
}

export default function DashboardMetrics() {
  const [data, setData] = useState<MetricsData[]>([]);
  const [summary, setSummary] = useState<MetricsSummary>({
    totalUsers: 0,
    totalPosters: 0,
    totalDownloads: 0,
    totalCategories: 0,
    userGrowth: 0,
    posterGrowth: 0,
    downloadsGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  useEffect(() => {
    fetchMetricsData();
    fetchMetricsSummary();
  }, [timeframe]);

  const fetchMetricsSummary = async () => {
    try {
      // Fetch total users (profiles)
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
        throw new Error("Error fetching metric summaries");
      }

      setSummary({
        totalUsers: usersCount || 0,
        totalPosters: postersCount || 0,
        totalDownloads: downloadsCount || 0,
        totalCategories: categoriesCount || 0,
        // Growth percentages would ideally be calculated by comparing with previous period
        // Using mock data for now
        userGrowth: 12,
        posterGrowth: 8,
        downloadsGrowth: 15
      });
    } catch (error) {
      console.error("Error fetching summary metrics:", error);
      toast.error("Failed to load summary metrics");
    }
  };

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would fetch time-series data from the database
      // For now, generate mock data based on the actual counts from the database
      
      const { data: usersData } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false });
        
      const { data: postersData } = await supabase
        .from('posters')
        .select('created_at')
        .order('created_at', { ascending: false });
        
      const { data: downloadsData } = await supabase
        .from('downloads')
        .select('downloaded_at')
        .order('downloaded_at', { ascending: false });
      
      // Generate time-series data based on timeframe
      let mockData: MetricsData[] = [];
      let timeLabels: string[] = [];
      
      if (timeframe === 'week') {
        // Last 7 days
        timeLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      } else if (timeframe === 'month') {
        // Last 4 weeks
        timeLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      } else {
        // Last 6 months
        timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      }
      
      // Distribute real totals across time periods
      const totalUsers = usersData?.length || 0;
      const totalPosters = postersData?.length || 0;
      const totalDownloads = downloadsData?.length || 0;
      
      mockData = timeLabels.map((label, index) => {
        // Create a distribution where more recent periods have higher numbers
        const factor = (index + 1) / timeLabels.length;
        
        return {
          name: label,
          users: Math.round(totalUsers * factor * (0.7 + Math.random() * 0.3) / timeLabels.length),
          posters: Math.round(totalPosters * factor * (0.7 + Math.random() * 0.3) / timeLabels.length),
          downloads: Math.round(totalDownloads * factor * (0.7 + Math.random() * 0.3) / timeLabels.length)
        };
      });
      
      setData(mockData);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      toast.error("Failed to load metrics data");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="posters" stroke="#8884d8" name="New Posters" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="New Users" strokeWidth={2} />
              <Line type="monotone" dataKey="downloads" stroke="#ffc658" name="Downloads" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="posters" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Posters" />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="New Users" />
              <Area type="monotone" dataKey="downloads" stackId="1" stroke="#ffc658" fill="#ffc658" name="Downloads" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="posters" fill="#8884d8" name="New Posters" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#82ca9d" name="New Users" radius={[4, 4, 0, 0]} />
              <Bar dataKey="downloads" fill="#ffc658" name="Downloads" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center text-xs mb-1">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-1">{entry.name}:</span>
              <span className="font-medium">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle>Dashboard Metrics</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
            <div className="flex gap-2 bg-muted p-1 rounded-md">
              <button 
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-xs rounded ${chartType === 'bar' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Bar
              </button>
              <button 
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-xs rounded ${chartType === 'line' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Line
              </button>
              <button 
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-xs rounded ${chartType === 'area' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Area
              </button>
            </div>
            <div className="flex gap-2 bg-muted p-1 rounded-md mt-2 sm:mt-0">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 text-xs rounded ${timeframe === 'week' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 text-xs rounded ${timeframe === 'month' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1 text-xs rounded ${timeframe === 'year' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
}
