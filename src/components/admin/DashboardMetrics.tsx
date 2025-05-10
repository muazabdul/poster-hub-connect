
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const metricsData = await fetchMetricsData(timeframe);
        setData(metricsData);
        
        // Only fetch summary once
        if (summary.totalUsers === 0) {
          const summaryData = await fetchMetricsSummary();
          setSummary(summaryData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'year') => {
    setTimeframe(newTimeframe);
  };

  const handleChartTypeChange = (newChartType: 'bar' | 'line' | 'area') => {
    setChartType(newChartType);
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
        <MetricsChart 
          data={data} 
          chartType={chartType} 
          loading={loading} 
        />
      </CardContent>
    </Card>
  );
}
