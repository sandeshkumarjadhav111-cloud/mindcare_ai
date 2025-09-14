import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MoodLogger = ({ selectedDate, onMoodLog, currentMood }) => {
  const [selectedMoodType, setSelectedMoodType] = useState(currentMood?.type || '');
  const [intensity, setIntensity] = useState(currentMood?.intensity || 5);
  const [notes, setNotes] = useState(currentMood?.notes || '');
  const [isLogging, setIsLogging] = useState(false);

  const moodOptions = [
    { type: 'happy', icon: 'Smile', color: 'text-green-500', label: 'Happy' },
    { type: 'calm', icon: 'Waves', color: 'text-blue-500', label: 'Calm' },
    { type: 'neutral', icon: 'Minus', color: 'text-gray-500', label: 'Neutral' },
    { type: 'anxious', icon: 'Zap', color: 'text-yellow-500', label: 'Anxious' },
    { type: 'sad', icon: 'Frown', color: 'text-purple-500', label: 'Sad' },
    { type: 'stressed', icon: 'AlertTriangle', color: 'text-red-500', label: 'Stressed' }
  ];

  const handleMoodSelect = (moodType) => {
    setSelectedMoodType(moodType);
  };

  const handleIntensityChange = (e) => {
    setIntensity(parseInt(e?.target?.value));
  };

  const handleNotesChange = (e) => {
    setNotes(e?.target?.value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedMoodType) return;

    setIsLogging(true);
    
    const moodEntry = {
      date: selectedDate,
      type: selectedMoodType,
      intensity: intensity,
      notes: notes?.trim(),
      timestamp: new Date()?.toISOString()
    };

    try {
      await onMoodLog(moodEntry);
      // Reset form if logging for today
      const today = new Date();
      if (selectedDate?.toDateString() !== today?.toDateString()) {
        setSelectedMoodType('');
        setIntensity(5);
        setNotes('');
      }
    } catch (error) {
      console.error('Failed to log mood:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const getIntensityLabel = (value) => {
    const labels = {
      1: 'Very Low',
      2: 'Low', 
      3: 'Mild',
      4: 'Moderate',
      5: 'Average',
      6: 'Noticeable',
      7: 'High',
      8: 'Very High',
      9: 'Intense',
      10: 'Extreme'
    };
    return labels?.[value] || 'Average';
  };

  const selectedMoodOption = moodOptions?.find(option => option?.type === selectedMoodType);

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Log Your Mood
        </h3>
        <div className="text-sm text-muted-foreground">
          {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            How are you feeling?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moodOptions?.map((option) => (
              <button
                key={option?.type}
                type="button"
                onClick={() => handleMoodSelect(option?.type)}
                className={`
                  p-4 rounded-lg border-2 therapeutic-transition breathing-hover
                  flex flex-col items-center space-y-2
                  ${selectedMoodType === option?.type
                    ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-muted-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon 
                  name={option?.icon} 
                  size={24} 
                  className={selectedMoodType === option?.type ? 'text-primary' : option?.color}
                />
                <span className="text-sm font-medium">{option?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        {selectedMoodType && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Intensity Level: {getIntensityLabel(intensity)} ({intensity}/10)
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={handleIntensityChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(intensity - 1) * 11.11}%, var(--color-muted) ${(intensity - 1) * 11.11}%, var(--color-muted) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Low</span>
                <span>Average</span>
                <span>Extreme</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <Input
            label="Additional Notes (Optional)"
            type="text"
            placeholder="What's on your mind? Any specific triggers or thoughts..."
            value={notes}
            onChange={handleNotesChange}
            className="resize-none"
            description="Share any context that might help track patterns"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            {selectedMoodOption && (
              <>
                <Icon 
                  name={selectedMoodOption?.icon} 
                  size={20} 
                  className={selectedMoodOption?.color}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedMoodOption?.label} - {getIntensityLabel(intensity)}
                </span>
              </>
            )}
          </div>
          
          <Button
            type="submit"
            variant="default"
            loading={isLogging}
            disabled={!selectedMoodType}
            iconName="Save"
            iconPosition="left"
          >
            {currentMood ? 'Update Mood' : 'Log Mood'}
          </Button>
        </div>
      </form>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Check-in</h4>
        <div className="flex flex-wrap gap-2">
          {moodOptions?.slice(0, 4)?.map((option) => (
            <button
              key={`quick-${option?.type}`}
              type="button"
              onClick={() => {
                setSelectedMoodType(option?.type);
                setIntensity(5);
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted/50 therapeutic-transition text-sm"
            >
              <Icon name={option?.icon} size={16} className={option?.color} />
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodLogger;