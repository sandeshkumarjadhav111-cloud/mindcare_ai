import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PatternInsights = ({ insights, correlations }) => {
  const [selectedInsight, setSelectedInsight] = useState(null);

  const insightTypes = {
    pattern: { icon: 'TrendingUp', color: 'var(--color-primary)' },
    trigger: { icon: 'AlertCircle', color: 'var(--color-warning)' },
    improvement: { icon: 'Target', color: 'var(--color-success)' },
    correlation: { icon: 'GitBranch', color: 'var(--color-secondary)' }
  };

  const priorityLevels = {
    high: { label: 'High Priority', color: 'var(--color-error)', bg: 'bg-error/10' },
    medium: { label: 'Medium Priority', color: 'var(--color-warning)', bg: 'bg-warning/10' },
    low: { label: 'Low Priority', color: 'var(--color-success)', bg: 'bg-success/10' }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            AI-Generated Insights
          </h3>
          <p className="text-sm text-muted-foreground">
            Personalized analysis based on your emotional patterns
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Brain" size={16} />
          <span>Updated 2 hours ago</span>
        </div>
      </div>
      {/* Insights List */}
      <div className="space-y-4 mb-6">
        {insights?.map((insight, index) => {
          const type = insightTypes?.[insight?.type];
          const priority = priorityLevels?.[insight?.priority];
          
          return (
            <div 
              key={index}
              className={`
                p-4 rounded-lg border border-border cursor-pointer therapeutic-transition
                ${selectedInsight === index ? 'bg-primary/5 border-primary/20' : 'hover:bg-surface'}
              `}
              onClick={() => setSelectedInsight(selectedInsight === index ? null : index)}
            >
              <div className="flex items-start space-x-3">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-surface"
                  style={{ backgroundColor: `${type?.color}20` }}
                >
                  <Icon 
                    name={type?.icon} 
                    size={16} 
                    style={{ color: type?.color }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">
                      {insight?.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${priority?.bg}`}
                        style={{ color: priority?.color }}
                      >
                        {priority?.label}
                      </span>
                      
                      <Icon 
                        name={selectedInsight === index ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                        className="text-muted-foreground"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight?.summary}
                  </p>
                  
                  {selectedInsight === index && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-foreground mb-2">
                            Detailed Analysis
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {insight?.details}
                          </p>
                        </div>
                        
                        {insight?.recommendations && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">
                              Recommendations
                            </h5>
                            <ul className="space-y-1">
                              {insight?.recommendations?.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                  <Icon name="ArrowRight" size={12} className="mt-0.5 text-primary" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {insight?.dataPoints && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">
                              Supporting Data
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              {insight?.dataPoints?.map((point, pointIndex) => (
                                <div key={pointIndex} className="bg-surface rounded-md p-2">
                                  <div className="text-xs text-muted-foreground">
                                    {point?.label}
                                  </div>
                                  <div className="text-sm font-medium text-foreground">
                                    {point?.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>Confidence: {insight?.confidence}%</span>
                    <span>Period: {formatDate(insight?.dateRange?.start)} - {formatDate(insight?.dateRange?.end)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Correlation Matrix */}
      <div className="pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">
          Correlation Analysis
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {correlations?.map((correlation, index) => (
            <div key={index} className="bg-surface rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name="GitBranch" size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    {correlation?.factors?.join(' ↔ ')}
                  </span>
                </div>
                
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${correlation?.strength >= 0.7 ? 'bg-success/10 text-success' :
                    correlation?.strength >= 0.4 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
                  }
                `}>
                  {correlation?.strength >= 0.7 ? 'Strong' :
                   correlation?.strength >= 0.4 ? 'Moderate' : 'Weak'}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full therapeutic-transition"
                    style={{ width: `${correlation?.strength * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {(correlation?.strength * 100)?.toFixed(0)}%
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {correlation?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 therapeutic-transition">
          <Icon name="Download" size={16} />
          <span>Export Insights Report</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-surface therapeutic-transition">
          <Icon name="Share2" size={16} />
          <span>Share with Therapist</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-surface therapeutic-transition">
          <Icon name="RefreshCw" size={16} />
          <span>Refresh Analysis</span>
        </button>
      </div>
    </div>
  );
};

export default PatternInsights;