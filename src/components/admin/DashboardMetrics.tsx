
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

export default function DashboardMetrics() {
  const [data, setData] = useState<MetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  useEffect(() => {
    fetchMetricsData();
  }, [timeframe]);

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      
      // This is mock data - in a real implementation, you would fetch actual metrics from Supabase
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
