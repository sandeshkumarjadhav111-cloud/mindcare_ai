import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MoodCalendar from './components/MoodCalendar';
import MoodLogger from './components/MoodLogger';
import MoodInsights from './components/MoodInsights';
import ExportControls from './components/ExportControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MoodTracking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@mindcare.ai"
  });
  const [emotionState] = useState({
    type: 'calm',
    confidence: 0.85
  });

  // Mock mood data - in real app this would come from API/database
  const [moodData, setMoodData] = useState({
    "2025-01-10": {
      type: "happy",
      intensity: 8,
      notes: "Had a great day at work, completed my project successfully!",
      timestamp: "2025-01-10T14:30:00.000Z"
    },
    "2025-01-09": {
      type: "calm",
      intensity: 6,
      notes: "Peaceful morning meditation session",
      timestamp: "2025-01-09T09:15:00.000Z"
    },
    "2025-01-08": {
      type: "anxious",
      intensity: 7,
      notes: "Worried about upcoming presentation",
      timestamp: "2025-01-08T16:45:00.000Z"
    },
    "2025-01-07": {
      type: "neutral",
      intensity: 5,
      notes: "Regular day, nothing special",
      timestamp: "2025-01-07T12:00:00.000Z"
    },
    "2025-01-06": {
      type: "stressed",
      intensity: 8,
      notes: "Deadline pressure at work",
      timestamp: "2025-01-06T18:20:00.000Z"
    },
    "2025-01-05": {
      type: "happy",
      intensity: 9,
      notes: "Spent quality time with family",
      timestamp: "2025-01-05T19:30:00.000Z"
    },
    "2025-01-04": {
      type: "sad",
      intensity: 4,
      notes: "Feeling a bit down today",
      timestamp: "2025-01-04T11:15:00.000Z"
    },
    "2025-01-03": {
      type: "calm",
      intensity: 7,
      notes: "Relaxing weekend",
      timestamp: "2025-01-03T15:45:00.000Z"
    },
    "2025-01-02": {
      type: "anxious",
      intensity: 6,
      notes: "New year resolutions anxiety",
      timestamp: "2025-01-02T10:30:00.000Z"
    },
    "2025-01-01": {
      type: "happy",
      intensity: 8,
      notes: "New Year celebration with friends!",
      timestamp: "2025-01-01T23:59:00.000Z"
    }
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab('logger');
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleMoodLog = async (moodEntry) => {
    const dateKey = moodEntry?.date?.toISOString()?.split('T')?.[0];
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMoodData(prev => ({
      ...prev,
      [dateKey]: moodEntry
    }));

    // Show success feedback
    console.log('Mood logged successfully:', moodEntry);
  };

  const handleExport = (exportInfo) => {
    console.log('Export completed:', exportInfo);
    // In real app, could show toast notification or analytics tracking
  };

  const getCurrentMood = () => {
    const dateKey = selectedDate?.toISOString()?.split('T')?.[0];
    return moodData?.[dateKey];
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'logger', label: 'Log Mood', icon: 'Heart' },
    { id: 'insights', label: 'Insights', icon: 'BarChart3' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  // Set today as selected date on mount
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        emotionState={emotionState}
        onNavigate={handleNavigation}
      />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon name="Heart" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Mood Tracking
                </h1>
                <p className="text-muted-foreground">
                  Monitor your emotional patterns and gain insights into your mental wellness
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{Object.keys(moodData)?.length}</div>
                <div className="text-sm text-muted-foreground">Total Entries</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Object.values(moodData)?.filter(entry => {
                    const entryDate = new Date(entry.timestamp);
                    const weekAgo = new Date();
                    weekAgo?.setDate(weekAgo?.getDate() - 7);
                    return entryDate >= weekAgo;
                  })?.length}
                </div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {(Object.values(moodData)?.reduce((sum, entry) => sum + entry?.intensity, 0) / Object.values(moodData)?.length)?.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Intensity</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {getCurrentMood() ? getCurrentMood()?.intensity : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      therapeutic-transition
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {activeTab === 'calendar' && (
                <MoodCalendar
                  moodData={moodData}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  currentMonth={currentMonth}
                  onMonthChange={handleMonthChange}
                />
              )}

              {activeTab === 'logger' && (
                <MoodLogger
                  selectedDate={selectedDate}
                  onMoodLog={handleMoodLog}
                  currentMood={getCurrentMood()}
                />
              )}

              {activeTab === 'insights' && (
                <MoodInsights
                  moodData={moodData}
                  selectedDate={selectedDate}
                />
              )}

              {activeTab === 'export' && (
                <ExportControls
                  moodData={moodData}
                  onExport={handleExport}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Always show insights in sidebar when not active tab */}
              {activeTab !== 'insights' && (
                <MoodInsights
                  moodData={moodData}
                  selectedDate={selectedDate}
                />
              )}

              {/* Quick Actions */}
              <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="MessageCircle"
                    iconPosition="left"
                    onClick={() => handleNavigation('/ai-chat-interface')}
                  >
                    Talk to AI Companion
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BookOpen"
                    iconPosition="left"
                    onClick={() => handleNavigation('/interactive-journal')}
                  >
                    Write in Journal
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="TrendingUp"
                    iconPosition="left"
                    onClick={() => handleNavigation('/mood-analytics')}
                  >
                    View Analytics
                  </Button>
                </div>
              </div>

              {/* Mood Reminders */}
              <div className="bg-card rounded-xl border border-border shadow-soft p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Reminders
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5">
                    <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Daily Check-in</p>
                      <p className="text-muted-foreground">Log your mood every evening</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/5">
                    <Icon name="Target" size={16} className="text-secondary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Weekly Review</p>
                      <p className="text-muted-foreground">Analyze patterns every Sunday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-success/5">
                    <Icon name="Heart" size={16} className="text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Self-Care</p>
                      <p className="text-muted-foreground">Practice mindfulness daily</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodTracking;