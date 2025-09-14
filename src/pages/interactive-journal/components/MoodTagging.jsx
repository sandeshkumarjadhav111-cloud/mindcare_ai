import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MoodTagging = ({ selectedMoods, onMoodChange, customTags, onTagsChange }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  const predefinedMoods = [
    { id: 'happy', label: 'Happy', icon: 'Smile', color: 'var(--color-success)' },
    { id: 'sad', label: 'Sad', icon: 'Frown', color: 'var(--color-secondary)' },
    { id: 'anxious', label: 'Anxious', icon: 'AlertTriangle', color: 'var(--color-warning)' },
    { id: 'calm', label: 'Calm', icon: 'Waves', color: 'var(--color-primary)' },
    { id: 'stressed', label: 'Stressed', icon: 'Zap', color: 'var(--color-error)' },
    { id: 'hopeful', label: 'Hopeful', icon: 'Sunrise', color: 'var(--color-accent)' },
    { id: 'excited', label: 'Excited', icon: 'Sparkles', color: '#F59E0B' },
    { id: 'tired', label: 'Tired', icon: 'Moon', color: '#6B7280' },
    { id: 'grateful', label: 'Grateful', icon: 'Heart', color: '#EC4899' },
    { id: 'confused', label: 'Confused', icon: 'HelpCircle', color: '#8B5CF6' },
    { id: 'motivated', label: 'Motivated', icon: 'Target', color: '#10B981' },
    { id: 'lonely', label: 'Lonely', icon: 'User', color: '#6366F1' }
  ];

  const intensityLevels = [
    { value: 1, label: 'Mild', color: '#D1D5DB' },
    { value: 2, label: 'Moderate', color: '#9CA3AF' },
    { value: 3, label: 'Strong', color: '#6B7280' },
    { value: 4, label: 'Intense', color: '#374151' },
    { value: 5, label: 'Overwhelming', color: '#1F2937' }
  ];

  const handleMoodToggle = (moodId) => {
    const updatedMoods = selectedMoods?.includes(moodId)
      ? selectedMoods?.filter(id => id !== moodId)
      : [...selectedMoods, moodId];
    
    onMoodChange(updatedMoods);
  };

  const handleAddCustomTag = () => {
    if (customTagInput?.trim() && !customTags?.includes(customTagInput?.trim())) {
      onTagsChange([...customTags, customTagInput?.trim()]);
      setCustomTagInput('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomTag = (tagToRemove) => {
    onTagsChange(customTags?.filter(tag => tag !== tagToRemove));
  };

  const getMoodIntensity = (moodId) => {
    // Mock intensity calculation based on mood selection
    return selectedMoods?.includes(moodId) ? Math.floor(Math.random() * 5) + 1 : 0;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Tag" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Mood Tagging
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Select emotions that reflect your current state
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Predefined Moods Grid */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            How are you feeling?
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {predefinedMoods?.map((mood) => {
              const isSelected = selectedMoods?.includes(mood?.id);
              const intensity = getMoodIntensity(mood?.id);
              
              return (
                <button
                  key={mood?.id}
                  onClick={() => handleMoodToggle(mood?.id)}
                  className={`
                    p-3 rounded-lg border therapeutic-transition breathing-hover
                    ${isSelected 
                      ? 'border-primary bg-primary/10' :'border-border bg-card hover:bg-muted/30'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon 
                      name={mood?.icon} 
                      size={24} 
                      color={isSelected ? mood?.color : 'var(--color-muted-foreground)'}
                      className="therapeutic-transition"
                    />
                    <span className={`text-xs font-medium ${
                      isSelected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {mood?.label}
                    </span>
                    
                    {/* Intensity indicator */}
                    {isSelected && intensity > 0 && (
                      <div className="flex space-x-0.5">
                        {[...Array(5)]?.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              i < intensity ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Moods Summary */}
        {selectedMoods?.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Current Emotional State
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedMoods?.map((moodId) => {
                const mood = predefinedMoods?.find(m => m?.id === moodId);
                const intensity = getMoodIntensity(moodId);
                const intensityLevel = intensityLevels?.[intensity - 1];
                
                return (
                  <div
                    key={moodId}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-card rounded-full border border-border"
                  >
                    <Icon 
                      name={mood?.icon} 
                      size={16} 
                      color={mood?.color}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {mood?.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({intensityLevel?.label})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Tags */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">
              Custom Tags
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomInput(!showCustomInput)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Tag
            </Button>
          </div>

          {/* Custom Tag Input */}
          {showCustomInput && (
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e?.target?.value)}
                placeholder="Enter custom tag..."
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                onKeyPress={(e) => e?.key === 'Enter' && handleAddCustomTag()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCustomTag}
                disabled={!customTagInput?.trim()}
              >
                Add
              </Button>
            </div>
          )}

          {/* Custom Tags Display */}
          {customTags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customTags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveCustomTag(tag)}
                    className="hover:text-error therapeutic-transition"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {customTags?.length === 0 && !showCustomInput && (
            <p className="text-sm text-muted-foreground italic">
              No custom tags added yet
            </p>
          )}
        </div>

        {/* Mood Insights */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} color="var(--color-primary)" />
            <h4 className="text-sm font-medium text-foreground">
              Mood Insights
            </h4>
          </div>
          
          {selectedMoods?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Select some moods to see personalized insights
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                You're experiencing {selectedMoods?.length} different emotions right now.
              </p>
              {selectedMoods?.includes('happy') && selectedMoods?.includes('grateful') && (
                <p className="text-sm text-success">
                  ✨ Great combination! Happiness and gratitude often reinforce each other.
                </p>
              )}
              {selectedMoods?.includes('anxious') && selectedMoods?.includes('stressed') && (
                <p className="text-sm text-warning">
                  💡 Consider some deep breathing exercises to help manage these intense feelings.
                </p>
              )}
              {selectedMoods?.length > 4 && (
                <p className="text-sm text-muted-foreground">
                  🌈 You're experiencing a complex emotional state. That's completely normal and human.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTagging;