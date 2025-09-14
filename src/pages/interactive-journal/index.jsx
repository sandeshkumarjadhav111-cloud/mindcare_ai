import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import JournalEditor from './components/JournalEditor';
import EmotionAnalysis from './components/EmotionAnalysis';
import JournalHistory from './components/JournalHistory';
import MoodTagging from './components/MoodTagging';
import PrivacyControls from './components/PrivacyControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InteractiveJournal = () => {
  const navigate = useNavigate();
  
  // Main state management
  const [currentUser] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@mindcare.ai",
    id: 1
  });

  const [journalContent, setJournalContent] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [activePanel, setActivePanel] = useState('editor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mood tagging state
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [customTags, setCustomTags] = useState([]);

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    encryptionEnabled: true,
    autoBackup: true,
    allowEmotionAnalysis: true,
    generateAISummaries: true,
    personalizedRecommendations: true,
    anonymousResearch: false,
    therapistAccess: false,
    retentionPeriod: '2-years',
    includeEmotionsInExport: true,
    includeAISummariesInExport: true
  });

  // Auto-save functionality
  useEffect(() => {
    if (journalContent?.length > 0) {
      setAutoSaveStatus('saving');
      const saveTimer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1500);

      return () => clearTimeout(saveTimer);
    }
  }, [journalContent]);

  // Word count calculation
  const wordCount = journalContent?.trim() ? journalContent?.trim()?.split(/\s+/)?.length : 0;

  // Handle content changes
  const handleContentChange = useCallback((content) => {
    setJournalContent(content);
  }, []);

  // Handle emotion detection
  const handleEmotionDetected = useCallback((emotion) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setCurrentEmotion(emotion);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  // Handle voice recording toggle
  const handleVoiceToggle = useCallback(() => {
    setIsVoiceRecording(!isVoiceRecording);
    
    if (!isVoiceRecording) {
      // Simulate voice-to-text after 3 seconds
      setTimeout(() => {
        const voiceText = "\n\nI'm feeling overwhelmed today with all the tasks I need to complete. The pressure is building up and I can feel my anxiety rising. I need to take a step back and breathe.";
        setJournalContent(prev => prev + voiceText);
        setIsVoiceRecording(false);
      }, 3000);
    }
  }, [isVoiceRecording]);

  // Handle entry selection from history
  const handleEntrySelect = useCallback((entry) => {
    setSelectedEntryId(entry?.id);
    setJournalContent(entry?.preview + "\n\nThis is the full content of the journal entry that would be loaded from the database. The preview only shows the first few lines, but the complete entry would contain much more detailed thoughts, reflections, and emotional expressions.");
    
    // Set emotion based on entry
    const emotionMap = {
      calm: { type: 'calm', confidence: 0.8 },
      stressed: { type: 'stressed', confidence: 0.9 },
      happy: { type: 'happy', confidence: 0.85 },
      sad: { type: 'sad', confidence: 0.75 },
      hopeful: { type: 'hopeful', confidence: 0.7 }
    };
    
    setCurrentEmotion(emotionMap?.[entry?.emotion] || null);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Handle data export
  const handleExport = useCallback((exportData) => {
    console.log('Exporting data:', exportData);
    // Simulate export process
    setTimeout(() => {
      alert(`Journal data exported successfully as ${exportData?.format?.toUpperCase()}!`);
    }, 1000);
  }, []);

  // Panel configurations
  const panels = [
    { id: 'editor', label: 'Write', icon: 'PenTool' },
    { id: 'emotions', label: 'Emotions', icon: 'Heart' },
    { id: 'history', label: 'History', icon: 'BookOpen' },
    { id: 'moods', label: 'Moods', icon: 'Tag' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' }
  ];

  // Render active panel content
  const renderActivePanel = () => {
    switch (activePanel) {
      case 'editor':
        return (
          <JournalEditor
            content={journalContent}
            onContentChange={handleContentChange}
            onEmotionDetected={handleEmotionDetected}
            isVoiceRecording={isVoiceRecording}
            onVoiceToggle={handleVoiceToggle}
            wordCount={wordCount}
            autoSaveStatus={autoSaveStatus}
          />
        );
      case 'emotions':
        return (
          <EmotionAnalysis
            emotion={currentEmotion}
            isAnalyzing={isAnalyzing}
            insights={currentEmotion ? {
              summary: `You appear to be feeling ${currentEmotion.type} with ${Math.round(currentEmotion.confidence * 100)}% confidence.`,
              suggestions: [
                "Take a moment to acknowledge this feeling",
                "Consider what triggered this emotion",
                "Practice mindful breathing if needed"
              ],
              patterns: []
            } : null}
          />
        );
      case 'history':
        return (
          <JournalHistory
            onEntrySelect={handleEntrySelect}
            selectedEntryId={selectedEntryId}
          />
        );
      case 'moods':
        return (
          <MoodTagging
            selectedMoods={selectedMoods}
            onMoodChange={setSelectedMoods}
            customTags={customTags}
            onTagsChange={setCustomTags}
          />
        );
      case 'privacy':
        return (
          <PrivacyControls
            privacySettings={privacySettings}
            onSettingsChange={setPrivacySettings}
            onExport={handleExport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        emotionState={currentEmotion}
        onNavigate={handleNavigate}
      />
      <div className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="BookOpen" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Interactive Journal
                </h1>
                <p className="text-muted-foreground">
                  Express your thoughts with AI-powered emotional insights
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={16} />
                <span>{wordCount} words today</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={16} />
                <span>{new Date()?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {currentEmotion && (
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={16} />
                  <span className="capitalize">Feeling {currentEmotion?.type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Panel Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border shadow-soft p-4 sticky top-24">
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Journal Tools
                </h3>
                <nav className="space-y-1">
                  {panels?.map((panel) => (
                    <button
                      key={panel?.id}
                      onClick={() => setActivePanel(panel?.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium therapeutic-transition
                        ${activePanel === panel?.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <Icon 
                        name={panel?.icon} 
                        size={18} 
                        className="therapeutic-transition"
                      />
                      <span>{panel?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Plus"
                      iconPosition="left"
                      className="w-full justify-start"
                      onClick={() => {
                        setJournalContent('');
                        setSelectedEntryId(null);
                        setActivePanel('editor');
                      }}
                    >
                      New Entry
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Search"
                      iconPosition="left"
                      className="w-full justify-start"
                      onClick={() => setActivePanel('history')}
                    >
                      Search Entries
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="h-full">
                {renderActivePanel()}
              </div>
            </div>
          </div>

          {/* Mobile Panel Selector */}
          <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
            <div className="bg-card border border-border rounded-lg shadow-prominent p-2">
              <div className="flex items-center justify-around">
                {panels?.map((panel) => (
                  <button
                    key={panel?.id}
                    onClick={() => setActivePanel(panel?.id)}
                    className={`
                      flex flex-col items-center space-y-1 px-3 py-2 rounded-lg therapeutic-transition
                      ${activePanel === panel?.id
                        ? 'text-primary bg-primary/10' :'text-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={panel?.icon} size={20} />
                    <span className="text-xs font-caption">{panel?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveJournal;