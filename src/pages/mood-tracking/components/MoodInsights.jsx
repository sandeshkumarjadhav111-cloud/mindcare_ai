import React from 'react';
import Icon from '../../../components/AppIcon';

const MoodInsights = ({ moodData, selectedDate }) => {
  const calculateInsights = () => {
    const entries = Object.values(moodData);
    if (entries?.length === 0) return null;

    // Calculate mood frequency
    const moodCounts = {};
    let totalIntensity = 0;
    let recentEntries = [];

    entries?.forEach(entry => {
      moodCounts[entry.type] = (moodCounts?.[entry?.type] || 0) + 1;
      totalIntensity += entry?.intensity;
      
      // Get entries from last 7 days
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      if (entryDate >= weekAgo) {
        recentEntries?.push(entry);
      }
    });

    const mostCommonMood = Object.entries(moodCounts)?.reduce((a, b) => 
      moodCounts?.[a?.[0]] > moodCounts?.[b?.[0]] ? a : b
    )?.[0];

    const averageIntensity = (totalIntensity / entries?.length)?.toFixed(1);
    
    // Calculate trend
    const sortedRecent = recentEntries?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let trend = 'stable';
    if (sortedRecent?.length >= 3) {
      const firstHalf = sortedRecent?.slice(0, Math.floor(sortedRecent?.length / 2));
      const secondHalf = sortedRecent?.slice(Math.floor(sortedRecent?.length / 2));
      
      const firstAvg = firstHalf?.reduce((sum, entry) => sum + entry?.intensity, 0) / firstHalf?.length;
      const secondAvg = secondHalf?.reduce((sum, entry) => sum + entry?.intensity, 0) / secondHalf?.length;
      
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      else if (secondAvg < firstAvg - 0.5) trend = 'declining';
    }

    return {
      totalEntries: entries?.length,
      mostCommonMood,
      averageIntensity,
      recentEntries: recentEntries?.length,
      trend,
      moodCounts
    };
  };

  const insights = calculateInsights();

  const moodIcons = {
    happy: { icon: 'Smile', color: 'text-green-500' },
    calm: { icon: 'Waves', color: 'text-blue-500' },
    neutral: { icon: 'Minus', color: 'text-gray-500' },
    anxious: { icon: 'Zap', color: 'text-yellow-500' },
    sad: { icon: 'Frown', color: 'text-purple-500' },
    stressed: { icon: 'AlertTriangle', color: 'text-red-500' }
  };

  const trendIcons = {
    improving: { icon: 'TrendingUp', color: 'text-green-500', label: 'Improving' },
    declining: { icon: 'TrendingDown', color: 'text-red-500', label: 'Needs Attention' },
    stable: { icon: 'Minus', color: 'text-blue-500', label: 'Stable' }
  };

  if (!insights) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-soft p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Mood Insights
        </h3>
        <div className="text-center py-8">
          <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Start logging your moods to see insights and patterns
          </p>
        </div>
      </div>
    );
  }

  const currentMood = moodData?.[selectedDate?.toISOString()?.split('T')?.[0]];
  const trendInfo = trendIcons?.[insights?.trend];

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Mood Insights
      </h3>
      <div className="space-y-6">
        {/* Current Day Mood */}
        {currentMood && (
          <div className="p-4 rounded-lg bg-surface">
            <h4 className="text-sm font-medium text-foreground mb-2">Today's Mood</h4>
            <div className="flex items-center space-x-3">
              <Icon 
                name={moodIcons?.[currentMood?.type]?.icon || 'Circle'} 
                size={24} 
                className={moodIcons?.[currentMood?.type]?.color || 'text-gray-500'}
              />
              <div>
                <span className="text-base font-medium text-foreground capitalize">
                  {currentMood?.type}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  Intensity: {currentMood?.intensity}/10
                </span>
              </div>
            </div>
            {currentMood?.notes && (
              <p className="text-sm text-muted-foreground mt-2 italic">
                "{currentMood?.notes}"
              </p>
            )}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-surface">
            <div className="text-2xl font-bold text-foreground">{insights?.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-surface">
            <div className="text-2xl font-bold text-foreground">{insights?.averageIntensity}</div>
            <div className="text-sm text-muted-foreground">Avg Intensity</div>
          </div>
        </div>

        {/* Most Common Mood */}
        <div className="p-4 rounded-lg bg-surface">
          <h4 className="text-sm font-medium text-foreground mb-3">Most Common Mood</h4>
          <div className="flex items-center space-x-3">
            <Icon 
              name={moodIcons?.[insights?.mostCommonMood]?.icon || 'Circle'} 
              size={20} 
              className={moodIcons?.[insights?.mostCommonMood]?.color || 'text-gray-500'}
            />
            <span className="text-base font-medium text-foreground capitalize">
              {insights?.mostCommonMood}
            </span>
            <span className="text-sm text-muted-foreground">
              ({insights?.moodCounts?.[insights?.mostCommonMood]} times)
            </span>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="p-4 rounded-lg bg-surface">
          <h4 className="text-sm font-medium text-foreground mb-3">7-Day Trend</h4>
          <div className="flex items-center space-x-3">
            <Icon 
              name={trendInfo?.icon} 
              size={20} 
              className={trendInfo?.color}
            />
            <span className="text-base font-medium text-foreground">
              {trendInfo?.label}
            </span>
            <span className="text-sm text-muted-foreground">
              ({insights?.recentEntries} recent entries)
            </span>
          </div>
        </div>

        {/* Mood Distribution */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Mood Distribution</h4>
          <div className="space-y-2">
            {Object.entries(insights?.moodCounts)?.sort(([,a], [,b]) => b - a)?.map(([mood, count]) => {
                const percentage = ((count / insights?.totalEntries) * 100)?.toFixed(1);
                return (
                  <div key={mood} className="flex items-center space-x-3">
                    <Icon 
                      name={moodIcons?.[mood]?.icon || 'Circle'} 
                      size={16} 
                      className={moodIcons?.[mood]?.color || 'text-gray-500'}
                    />
                    <span className="text-sm text-foreground capitalize flex-1">
                      {mood}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} className="text-primary" />
            <span>Insights & Tips</span>
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {insights?.trend === 'improving' && (
              <p>• Great progress! Your mood trend is improving over the past week.</p>
            )}
            {insights?.trend === 'declining' && (
              <p>• Consider reaching out for support or trying relaxation techniques.</p>
            )}
            {insights?.averageIntensity > 7 && (
              <p>• High intensity levels detected. Consider stress management techniques.</p>
            )}
            {insights?.recentEntries < 3 && (
              <p>• Try logging your mood daily for better insights and patterns.</p>
            )}
            <p>• Regular mood tracking helps identify triggers and patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodInsights;