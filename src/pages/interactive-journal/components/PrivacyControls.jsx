import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacyControls = ({ privacySettings, onSettingsChange, onExport }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportDateRange, setExportDateRange] = useState('all');

  const handleSettingChange = (setting, value) => {
    onSettingsChange({
      ...privacySettings,
      [setting]: value
    });
  };

  const handleExport = () => {
    const exportData = {
      format: exportFormat,
      dateRange: exportDateRange,
      includeEmotions: privacySettings?.includeEmotionsInExport,
      includeAISummaries: privacySettings?.includeAISummariesInExport
    };
    
    onExport(exportData);
    setShowExportOptions(false);
  };

  const encryptionStatus = privacySettings?.encryptionEnabled ? 'enabled' : 'disabled';
  const backupStatus = privacySettings?.autoBackup ? 'enabled' : 'disabled';

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Privacy & Security
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Control how your journal data is protected and shared
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Encryption Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Data Protection
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name="Lock" 
                  size={20} 
                  color={privacySettings?.encryptionEnabled ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    End-to-End Encryption
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your journal entries are encrypted before storage
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  privacySettings?.encryptionEnabled 
                    ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {encryptionStatus}
                </span>
                <Checkbox
                  checked={privacySettings?.encryptionEnabled}
                  onChange={(e) => handleSettingChange('encryptionEnabled', e?.target?.checked)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name="Cloud" 
                  size={20} 
                  color={privacySettings?.autoBackup ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Automatic Backup
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Securely backup your entries to encrypted cloud storage
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  privacySettings?.autoBackup 
                    ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                }`}>
                  {backupStatus}
                </span>
                <Checkbox
                  checked={privacySettings?.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Data Usage */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            AI Data Usage
          </h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Allow AI emotion analysis"
              description="Enable AI to analyze emotions from your writing for insights"
              checked={privacySettings?.allowEmotionAnalysis}
              onChange={(e) => handleSettingChange('allowEmotionAnalysis', e?.target?.checked)}
            />
            
            <Checkbox
              label="Generate AI summaries"
              description="Create AI-powered summaries of your journal entries"
              checked={privacySettings?.generateAISummaries}
              onChange={(e) => handleSettingChange('generateAISummaries', e?.target?.checked)}
            />
            
            <Checkbox
              label="Personalized recommendations"
              description="Receive AI-generated writing prompts based on your patterns"
              checked={privacySettings?.personalizedRecommendations}
              onChange={(e) => handleSettingChange('personalizedRecommendations', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Sharing Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Sharing & Access
          </h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Anonymous research participation"
              description="Contribute anonymized data to mental health research (optional)"
              checked={privacySettings?.anonymousResearch}
              onChange={(e) => handleSettingChange('anonymousResearch', e?.target?.checked)}
            />
            
            <Checkbox
              label="Therapist access (if applicable)"
              description="Allow your therapist to view entries you choose to share"
              checked={privacySettings?.therapistAccess}
              onChange={(e) => handleSettingChange('therapistAccess', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Data Retention */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Data Retention
          </h4>
          
          <div className="bg-accent/10 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5" />
              <div>
                <p className="text-sm text-foreground mb-1">
                  Automatic Deletion
                </p>
                <p className="text-xs text-muted-foreground">
                  Entries older than {privacySettings?.retentionPeriod || '2 years'} will be automatically deleted unless marked as important.
                </p>
              </div>
            </div>
          </div>
          
          <select
            value={privacySettings?.retentionPeriod || '2-years'}
            onChange={(e) => handleSettingChange('retentionPeriod', e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
          >
            <option value="6-months">6 months</option>
            <option value="1-year">1 year</option>
            <option value="2-years">2 years</option>
            <option value="5-years">5 years</option>
            <option value="never">Never delete</option>
          </select>
        </div>

        {/* Export Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Data Export
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              iconName="Download"
              iconPosition="left"
            >
              Export Data
            </Button>
          </div>

          {showExportOptions && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e?.target?.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="json">JSON Data</option>
                  <option value="txt">Plain Text</option>
                  <option value="csv">CSV Spreadsheet</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Date Range
                </label>
                <select
                  value={exportDateRange}
                  onChange={(e) => setExportDateRange(e?.target?.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                >
                  <option value="all">All entries</option>
                  <option value="last-month">Last month</option>
                  <option value="last-3-months">Last 3 months</option>
                  <option value="last-year">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div className="space-y-2">
                <Checkbox
                  label="Include emotion analysis"
                  checked={privacySettings?.includeEmotionsInExport}
                  onChange={(e) => handleSettingChange('includeEmotionsInExport', e?.target?.checked)}
                />
                <Checkbox
                  label="Include AI summaries"
                  checked={privacySettings?.includeAISummariesInExport}
                  onChange={(e) => handleSettingChange('includeAISummariesInExport', e?.target?.checked)}
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleExport}
                  iconName="Download"
                  iconPosition="left"
                  className="flex-1"
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportOptions(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Security Status */}
        <div className="bg-success/10 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
            <h4 className="text-sm font-medium text-foreground">
              Security Status
            </h4>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>✓ Data encrypted with AES-256</p>
            <p>✓ Secure HTTPS connection</p>
            <p>✓ Regular security audits</p>
            <p>✓ HIPAA compliant infrastructure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControls;