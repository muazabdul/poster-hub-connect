
import { Fragment } from "react";

interface ChartControlsProps {
  timeframe: 'week' | 'month' | 'year';
  chartType: 'bar' | 'line' | 'area';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
  onChartTypeChange: (chartType: 'bar' | 'line' | 'area') => void;
}

const ChartControls = ({ 
  timeframe, 
  chartType, 
  onTimeframeChange, 
  onChartTypeChange 
}: ChartControlsProps) => {
  const handleTimeframeClick = (newTimeframe: 'week' | 'month' | 'year') => {
    try {
      onTimeframeChange(newTimeframe);
    } catch (error) {
      console.error("Error changing timeframe:", error);
    }
  };

  const handleChartTypeClick = (newChartType: 'bar' | 'line' | 'area') => {
    try {
      onChartTypeChange(newChartType);
    } catch (error) {
      console.error("Error changing chart type:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
      <div className="flex gap-2 bg-muted p-1 rounded-md">
        <button 
          onClick={() => handleChartTypeClick('bar')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'bar' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Bar chart view"
        >
          Bar
        </button>
        <button 
          onClick={() => handleChartTypeClick('line')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'line' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Line chart view"
        >
          Line
        </button>
        <button 
          onClick={() => handleChartTypeClick('area')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'area' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Area chart view"
        >
          Area
        </button>
      </div>
      <div className="flex gap-2 bg-muted p-1 rounded-md mt-2 sm:mt-0">
        <button 
          onClick={() => handleTimeframeClick('week')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'week' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Weekly view"
        >
          Week
        </button>
        <button 
          onClick={() => handleTimeframeClick('month')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'month' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Monthly view"
        >
          Month
        </button>
        <button 
          onClick={() => handleTimeframeClick('year')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'year' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
          aria-label="Yearly view"
        >
          Year
        </button>
      </div>
    </div>
  );
};

export default ChartControls;
