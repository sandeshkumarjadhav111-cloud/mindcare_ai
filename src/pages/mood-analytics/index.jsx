import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MoodTrendChart from './components/MoodTrendChart';
import EmotionBreakdown from './components/EmotionBreakdown';
import PatternInsights from './components/PatternInsights';
import ProgressTracking from './components/ProgressTracking';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';

const MoodAnalytics = () => {
  const navigate = useNavigate();
  const [currentUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@mindcare.ai",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  });

  const [emotionState] = useState({
    type: 'calm',
    confidence: 0.85,
    timestamp: new Date()
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [filters, setFilters] = useState({
    timeRange: '30d',
    emotions: ['all'],
    sources: ['all'],
    startDate: '',
    endDate: '',
    minConfidence: 0,
    includeNeutral: true
  });

  // Mock data for mood trends
  const [moodTrendData] = useState([
    { date: 'Sep 1', happiness: 75, anxiety: 25, stress: 30, calmness: 80, energy: 65 },
    { date: 'Sep 3', happiness: 82, anxiety: 20, stress: 25, calmness: 85, energy: 70 },
    { date: 'Sep 5', happiness: 68, anxiety: 35, stress: 40, calmness: 70, energy: 55 },
    { date: 'Sep 7', happiness: 90, anxiety: 15, stress: 20, calmness: 90, energy: 85 },
    { date: 'Sep 9', happiness: 78, anxiety: 22, stress: 28, calmness: 82, energy: 68 },
    { date: 'Sep 11', happiness: 85, anxiety: 18, stress: 22, calmness: 88, energy: 75 },
    { date: 'Sep 13', happiness: 88, anxiety: 16, stress: 18, calmness: 92, energy: 80 }
  ]);

  // Mock data for emotion breakdown
  const [emotionBreakdownData] = useState([
    { emotion: 'happy', count: 145, percentage: 32.2, color: '#48BB78' },
    { emotion: 'calm', count: 128, percentage: 28.4, color: '#4A90A4' },
    { emotion: 'neutral', count: 89, percentage: 19.8, color: '#718096' },
    { emotion: 'anxious', count: 52, percentage: 11.6, color: '#ED8936' },
    { emotion: 'sad', count: 28, percentage: 6.2, color: '#7B68A6' },
    { emotion: 'stressed', count: 8, percentage: 1.8, color: '#E53E3E' }
  ]);

  // Mock data for AI insights
  const [insights] = useState([
    {
      type: 'pattern',
      priority: 'high',
      title: 'Evening Mood Dips Detected',
      summary: 'Your mood consistently drops between 6-8 PM on weekdays',
      details: `Analysis of your mood data over the past 30 days shows a recurring pattern of decreased happiness and increased anxiety during evening hours on weekdays. This pattern is most pronounced on Mondays and Wednesdays, with mood scores dropping by an average of 25% during this time window.`,
      recommendations: [
        'Consider scheduling relaxing activities during evening hours',
        'Practice mindfulness or meditation between 5:30-6:00 PM',
        'Limit work-related activities after 6 PM',
        'Establish a consistent evening routine'
      ],
      confidence: 87,
      dateRange: {
        start: '2025-08-14',
        end: '2025-09-13'
      },
      dataPoints: [
        { label: 'Affected Days', value: '18 out of 30' },
        { label: 'Avg Mood Drop', value: '25%' },
        { label: 'Peak Time', value: '7:15 PM' },
        { label: 'Recovery Time', value: '9:30 PM' }
      ]
    },
    {
      type: 'trigger',
      priority: 'medium',
      title: 'Work Stress Correlation',
      summary: 'High correlation between work meetings and stress levels',
      details: `Your stress levels show a strong positive correlation (r=0.73) with the number of work meetings scheduled per day. Days with 4+ meetings consistently result in stress scores above 60%, while days with fewer than 2 meetings maintain stress levels below 30%.`,
      recommendations: [
        'Schedule buffer time between meetings',
        'Practice deep breathing exercises before important meetings',
        'Consider blocking meeting-free time slots',
        'Use stress-reduction techniques during busy days'
      ],
      confidence: 73,
      dateRange: {
        start: '2025-08-14',
        end: '2025-09-13'
      },
      dataPoints: [
        { label: 'Correlation Strength', value: '0.73' },
        { label: 'High Meeting Days', value: '12 days' },
        { label: 'Avg Stress Increase', value: '45%' },
        { label: 'Recovery Period', value: '2-3 hours' }
      ]
    },
    {
      type: 'improvement',
      priority: 'low',
      title: 'Weekend Recovery Pattern',
      summary: 'Excellent mood recovery during weekends',
      details: `Your weekend mood patterns show consistent improvement, with happiness scores averaging 15% higher than weekdays. This suggests effective stress recovery and work-life balance maintenance during non-work periods.`,
      recommendations: [
        'Maintain current weekend routines',
        'Consider incorporating weekend activities into weekdays',
        'Use weekend strategies for evening relaxation',
        'Plan mini-breaks during the work week'
      ],
      confidence: 92,
      dateRange: {
        start: '2025-08-14',
        end: '2025-09-13'
      },
      dataPoints: [
        { label: 'Weekend Improvement', value: '+15%' },
        { label: 'Recovery Rate', value: '95%' },
        { label: 'Consistency', value: '8/8 weekends' },
        { label: 'Peak Day', value: 'Sunday' }
      ]
    }
  ]);

  // Mock data for correlations
  const [correlations] = useState([
    {
      factors: ['Sleep Quality', 'Mood Stability'],
      strength: 0.82,
      description: 'Better sleep quality strongly correlates with improved mood stability the following day.'
    },
    {
      factors: ['Exercise', 'Stress Levels'],
      strength: -0.67,
      description: 'Regular exercise sessions show inverse correlation with daily stress measurements.'
    },
    {
      factors: ['Social Interactions', 'Happiness'],
      strength: 0.74,
      description: 'Days with more social interactions consistently show higher happiness scores.'
    },
    {
      factors: ['Work Hours', 'Anxiety'],
      strength: 0.58,
      description: 'Extended work hours moderately correlate with increased anxiety levels.'
    }
  ]);

  // Mock data for progress tracking
  const [progressData] = useState([
    { period: 'Week 1', mood_stability: 65, stress_reduction: 45, anxiety_management: 55, emotional_awareness: 70 },
    { period: 'Week 2', mood_stability: 72, stress_reduction: 52, anxiety_management: 62, emotional_awareness: 75 },
    { period: 'Week 3', mood_stability: 78, stress_reduction: 58, anxiety_management: 68, emotional_awareness: 82 },
    { period: 'Week 4', mood_stability: 85, stress_reduction: 65, anxiety_management: 75, emotional_awareness: 88 }
  ]);

  // Mock data for goals
  const [goals] = useState([
    {
      type: 'mood_stability',
      current: 85,
      target: 90,
      deadline: 'Oct 15, 2025'
    },
    {
      type: 'stress_reduction',
      current: 65,
      target: 80,
      deadline: 'Oct 30, 2025'
    },
    {
      type: 'anxiety_management',
      current: 75,
      target: 85,
      deadline: 'Nov 15, 2025'
    },
    {
      type: 'emotional_awareness',
      current: 88,
      target: 95,
      deadline: 'Dec 1, 2025'
    }
  ]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedTimeRange(newFilters?.timeRange);
  };

  const handleExport = () => {
    // Mock export functionality
    const exportData = {
      moodTrends: moodTrendData,
      emotionBreakdown: emotionBreakdownData,
      insights: insights,
      correlations: correlations,
      progress: progressData,
      filters: filters,
      exportDate: new Date()?.toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-analytics-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedTimeRange('30d');
  };

  useEffect(() => {
    document.title = 'Mood Analytics - MindCare AI';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        emotionState={emotionState}
        onNavigate={handleNavigate}
      />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Icon name="TrendingUp" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Mood Analytics
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive emotional pattern analysis and insights
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {emotionBreakdownData?.reduce((sum, item) => sum + item?.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {emotionBreakdownData?.filter(item => ['happy', 'calm', 'excited']?.includes(item?.emotion))?.reduce((sum, item) => sum + item?.percentage, 0)?.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Positive Emotions</div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {insights?.length}
                </div>
                <div className="text-sm text-muted-foreground">AI Insights</div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {Math.round(goals?.reduce((sum, goal) => sum + (goal?.current / goal?.target * 100), 0) / goals?.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onReset={handleReset}
          />

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="xl:col-span-2 space-y-6">
              <MoodTrendChart
                data={moodTrendData}
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={setSelectedTimeRange}
              />
              
              <ProgressTracking
                progressData={progressData}
                goals={goals}
              />
            </div>

            {/* Right Column - Breakdown & Insights */}
            <div className="space-y-6">
              <EmotionBreakdown
                data={emotionBreakdownData}
                totalEntries={emotionBreakdownData?.reduce((sum, item) => sum + item?.count, 0)}
              />
              
              <PatternInsights
                insights={insights}
                correlations={correlations}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/mood-tracking')}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 therapeutic-transition"
              >
                <Icon name="Plus" size={20} />
                <span>Add New Mood Entry</span>
              </button>
              
              <button
                onClick={() => navigate('/interactive-journal')}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface therapeutic-transition"
              >
                <Icon name="BookOpen" size={20} />
                <span>Write in Journal</span>
              </button>
              
              <button
                onClick={() => navigate('/ai-chat-interface')}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface therapeutic-transition"
              >
                <Icon name="MessageCircle" size={20} />
                <span>Talk to AI Companion</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodAnalytics;