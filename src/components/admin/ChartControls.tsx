
import { useState } from "react";

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
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
      <div className="flex gap-2 bg-muted p-1 rounded-md">
        <button 
          onClick={() => onChartTypeChange('bar')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'bar' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Bar
        </button>
        <button 
          onClick={() => onChartTypeChange('line')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'line' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Line
        </button>
        <button 
          onClick={() => onChartTypeChange('area')}
          className={`px-3 py-1 text-xs rounded ${chartType === 'area' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Area
        </button>
      </div>
      <div className="flex gap-2 bg-muted p-1 rounded-md mt-2 sm:mt-0">
        <button 
          onClick={() => onTimeframeChange('week')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'week' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Week
        </button>
        <button 
          onClick={() => onTimeframeChange('month')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'month' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Month
        </button>
        <button 
          onClick={() => onTimeframeChange('year')}
          className={`px-3 py-1 text-xs rounded ${timeframe === 'year' ? 'bg-brand-purple text-white' : 'bg-transparent'}`}
        >
          Year
        </button>
      </div>
    </div>
  );
};

export default ChartControls;
