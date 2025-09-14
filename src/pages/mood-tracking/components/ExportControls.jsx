import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportControls = ({ moodData, onExport }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON File' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' }
  ];

  const filterDataByRange = (data) => {
    const now = new Date();
    const entries = Object.entries(data);

    switch (dateRange) {
      case 'last7':
        const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entries?.filter(([date]) => new Date(date) >= week);
      
      case 'last30':
        const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entries?.filter(([date]) => new Date(date) >= month);
      
      case 'last90':
        const quarter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return entries?.filter(([date]) => new Date(date) >= quarter);
      
      case 'thisMonth':
        return entries?.filter(([date]) => {
          const entryDate = new Date(date);
          return entryDate?.getMonth() === now?.getMonth() && 
                 entryDate?.getFullYear() === now?.getFullYear();
        });
      
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return entries?.filter(([date]) => {
          const entryDate = new Date(date);
          return entryDate >= lastMonth && entryDate <= lastMonthEnd;
        });
      
      default:
        return entries;
    }
  };

  const generateCSV = (filteredData) => {
    const headers = ['Date', 'Mood Type', 'Intensity', 'Notes', 'Timestamp'];
    const rows = filteredData?.map(([date, entry]) => [
      date,
      entry?.type,
      entry?.intensity,
      `"${entry?.notes || ''}"`,
      entry?.timestamp
    ]);

    return [headers, ...rows]?.map(row => row?.join(','))?.join('\n');
  };

  const generateJSON = (filteredData) => {
    const exportData = {
      exportDate: new Date()?.toISOString(),
      dateRange: dateRange,
      totalEntries: filteredData?.length,
      data: Object.fromEntries(filteredData)
    };
    return JSON.stringify(exportData, null, 2);
  };

  const generatePDF = (filteredData) => {
    // Mock PDF generation - in real app would use jsPDF or similar
    const summary = {
      totalEntries: filteredData?.length,
      dateRange: dateRangeOptions?.find(opt => opt?.value === dateRange)?.label,
      moodCounts: {},
      averageIntensity: 0
    };

    filteredData?.forEach(([, entry]) => {
      summary.moodCounts[entry.type] = (summary?.moodCounts?.[entry?.type] || 0) + 1;
      summary.averageIntensity += entry?.intensity;
    });

    summary.averageIntensity = (summary?.averageIntensity / filteredData?.length)?.toFixed(1);

    return `Mood Tracking Report
Generated: ${new Date()?.toLocaleDateString()}
Date Range: ${summary?.dateRange}
Total Entries: ${summary?.totalEntries}
Average Intensity: ${summary?.averageIntensity}/10

Mood Distribution:
${Object.entries(summary?.moodCounts)?.map(([mood, count]) => `${mood}: ${count} times`)?.join('\n')}

Detailed Entries:
${filteredData?.map(([date, entry]) => 
  `${date}: ${entry?.type} (${entry?.intensity}/10) - ${entry?.notes || 'No notes'}`
)?.join('\n')}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredData = filterDataByRange(moodData);
      
      if (filteredData?.length === 0) {
        alert('No data available for the selected date range.');
        return;
      }

      let content, filename, mimeType;

      switch (exportFormat) {
        case 'csv':
          content = generateCSV(filteredData);
          filename = `mood-data-${dateRange}.csv`;
          mimeType = 'text/csv';
          break;
        
        case 'json':
          content = generateJSON(filteredData);
          filename = `mood-data-${dateRange}.json`;
          mimeType = 'application/json';
          break;
        
        case 'pdf':
          content = generatePDF(filteredData);
          filename = `mood-report-${dateRange}.txt`;
          mimeType = 'text/plain';
          break;
        
        default:
          throw new Error('Invalid export format');
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport({
          format: exportFormat,
          dateRange: dateRange,
          entriesCount: filteredData?.length
        });
      }

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getDataCount = () => {
    const filteredData = filterDataByRange(moodData);
    return filteredData?.length;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Export Mood Data
      </h3>
      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
            description="Choose the format for your exported data"
          />
        </div>

        {/* Date Range Selection */}
        <div>
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            description="Select the time period for export"
          />
        </div>

        {/* Data Preview */}
        <div className="p-4 rounded-lg bg-surface">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Export Preview</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Format: {formatOptions?.find(opt => opt?.value === exportFormat)?.label}</p>
            <p>• Date Range: {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}</p>
            <p>• Entries to Export: {getDataCount()} records</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-muted-foreground">
            Your data will be downloaded to your device
          </div>
          
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            disabled={getDataCount() === 0}
            iconName="Download"
            iconPosition="left"
          >
            Export Data
          </Button>
        </div>

        {/* Additional Options */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExportFormat('csv');
                setDateRange('last30');
              }}
              iconName="Calendar"
              iconPosition="left"
            >
              Last 30 Days CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExportFormat('pdf');
                setDateRange('thisMonth');
              }}
              iconName="FileText"
              iconPosition="left"
            >
              Monthly Report
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExportFormat('json');
                setDateRange('all');
              }}
              iconName="Database"
              iconPosition="left"
            >
              Complete Backup
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Privacy Notice</p>
              <p>Your mood data is exported locally to your device. No data is sent to external servers during export.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;