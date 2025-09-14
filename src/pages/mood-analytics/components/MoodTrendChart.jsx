import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const MoodTrendChart = ({ data, selectedTimeRange, onTimeRangeChange }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'anxiety', 'stress']);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  const metricOptions = [
    { key: 'happiness', label: 'Happiness', color: '#48BB78' },
    { key: 'anxiety', label: 'Anxiety', color: '#ED8936' },
    { key: 'stress', label: 'Stress', color: '#E53E3E' },
    { key: 'calmness', label: 'Calmness', color: '#4A90A4' },
    { key: 'energy', label: 'Energy', color: '#7B68A6' }
  ];

  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricKey) 
        ? prev?.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Mood Trends Over Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your emotional patterns and identify trends
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <select
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e?.target?.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {timeRangeOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 therapeutic-transition">
            <Icon name="Download" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metricOptions?.map(metric => (
          <button
            key={metric?.key}
            onClick={() => toggleMetric(metric?.key)}
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium
              therapeutic-transition
              ${selectedMetrics?.includes(metric?.key)
                ? 'text-white shadow-soft'
                : 'bg-surface text-muted-foreground hover:bg-muted/50'
              }
            `}
            style={{
              backgroundColor: selectedMetrics?.includes(metric?.key) ? metric?.color : undefined
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: metric?.color }}
            />
            <span>{metric?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {metricOptions?.map(metric => 
              selectedMetrics?.includes(metric?.key) && (
                <Line
                  key={metric?.key}
                  type="monotone"
                  dataKey={metric?.key}
                  stroke={metric?.color}
                  strokeWidth={2}
                  dot={{ fill: metric?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metric?.color, strokeWidth: 2 }}
                  name={metric?.label}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        {selectedMetrics?.map(metricKey => {
          const metric = metricOptions?.find(m => m?.key === metricKey);
          const values = data?.map(d => d?.[metricKey])?.filter(v => v !== undefined);
          const average = values?.length > 0 ? (values?.reduce((a, b) => a + b, 0) / values?.length)?.toFixed(1) : 0;
          const trend = values?.length > 1 ? values?.[values?.length - 1] - values?.[0] : 0;
          
          return (
            <div key={metricKey} className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: metric?.color }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {metric?.label}
                </span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {average}%
              </div>
              <div className={`flex items-center justify-center space-x-1 text-xs ${
                trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'
              }`}>
                <Icon 
                  name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
                <span>{Math.abs(trend)?.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodTrendChart;