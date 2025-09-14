import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const EmotionBreakdown = ({ data, totalEntries }) => {
  const [selectedView, setSelectedView] = useState('pie');

  const emotionColors = {
    happy: '#48BB78',
    calm: '#4A90A4',
    anxious: '#ED8936',
    sad: '#7B68A6',
    stressed: '#E53E3E',
    excited: '#E8A87C',
    neutral: '#718096'
  };

  const emotionIcons = {
    happy: 'Smile',
    calm: 'Waves',
    anxious: 'AlertTriangle',
    sad: 'CloudRain',
    stressed: 'Zap',
    excited: 'Star',
    neutral: 'Minus'
  };

  const viewOptions = [
    { value: 'pie', label: 'Pie Chart', icon: 'PieChart' },
    { value: 'list', label: 'List View', icon: 'List' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-moderate">
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name={emotionIcons?.[data?.emotion]} 
              size={16} 
              style={{ color: data?.color }}
            />
            <span className="font-medium text-foreground capitalize">{data?.emotion}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Count: {data?.count} entries</p>
            <p>Percentage: {data?.percentage}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ emotion, percentage }) => `${emotion}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {data?.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item?.color }}
            />
            <Icon 
              name={emotionIcons?.[item?.emotion]} 
              size={20} 
              style={{ color: item?.color }}
            />
            <div>
              <span className="font-medium text-foreground capitalize">
                {item?.emotion}
              </span>
              <p className="text-xs text-muted-foreground">
                {item?.count} entries
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground">
                {item?.percentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                of total mood
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full therapeutic-transition"
                style={{ 
                  backgroundColor: item?.color,
                  width: `${item?.percentage}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Emotion Classification Breakdown
          </h3>
          <p className="text-sm text-muted-foreground">
            Distribution of detected emotions from {totalEntries} total entries
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
          {viewOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => setSelectedView(option?.value)}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium
                therapeutic-transition
                ${selectedView === option?.value
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={option?.icon} size={16} />
              <span className="hidden sm:block">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Chart/List Content */}
      {selectedView === 'pie' ? renderPieChart() : renderListView()}
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {data?.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Emotion Types
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {totalEntries}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Entries
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon 
              name={emotionIcons?.[data?.[0]?.emotion]} 
              size={16} 
              style={{ color: data?.[0]?.color }}
            />
            <span className="text-2xl font-bold text-foreground">
              {data?.[0]?.percentage}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Most Common
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {data?.filter(item => ['happy', 'calm', 'excited']?.includes(item?.emotion))?.reduce((sum, item) => sum + item?.percentage, 0)?.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            Positive Emotions
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionBreakdown;