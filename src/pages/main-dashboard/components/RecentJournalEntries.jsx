import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentJournalEntries = ({ emotionState }) => {
  const mockJournalEntries = [
    {
      id: 1,
      date: '2025-09-13',
      time: '14:30',
      title: 'Morning Reflection',
      preview: `Today started with a sense of clarity and purpose. I woke up feeling refreshed after a good night's sleep.\n\nThe meditation session this morning helped center my thoughts and set positive intentions for the day ahead.`,
      mood: 'calm',moodScore: 8.3,aiSummary: 'Positive morning routine with meditation contributing to emotional balance and clarity.',
      tags: ['meditation', 'morning', 'clarity', 'positive']
    },
    {
      id: 2,
      date: '2025-09-12',time: '19:45',title: 'Work Stress Processing',
      preview: `Had a challenging day at work with multiple deadlines converging. Feeling overwhelmed but trying to process these emotions constructively.\n\nTalking through the stress with my AI companion helped identify specific triggers and coping strategies.`,
      mood: 'stressed',moodScore: 6.2,aiSummary: 'Work-related stress identified with constructive processing and coping strategy development.',
      tags: ['work', 'stress', 'coping', 'deadlines']
    },
    {
      id: 3,
      date: '2025-09-11',time: '21:15',title: 'Gratitude Practice',
      preview: `Ending the day with gratitude for small victories and meaningful connections. Today brought unexpected joy through a conversation with an old friend.\n\nReflecting on how these positive interactions boost my overall mood and perspective.`,
      mood: 'happy',moodScore: 8.7,aiSummary: 'Gratitude practice and social connections contributing to elevated mood and positive outlook.',
      tags: ['gratitude', 'friendship', 'joy', 'connections']
    }
  ];

  const getMoodColor = (mood) => {
    const moodColors = {
      calm: 'var(--color-primary)',
      happy: 'var(--color-success)',
      anxious: 'var(--color-warning)',
      sad: 'var(--color-secondary)',
      stressed: 'var(--color-error)',
      neutral: 'var(--color-muted-foreground)'
    };
    return moodColors?.[mood] || 'var(--color-muted-foreground)';
  };

  const getMoodIcon = (mood) => {
    const moodIcons = {
      calm: 'Smile',
      happy: 'Laugh',
      anxious: 'Frown',
      sad: 'CloudRain',
      stressed: 'Zap',
      neutral: 'Meh'
    };
    return moodIcons?.[mood] || 'Heart';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
            <Icon name="BookOpen" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Recent Journal Entries
            </h3>
            <p className="text-sm text-muted-foreground">
              Your latest thoughts and reflections
            </p>
          </div>
        </div>

        <Link to="/interactive-journal">
          <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
            New Entry
          </Button>
        </Link>
      </div>
      {/* Journal Entries List */}
      <div className="space-y-4">
        {mockJournalEntries?.map((entry) => (
          <div 
            key={entry?.id}
            className="border border-border rounded-lg p-4 therapeutic-transition breathing-hover cursor-pointer"
          >
            {/* Entry Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${getMoodColor(entry?.mood)}20` }}
                >
                  <Icon 
                    name={getMoodIcon(entry?.mood)} 
                    size={16} 
                    color={getMoodColor(entry?.mood)}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {entry?.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatDate(entry?.date)}</span>
                    <span>•</span>
                    <span>{entry?.time}</span>
                    <span>•</span>
                    <span className="capitalize">{entry?.mood}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {entry?.moodScore}/10
                  </p>
                  <p className="text-xs text-muted-foreground">Mood Score</p>
                </div>
              </div>
            </div>

            {/* Entry Preview */}
            <div className="mb-3">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {entry?.preview?.split('\n')?.[0]}
              </p>
            </div>

            {/* AI Summary */}
            <div className="bg-surface rounded-lg p-3 mb-3">
              <div className="flex items-start space-x-2">
                <Icon name="Brain" size={14} color="var(--color-secondary)" className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">AI Summary</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {entry?.aiSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {entry?.tags?.slice(0, 3)?.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-caption bg-muted/50 text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
                {entry?.tags?.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{entry?.tags?.length - 3} more
                  </span>
                )}
              </div>

              <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
                Read More
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-border">
        <Link to="/interactive-journal">
          <Button variant="outline" fullWidth iconName="BookOpen" iconPosition="left">
            View All Journal Entries
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RecentJournalEntries;