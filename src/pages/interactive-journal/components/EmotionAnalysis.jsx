import React from 'react';
import Icon from '../../../components/AppIcon';

const EmotionAnalysis = ({ emotion, insights, isAnalyzing }) => {
  const getEmotionConfig = (emotionType) => {
    const configs = {
      happy: {
        color: 'var(--color-success)',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: 'Smile',
        label: 'Happy',
        description: 'Your writing reflects positive emotions and joy'
      },
      sad: {
        color: 'var(--color-secondary)',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: 'Frown',
        label: 'Sad',
        description: 'Your writing shows feelings of sadness or melancholy'
      },
      anxious: {
        color: 'var(--color-warning)',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: 'AlertTriangle',
        label: 'Anxious',
        description: 'Your writing indicates worry or anxiety'
      },
      calm: {
        color: 'var(--color-primary)',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        icon: 'Waves',
        label: 'Calm',
        description: 'Your writing reflects peace and tranquility'
      },
      stressed: {
        color: 'var(--color-error)',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: 'Zap',
        label: 'Stressed',
        description: 'Your writing shows signs of stress or pressure'
      },
      hopeful: {
        color: 'var(--color-accent)',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: 'Sunrise',
        label: 'Hopeful',
        description: 'Your writing expresses optimism and hope'
      },
      neutral: {
        color: 'var(--color-muted-foreground)',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: 'Minus',
        label: 'Neutral',
        description: 'Your writing shows balanced emotional tone'
      }
    };

    return configs?.[emotionType] || configs?.neutral;
  };

  const mockInsights = [
    {
      type: 'pattern',
      title: 'Emotional Pattern',
      content: 'You tend to write more reflectively in the evening hours, showing deeper emotional processing.'
    },
    {
      type: 'suggestion',
      title: 'Therapeutic Suggestion',
      content: 'Consider exploring the underlying causes of these feelings through guided questions.'
    },
    {
      type: 'progress',
      title: 'Progress Note',
      content: 'Your emotional vocabulary has expanded by 15% over the past week, showing increased self-awareness.'
    }
  ];

  const currentInsights = insights || mockInsights;
  const config = emotion ? getEmotionConfig(emotion?.type) : getEmotionConfig('neutral');

  if (isAnalyzing) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <div className="flex items-center justify-center space-x-3">
          <Icon name="Brain" size={24} className="animate-pulse text-primary" />
          <div className="text-center">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Analyzing Your Writing
            </h3>
            <p className="text-sm text-muted-foreground">
              AI is processing your emotional expressions...
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-1">
            {[...Array(5)]?.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Emotion Display */}
      {emotion && (
        <div className={`${config?.bgColor} ${config?.borderColor} border rounded-lg p-4`}>
          <div className="flex items-center space-x-3 mb-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${config?.color}20` }}
            >
              <Icon 
                name={config?.icon} 
                size={20} 
                color={config?.color}
              />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {config?.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                Confidence: {Math.round((emotion?.confidence || 0.7) * 100)}%
              </p>
            </div>
          </div>
          
          <p className="text-sm text-foreground mb-3">
            {config?.description}
          </p>

          {emotion?.keywords && emotion?.keywords?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Key emotional indicators:
              </p>
              <div className="flex flex-wrap gap-1">
                {emotion?.keywords?.slice(0, 4)?.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-white/60 text-foreground"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* AI Insights */}
      <div className="bg-card rounded-lg border border-border shadow-soft">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-heading font-semibold text-foreground">
              AI Insights
            </h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {currentInsights?.map((insight, index) => (
            <div key={index} className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon 
                  name={
                    insight?.type === 'pattern' ? 'TrendingUp' :
                    insight?.type === 'suggestion' ? 'MessageSquare' : 'Target'
                  } 
                  size={16} 
                  color="var(--color-primary)"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {insight?.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight?.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Emotion Timeline */}
      <div className="bg-card rounded-lg border border-border shadow-soft p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Today's Emotional Journey
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { time: '9:00 AM', emotion: 'calm', intensity: 0.6 },
            { time: '2:00 PM', emotion: 'stressed', intensity: 0.8 },
            { time: '6:00 PM', emotion: 'hopeful', intensity: 0.7 },
            { time: 'Now', emotion: emotion?.type || 'neutral', intensity: emotion?.confidence || 0.5 }
          ]?.map((entry, index) => {
            const entryConfig = getEmotionConfig(entry?.emotion);
            return (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-xs font-mono text-muted-foreground w-16">
                  {entry?.time}
                </span>
                <div className="flex-1 flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entryConfig?.color }}
                  />
                  <span className="text-sm text-foreground capitalize">
                    {entry?.emotion}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-full rounded-full therapeutic-transition"
                      style={{ 
                        width: `${entry?.intensity * 100}%`,
                        backgroundColor: entryConfig?.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalysis;