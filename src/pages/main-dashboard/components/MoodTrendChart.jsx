import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';


const MoodTrendChart = ({ emotionState }) => {
  const [selectedRange, setSelectedRange] = useState('7d');
  
  const mockMoodData = [
    { date: '2025-09-07', mood: 7.2, energy: 6.8, stress: 3.2, anxiety: 2.1, day: 'Sun' },
    { date: '2025-09-08', mood: 6.8, energy: 7.1, stress: 4.1, anxiety: 3.5, day: 'Mon' },
    { date: '2025-09-09', mood: 8.1, energy: 8.3, stress: 2.8, anxiety: 1.9, day: 'Tue' },
    { date: '2025-09-10', mood: 7.5, energy: 7.8, stress: 3.5, anxiety: 2.8, day: 'Wed' },
    { date: '2025-09-11', mood: 6.2, energy: 6.1, stress: 5.2, anxiety: 4.1, day: 'Thu' },
    { date: '2025-09-12', mood: 7.8, energy: 8.1, stress: 2.9, anxiety: 2.3, day: 'Fri' },
    { date: '2025-09-13', mood: 8.3, energy: 8.7, stress: 2.1, anxiety: 1.8, day: 'Today' }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground capitalize">{entry?.dataKey}:</span>
              <span className="font-medium text-foreground">{entry?.value}/10</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getEmotionColor = () => {
    if (!emotionState) return 'var(--color-primary)';
    
    const emotionColors = {
      calm: 'var(--color-primary)',
      happy: 'var(--color-success)',
      anxious: 'var(--color-warning)',
      sad: 'var(--color-secondary)',
      stressed: 'var(--color-error)',
      neutral: 'var(--color-muted-foreground)'
    };
    
    return emotionColors?.[emotionState?.type] || 'var(--color-primary)';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Mood Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              Your emotional patterns over time
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
          {timeRanges?.map((range) => (
            <button
              key={range?.value}
              onClick={() => setSelectedRange(range?.value)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md therapeutic-transition
                ${selectedRange === range?.value
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full h-80" aria-label="Mood Trend Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockMoodData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getEmotionColor()} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getEmotionColor()} stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mood"
              stroke={getEmotionColor()}
              strokeWidth={2}
              fill="url(#moodGradient)"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getEmotionColor() }}
          />
          <span className="text-xs font-caption text-muted-foreground">Mood Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs font-caption text-muted-foreground">Energy Level</span>
        </div>
      </div>
    </div>
  );
};

export default MoodTrendChart;