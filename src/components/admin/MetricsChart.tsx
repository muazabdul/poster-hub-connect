
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

interface MetricsData {
  name: string;
  posters: number;
  users: number;
  downloads: number;
}

interface MetricsChartProps {
  data: MetricsData[];
  chartType: 'bar' | 'line' | 'area';
  loading: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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

const MetricsChart = ({ data, chartType, loading }: MetricsChartProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
    default: // bar chart
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

export default MetricsChart;
