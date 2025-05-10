
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MetricsData {
  name: string;
  posters: number;
  users: number;
  downloads: number;
}

export interface MetricsSummary {
  totalUsers: number;
  totalPosters: number;
  totalDownloads: number;
  totalCategories: number;
  userGrowth: number;
  posterGrowth: number;
  downloadsGrowth: number;
}

// Create a cache for metrics data
const metricsCache = {
  data: new Map<string, {data: MetricsData[], timestamp: number}>(),
  summary: null as MetricsSummary | null,
  cacheDuration: 5 * 60 * 1000, // 5 minutes cache
};

export const fetchMetricsSummary = async (forceRefresh = false): Promise<MetricsSummary> => {
  try {
    // Use cache if available and not expired
    if (metricsCache.summary && !forceRefresh) {
      console.log("Using cached metrics summary data");
      return metricsCache.summary;
    }

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

    const summaryData = {
      totalUsers: usersCount || 0,
      totalPosters: postersCount || 0,
      totalDownloads: downloadsCount || 0,
      totalCategories: categoriesCount || 0,
      // Growth percentages would ideally be calculated by comparing with previous period
      // Using mock data for now
      userGrowth: 12,
      posterGrowth: 8,
      downloadsGrowth: 15
    };
    
    // Update cache
    metricsCache.summary = summaryData;
    
    return summaryData;
  } catch (error) {
    console.error("Error fetching summary metrics:", error);
    toast.error("Failed to load summary metrics");
    throw error;
  }
};

export const fetchMetricsData = async (timeframe: 'week' | 'month' | 'year', forceRefresh = false): Promise<MetricsData[]> => {
  try {
    // Check if data is cached and not expired
    const cacheKey = `metrics_${timeframe}`;
    const cachedData = metricsCache.data.get(cacheKey);
    const now = Date.now();
    
    if (cachedData && !forceRefresh && (now - cachedData.timestamp < metricsCache.cacheDuration)) {
      console.log(`Using cached metrics data for ${timeframe}`);
      return cachedData.data;
    }
    
    console.log(`Fetching fresh metrics data for ${timeframe}`);
    
    // Fetch raw data from Supabase
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: false });
      
    if (usersError) {
      console.error("Error fetching user data:", usersError);
      throw usersError;
    }
    
    const { data: postersData, error: postersError } = await supabase
      .from('posters')
      .select('created_at')
      .order('created_at', { ascending: false });
      
    if (postersError) {
      console.error("Error fetching posters data:", postersError);
      throw postersError;
    }
    
    const { data: downloadsData, error: downloadsError } = await supabase
      .from('downloads')
      .select('downloaded_at')
      .order('downloaded_at', { ascending: false });
    
    if (downloadsError) {
      console.error("Error fetching downloads data:", downloadsError);
      throw downloadsError;
    }
    
    // Generate time-series data based on timeframe
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
    
    const mockData: MetricsData[] = timeLabels.map((label, index) => {
      // Create a distribution where more recent periods have higher numbers
      const factor = (index + 1) / timeLabels.length;
      
      return {
        name: label,
        users: Math.round(totalUsers * factor * (0.7 + Math.random() * 0.3) / timeLabels.length),
        posters: Math.round(totalPosters * factor * (0.7 + Math.random() * 0.3) / timeLabels.length),
        downloads: Math.round(totalDownloads * factor * (0.7 + Math.random() * 0.3) / timeLabels.length)
      };
    });
    
    // Update cache
    metricsCache.data.set(cacheKey, {
      data: mockData,
      timestamp: now
    });
    
    return mockData;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    toast.error("Failed to load metrics data");
    throw error;
  }
};

// Add a function to clear the cache if needed
export const clearMetricsCache = () => {
  metricsCache.data.clear();
  metricsCache.summary = null;
  console.log("Metrics cache cleared");
};
