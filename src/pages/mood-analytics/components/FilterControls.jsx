import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterControls = ({ filters, onFiltersChange, onExport, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const emotionOptions = [
    { value: 'all', label: 'All Emotions' },
    { value: 'happy', label: 'Happy' },
    { value: 'calm', label: 'Calm' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'sad', label: 'Sad' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'excited', label: 'Excited' },
    { value: 'neutral', label: 'Neutral' }
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'text', label: 'Text Analysis' },
    { value: 'voice', label: 'Voice Analysis' },
    { value: 'facial', label: 'Facial Recognition' },
    { value: 'journal', label: 'Journal Entries' },
    { value: 'chat', label: 'Chat Interactions' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsExpanded(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      timeRange: '30d',
      emotions: ['all'],
      sources: ['all'],
      startDate: '',
      endDate: '',
      minConfidence: 0,
      includeNeutral: true
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onReset();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters?.emotions?.length > 0 && !tempFilters?.emotions?.includes('all')) count++;
    if (tempFilters?.sources?.length > 0 && !tempFilters?.sources?.includes('all')) count++;
    if (tempFilters?.timeRange !== '30d') count++;
    if (tempFilters?.minConfidence > 0) count++;
    if (tempFilters?.startDate || tempFilters?.endDate) count++;
    return count;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">
            Advanced Filters
          </h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={tempFilters?.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e?.target?.value)}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {timeRangeOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>

        <select
          value={tempFilters?.emotions?.[0] || 'all'}
          onChange={(e) => handleFilterChange('emotions', [e?.target?.value])}
          className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {emotionOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={applyFilters}
          iconName="Search"
          iconPosition="left"
        >
          Apply
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset
        </Button>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Custom Date Range */}
            {tempFilters?.timeRange === 'custom' && (
              <>
                <Input
                  label="Start Date"
                  type="date"
                  value={tempFilters?.startDate}
                  onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={tempFilters?.endDate}
                  onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                />
              </>
            )}

            {/* Data Sources */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Sources
              </label>
              <select
                value={tempFilters?.sources?.[0] || 'all'}
                onChange={(e) => handleFilterChange('sources', [e?.target?.value])}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sourceOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Confidence Threshold */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Confidence: {tempFilters?.minConfidence}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={tempFilters?.minConfidence}
                onChange={(e) => handleFilterChange('minConfidence', parseInt(e?.target?.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tempFilters?.includeNeutral}
                onChange={(e) => handleFilterChange('includeNeutral', e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
              />
              <span className="text-sm text-foreground">Include neutral emotions</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={applyFilters}
              iconName="Filter"
              iconPosition="left"
            >
              Apply Filters
            </Button>

            <Button
              variant="outline"
              onClick={onExport}
              iconName="Download"
              iconPosition="left"
            >
              Export Filtered Data
            </Button>

            <Button
              variant="ghost"
              onClick={resetFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;