import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ emotionState, onMoodCheckIn }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const quickActionItems = [
    {
      id: 'mood-checkin',
      title: 'Quick Mood Check-in',
      description: 'Log your current emotional state',
      icon: 'Heart',
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary)',
      action: 'modal',
      path: '/mood-tracking'
    },
    {
      id: 'voice-note',
      title: 'Voice Recording',
      description: 'Express yourself through voice',
      icon: 'Mic',
      color: 'var(--color-success)',
      bgColor: 'var(--color-success)',
      action: 'record',
      path: null
    },
    {
      id: 'journal-entry',
      title: 'New Journal Entry',
      description: 'Write down your thoughts',
      icon: 'PenTool',
      color: 'var(--color-secondary)',
      bgColor: 'var(--color-secondary)',
      action: 'navigate',
      path: '/interactive-journal'
    },
    {
      id: 'ai-chat',
      title: 'Talk to AI Companion',
      description: 'Get support and guidance',
      icon: 'MessageCircle',
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent)',
      action: 'navigate',
      path: '/ai-chat-interface'
    }
  ];

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Simulate recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Auto-stop after 60 seconds
            setIsRecording(false);
            clearInterval(timer);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleQuickAction = (action) => {
    switch (action?.action) {
      case 'record':
        handleVoiceRecording();
        break;
      case 'modal':
        if (onMoodCheckIn) {
          onMoodCheckIn();
        }
        break;
      default:
        break;
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
          <Icon name="Zap" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Quick Actions
          </h3>
          <p className="text-sm text-muted-foreground">
            Fast access to your wellness tools
          </p>
        </div>
      </div>
      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActionItems?.map((action) => {
          const ActionComponent = action?.action === 'navigate' ? Link : 'button';
          const actionProps = action?.action === 'navigate' 
            ? { to: action?.path }
            : { onClick: () => handleQuickAction(action) };

          return (
            <ActionComponent
              key={action?.id}
              {...actionProps}
              className="group relative bg-surface rounded-lg p-4 border border-border therapeutic-transition breathing-hover cursor-pointer"
            >
              {/* Action Content */}
              <div className="flex items-start space-x-3">
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-lg therapeutic-transition group-hover:scale-110"
                  style={{ backgroundColor: `${action?.bgColor}20` }}
                >
                  <Icon 
                    name={action?.icon} 
                    size={20} 
                    color={action?.color}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary therapeutic-transition">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {action?.description}
                  </p>
                  
                  {/* Special States */}
                  {action?.id === 'voice-note' && isRecording && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-error">
                        Recording {formatRecordingTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Indicator */}
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 group-hover:bg-primary/20 therapeutic-transition">
                  <Icon 
                    name={action?.action === 'navigate' ? 'ArrowRight' : action?.id === 'voice-note' && isRecording ? 'Square' : 'Play'} 
                    size={12} 
                    color="var(--color-muted-foreground)"
                    className="group-hover:text-primary therapeutic-transition"
                  />
                </div>
              </div>
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 therapeutic-transition pointer-events-none" />
            </ActionComponent>
          );
        })}
      </div>
      {/* Emergency Support */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-error/20">
              <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-error mb-1">
                Need Immediate Support?
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                If you're experiencing a mental health crisis, please reach out for professional help immediately.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" iconName="Phone" iconPosition="left">
                  Crisis Hotline
                </Button>
                <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left">
                  Emergency Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;