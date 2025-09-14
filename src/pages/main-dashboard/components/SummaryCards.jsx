import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCards = ({ emotionState, currentUser }) => {
  const mockSummaryData = {
    currentMood: {
      score: 8.3,
      trend: 'improving',
      change: '+0.5',
      description: 'Feeling positive and energetic today'
    },
    weeklyProgress: {
      completedDays: 6,
      totalDays: 7,
      streakDays: 12,
      averageScore: 7.4
    },
    aiInsights: [
      "Your mood has been consistently improving over the past week",
      "Morning journaling sessions correlate with better afternoon mood scores",
      "Consider maintaining your current sleep schedule for optimal emotional balance"
    ],
    todayStats: {
      journalEntries: 2,
      moodCheckins: 4,
      voiceRecordings: 1,
      aiInteractions: 7
    }
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

  const getEmotionIcon = () => {
    if (!emotionState) return 'Heart';
    
    const emotionIcons = {
      calm: 'Smile',
      happy: 'Laugh',
      anxious: 'Frown',
      sad: 'CloudRain',
      stressed: 'Zap',
      neutral: 'Meh'
    };
    
    return emotionIcons?.[emotionState?.type] || 'Heart';
  };

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? 'TrendingUp' : trend === 'declining' ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = (trend) => {
    return trend === 'improving' ? 'var(--color-success)' : trend === 'declining' ? 'var(--color-error)' : 'var(--color-muted-foreground)';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Mood Card */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft breathing-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: `${getEmotionColor()}20` }}
            >
              <Icon 
                name={getEmotionIcon()} 
                size={20} 
                color={getEmotionColor()}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Current Mood</h4>
              <p className="text-2xl font-heading font-bold text-foreground">
                {mockSummaryData?.currentMood?.score}/10
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon 
              name={getTrendIcon(mockSummaryData?.currentMood?.trend)} 
              size={16} 
              color={getTrendColor(mockSummaryData?.currentMood?.trend)}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: getTrendColor(mockSummaryData?.currentMood?.trend) }}
            >
              {mockSummaryData?.currentMood?.change}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {mockSummaryData?.currentMood?.description}
        </p>
      </div>
      {/* Weekly Progress Card */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft breathing-hover">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
            <Icon name="Calendar" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Weekly Progress</h4>
            <p className="text-2xl font-heading font-bold text-foreground">
              {mockSummaryData?.weeklyProgress?.completedDays}/{mockSummaryData?.weeklyProgress?.totalDays}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium text-foreground">
              {Math.round((mockSummaryData?.weeklyProgress?.completedDays / mockSummaryData?.weeklyProgress?.totalDays) * 100)}%
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full therapeutic-transition"
              style={{ 
                width: `${(mockSummaryData?.weeklyProgress?.completedDays / mockSummaryData?.weeklyProgress?.totalDays) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {mockSummaryData?.weeklyProgress?.streakDays} day streak
          </p>
        </div>
      </div>
      {/* AI Insights Card */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft breathing-hover">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
            <Icon name="Brain" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">AI Insights</h4>
            <p className="text-sm font-heading font-semibold text-foreground">
              Personalized Tips
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {mockSummaryData?.aiInsights?.slice(0, 2)?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Today's Activity Card */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft breathing-hover">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <Icon name="Activity" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Today's Activity</h4>
            <p className="text-sm font-heading font-semibold text-foreground">
              {Object.values(mockSummaryData?.todayStats)?.reduce((a, b) => a + b, 0)} Total Actions
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {mockSummaryData?.todayStats?.journalEntries}
            </p>
            <p className="text-xs text-muted-foreground">Journal Entries</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {mockSummaryData?.todayStats?.moodCheckins}
            </p>
            <p className="text-xs text-muted-foreground">Mood Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {mockSummaryData?.todayStats?.voiceRecordings}
            </p>
            <p className="text-xs text-muted-foreground">Voice Notes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {mockSummaryData?.todayStats?.aiInteractions}
            </p>
            <p className="text-xs text-muted-foreground">AI Chats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;