import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MoodTrendChart from './components/MoodTrendChart';
import SummaryCards from './components/SummaryCards';
import RecentJournalEntries from './components/RecentJournalEntries';
import QuickActions from './components/QuickActions';
import NotificationPanel from './components/NotificationPanel';
import EmotionFeedback from './components/EmotionFeedback';

const MainDashboard = () => {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@mindcare.ai',
    joinDate: '2025-08-15',
    timezone: 'America/New_York'
  });

  const [emotionState, setEmotionState] = useState({
    type: 'calm',
    confidence: 0.85,
    intensity: 0.7,
    timestamp: new Date(),
    sources: ['text', 'voice', 'facial']
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading and emotion detection
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Simulate real-time emotion updates
    const emotionTimer = setInterval(() => {
      const emotions = ['calm', 'happy', 'focused', 'neutral'];
      const randomEmotion = emotions?.[Math.floor(Math.random() * emotions?.length)];
      
      setEmotionState(prev => ({
        ...prev,
        type: randomEmotion,
        confidence: 0.7 + Math.random() * 0.3,
        intensity: 0.4 + Math.random() * 0.6,
        timestamp: new Date()
      }));
    }, 15000); // Update every 15 seconds

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(emotionTimer);
    };
  }, []);

  const handleMoodCheckIn = () => {
    // Simulate mood check-in modal or navigation
    console.log('Opening mood check-in interface...');
  };

  const handleNavigation = (path) => {
    // Handle navigation through header
    console.log(`Navigating to: ${path}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Loading your dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Analyzing your emotional patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        currentUser={currentUser}
        emotionState={emotionState}
        onNavigate={handleNavigation}
      />
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Welcome back, {currentUser?.name?.split(' ')?.[0]}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Here's your mental wellness overview for today
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date()?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date()?.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mood Trend Chart */}
              <MoodTrendChart emotionState={emotionState} />

              {/* Summary Cards */}
              <SummaryCards 
                emotionState={emotionState} 
                currentUser={currentUser} 
              />

              {/* Recent Journal Entries */}
              <RecentJournalEntries emotionState={emotionState} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Real-time Emotion Feedback */}
              <EmotionFeedback emotionState={emotionState} />

              {/* Quick Actions */}
              <QuickActions 
                emotionState={emotionState}
                onMoodCheckIn={handleMoodCheckIn}
              />

              {/* Notifications */}
              <NotificationPanel emotionState={emotionState} />
            </div>
          </div>

          {/* Bottom Section - Additional Insights */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weekly Goals */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Weekly Goals
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Daily mood check-ins</span>
                    <span className="text-sm font-medium text-foreground">6/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Journal entries</span>
                    <span className="text-sm font-medium text-foreground">4/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI conversations</span>
                    <span className="text-sm font-medium text-foreground">12/10</span>
                  </div>
                </div>
              </div>

              {/* Mood Patterns */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Mood Patterns
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best time of day</span>
                    <span className="text-sm font-medium text-foreground">Morning</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Most common mood</span>
                    <span className="text-sm font-medium text-foreground">Calm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Improvement trend</span>
                    <span className="text-sm font-medium text-success">+15%</span>
                  </div>
                </div>
              </div>

              {/* Support Resources */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Support Resources
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground therapeutic-transition">
                    Guided meditation library
                  </button>
                  <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground therapeutic-transition">
                    Breathing exercises
                  </button>
                  <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground therapeutic-transition">
                    Professional therapist directory
                  </button>
                  <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground therapeutic-transition">
                    Crisis support hotlines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;