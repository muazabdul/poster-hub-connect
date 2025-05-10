
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMetricsData, fetchMetricsSummary } from "@/services/MetricsDataService";
import { toast } from "sonner";
import ChartControls from "./ChartControls";
import MetricsChart from "./MetricsChart";
import type { MetricsData, MetricsSummary } from "@/services/MetricsDataService";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch metrics data for the selected timeframe
        const metricsData = await fetchMetricsData(timeframe);
        setData(metricsData);
        
        // Only fetch summary once
        if (summary.totalUsers === 0) {
          const summaryData = await fetchMetricsSummary();
          setSummary(summaryData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load metrics data. Please try again.");
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'year') => {
    if (newTimeframe !== timeframe) {
      setTimeframe(newTimeframe);
    }
  };

  const handleChartTypeChange = (newChartType: 'bar' | 'line' | 'area') => {
    if (newChartType !== chartType) {
      setChartType(newChartType);
    }
  };

  const handleRetry = () => {
    // Clear any errors and try loading data again
    setError(null);
    setLoading(true);
    
    // Force refresh of data (bypass cache)
    const loadData = async () => {
      try {
        const metricsData = await fetchMetricsData(timeframe, true);
        setData(metricsData);
        
        const summaryData = await fetchMetricsSummary(true);
        setSummary(summaryData);
        
        toast.success("Data refreshed successfully");
      } catch (error) {
        console.error("Error reloading data:", error);
        setError("Failed to refresh data. Please try again.");
        toast.error("Failed to refresh dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle>Dashboard Metrics</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </div>
          <ChartControls
            timeframe={timeframe}
            chartType={chartType}
            onTimeframeChange={handleTimeframeChange}
            onChartTypeChange={handleChartTypeChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-brand-purple text-white rounded hover:bg-brand-darkPurple"
            >
              Retry
            </button>
          </div>
        ) : (
          <MetricsChart 
            data={data} 
            chartType={chartType} 
            loading={loading} 
          />
        )}
      </CardContent>
    </Card>
  );
}
