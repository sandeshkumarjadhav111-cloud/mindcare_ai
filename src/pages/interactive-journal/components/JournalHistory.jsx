import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JournalHistory = ({ onEntrySelect, selectedEntryId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock journal entries
  const mockEntries = [
    {
      id: 1,
      title: "Morning Reflections",
      date: new Date('2025-01-13'),
      emotion: 'calm',
      preview: "Started the day with meditation and felt a sense of peace. The morning light streaming through my window reminded me of...",
      wordCount: 342,
      aiSummary: "Peaceful morning routine with focus on mindfulness and gratitude.",
      tags: ['meditation', 'morning', 'gratitude']
    },
    {
      id: 2,
      title: "Work Stress",
      date: new Date('2025-01-12'),
      emotion: 'stressed',
      preview: "The deadline is approaching and I feel overwhelmed. There's so much to do and not enough time. I need to find a way to...",
      wordCount: 289,
      aiSummary: "Work-related stress and time management challenges.",
      tags: ['work', 'deadline', 'overwhelmed']
    },
    {
      id: 3,
      title: "Family Time",
      date: new Date('2025-01-11'),
      emotion: 'happy',
      preview: "Spent the evening with family playing board games. It was wonderful to see everyone laughing and enjoying each other\'s company...",
      wordCount: 456,
      aiSummary: "Joyful family bonding experience with positive emotions.",
      tags: ['family', 'games', 'laughter']
    },
    {
      id: 4,
      title: "Feeling Lost",
      date: new Date('2025-01-10'),
      emotion: 'sad',
      preview: "Sometimes I wonder if I'm on the right path. The uncertainty about the future weighs heavily on my mind...",
      wordCount: 378,
      aiSummary: "Existential concerns and uncertainty about life direction.",
      tags: ['uncertainty', 'future', 'path']
    },
    {
      id: 5,
      title: "New Opportunities",
      date: new Date('2025-01-09'),
      emotion: 'hopeful',
      preview: "Got a call about a potential job opportunity today. It feels like things might be turning around. I\'m cautiously optimistic...",
      wordCount: 234,
      aiSummary: "Career opportunity bringing hope and optimism.",
      tags: ['opportunity', 'job', 'optimistic']
    }
  ];

  const getEmotionConfig = (emotion) => {
    const configs = {
      happy: { color: 'var(--color-success)', icon: 'Smile', label: 'Happy' },
      sad: { color: 'var(--color-secondary)', icon: 'Frown', label: 'Sad' },
      anxious: { color: 'var(--color-warning)', icon: 'AlertTriangle', label: 'Anxious' },
      calm: { color: 'var(--color-primary)', icon: 'Waves', label: 'Calm' },
      stressed: { color: 'var(--color-error)', icon: 'Zap', label: 'Stressed' },
      hopeful: { color: 'var(--color-accent)', icon: 'Sunrise', label: 'Hopeful' }
    };
    return configs?.[emotion] || { color: 'var(--color-muted-foreground)', icon: 'Minus', label: 'Neutral' };
  };

  const filteredEntries = mockEntries?.filter(entry => {
      const matchesSearch = entry?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           entry?.preview?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           entry?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
      const matchesEmotion = filterEmotion === 'all' || entry?.emotion === filterEmotion;
      return matchesSearch && matchesEmotion;
    })?.sort((a, b) => {
      if (sortBy === 'date') return b?.date - a?.date;
      if (sortBy === 'wordCount') return b?.wordCount - a?.wordCount;
      return a?.title?.localeCompare(b?.title);
    });

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) return 'Today';
    if (date?.toDateString() === yesterday?.toDateString()) return 'Yesterday';
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const emotionOptions = [
    { value: 'all', label: 'All Emotions' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'calm', label: 'Calm' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'hopeful', label: 'Hopeful' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Journal History
          </h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icon name="BookOpen" size={16} />
            <span>{filteredEntries?.length} entries</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <Input
            type="search"
            placeholder="Search entries, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full"
          />

          <div className="flex space-x-2">
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e?.target?.value)}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
            >
              {emotionOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
            >
              <option value="date">Sort by Date</option>
              <option value="wordCount">Sort by Length</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>
      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEntries?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              No entries found
            </h4>
            <p className="text-sm text-muted-foreground">
              {searchQuery || filterEmotion !== 'all' ?'Try adjusting your search or filters' :'Start writing your first journal entry'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredEntries?.map((entry) => {
              const emotionConfig = getEmotionConfig(entry?.emotion);
              const isSelected = selectedEntryId === entry?.id;

              return (
                <div
                  key={entry?.id}
                  onClick={() => onEntrySelect(entry)}
                  className={`
                    p-4 rounded-lg border cursor-pointer therapeutic-transition breathing-hover
                    ${isSelected 
                      ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/30'
                    }
                  `}
                >
                  {/* Entry Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1 line-clamp-1">
                        {entry?.title}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span>{formatDate(entry?.date)}</span>
                        <span>•</span>
                        <span>{entry?.wordCount} words</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <Icon 
                        name={emotionConfig?.icon} 
                        size={16} 
                        color={emotionConfig?.color}
                      />
                    </div>
                  </div>
                  {/* Entry Preview */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {entry?.preview}
                  </p>
                  {/* AI Summary */}
                  <div className="bg-accent/10 rounded-md p-2 mb-3">
                    <div className="flex items-start space-x-2">
                      <Icon name="Brain" size={14} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground leading-relaxed">
                        {entry?.aiSummary}
                      </p>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {entry?.tags?.slice(0, 3)?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry?.tags?.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        +{entry?.tags?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Archive"
            iconPosition="left"
            className="flex-1"
          >
            Archive
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalHistory;