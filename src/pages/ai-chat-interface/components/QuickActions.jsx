import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onMoodLog, onEmergencyHelp, onExportChat, currentEmotion }) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);

  const moodOptions = [
    { type: 'happy', label: 'Happy', icon: 'Smile', color: 'var(--color-success)' },
    { type: 'calm', label: 'Calm', icon: 'Leaf', color: 'var(--color-primary)' },
    { type: 'anxious', label: 'Anxious', icon: 'AlertTriangle', color: 'var(--color-warning)' },
    { type: 'sad', label: 'Sad', icon: 'Frown', color: 'var(--color-secondary)' },
    { type: 'stressed', label: 'Stressed', icon: 'Zap', color: 'var(--color-error)' },
    { type: 'neutral', label: 'Neutral', icon: 'Minus', color: 'var(--color-muted-foreground)' }
  ];

  const emergencyResources = [
    {
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: '24/7 crisis support via text message',
      icon: 'MessageSquare'
    },
    {
      name: 'National Suicide Prevention Lifeline',
      contact: '988',
      description: '24/7 free and confidential support',
      icon: 'Phone'
    },
    {
      name: 'Emergency Services',
      contact: '911',
      description: 'For immediate medical emergencies',
      icon: 'AlertCircle'
    }
  ];

  const handleMoodSelection = (mood) => {
    onMoodLog && onMoodLog({
      type: mood?.type,
      timestamp: new Date(),
      source: 'manual',
      notes: `Manually logged from chat interface`
    });
    setShowMoodSelector(false);
  };

  const handleExportChat = () => {
    // Simulate chat export
    const exportData = {
      timestamp: new Date()?.toISOString(),
      session: 'ai-chat-session',
      format: 'json'
    };
    
    onExportChat && onExportChat(exportData);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Mood Log */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMoodSelector(!showMoodSelector)}
            iconName="Heart"
            iconPosition="left"
            className="w-full justify-start"
          >
            Log Mood
          </Button>
          
          {showMoodSelector && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-moderate z-50">
              <div className="p-3">
                <h4 className="text-sm font-medium text-foreground mb-3">How are you feeling?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions?.map((mood) => (
                    <button
                      key={mood?.type}
                      onClick={() => handleMoodSelection(mood)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 therapeutic-transition"
                    >
                      <Icon 
                        name={mood?.icon} 
                        size={16} 
                        color={mood?.color}
                      />
                      <span className="text-sm text-foreground">{mood?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Help */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmergencyOptions(!showEmergencyOptions)}
            iconName="AlertCircle"
            iconPosition="left"
            className="w-full justify-start text-error border-error/20 hover:bg-error/10"
          >
            Emergency
          </Button>
          
          {showEmergencyOptions && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-moderate z-50">
              <div className="p-4">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                  <span>Emergency Resources</span>
                </h4>
                <div className="space-y-3">
                  {emergencyResources?.map((resource, index) => (
                    <div key={index} className="p-3 bg-surface rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Icon name={resource?.icon} size={16} color="var(--color-error)" className="mt-0.5" />
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-foreground">{resource?.name}</h5>
                          <p className="text-sm font-mono text-primary mt-1">{resource?.contact}</p>
                          <p className="text-xs text-muted-foreground mt-1">{resource?.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-warning/10 rounded-lg">
                  <p className="text-xs text-warning">
                    If you're in immediate danger, please call 911 or go to your nearest emergency room.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Chat */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportChat}
          iconName="Download"
          iconPosition="left"
          className="w-full justify-start"
        >
          Export
        </Button>

        {/* Session Info */}
        <Button
          variant="outline"
          size="sm"
          iconName="Info"
          iconPosition="left"
          className="w-full justify-start"
        >
          Session
        </Button>
      </div>
      {/* Current Emotion Display */}
      {currentEmotion && (
        <div className="mt-4 p-3 bg-surface rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Current Emotion:</span>
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentEmotion?.color }}
                />
                <span className="text-sm font-medium text-foreground capitalize">
                  {currentEmotion?.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(currentEmotion?.confidence * 100)}%)
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentEmotion?.source}
            </span>
          </div>
        </div>
      )}
      {/* Overlay for closing dropdowns */}
      {(showMoodSelector || showEmergencyOptions) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMoodSelector(false);
            setShowEmergencyOptions(false);
          }}
        />
      )}
    </div>
  );
};

export default QuickActions;