import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const EmotionFeedback = ({ emotionState }) => {
  const [currentEmotion, setCurrentEmotion] = useState(emotionState || { type: 'neutral', confidence: 0.7, intensity: 0.5 });
  const [isDetecting, setIsDetecting] = useState(false);

  // Simulate real-time emotion detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (emotionState) {
        setCurrentEmotion(emotionState);
      } else {
        // Simulate emotion detection changes
        const emotions = ['calm', 'happy', 'neutral', 'focused'];
        const randomEmotion = emotions?.[Math.floor(Math.random() * emotions?.length)];
        setCurrentEmotion({
          type: randomEmotion,
          confidence: 0.6 + Math.random() * 0.4,
          intensity: 0.3 + Math.random() * 0.7
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emotionState]);

  const getEmotionData = (emotionType) => {
    const emotionMap = {
      calm: {
        color: 'var(--color-primary)',
        bgColor: 'var(--color-primary)',
        icon: 'Smile',
        label: 'Calm',
        description: 'You appear relaxed and centered',
        recommendations: ['Continue your current activities', 'Consider meditation to maintain this state']
      },
      happy: {
        color: 'var(--color-success)',
        bgColor: 'var(--color-success)',
        icon: 'Laugh',
        label: 'Happy',
        description: 'Positive emotions detected',
        recommendations: ['Share this joy with others', 'Engage in activities you love']
      },
      anxious: {
        color: 'var(--color-warning)',
        bgColor: 'var(--color-warning)',
        icon: 'Frown',
        label: 'Anxious',
        description: 'Some tension detected',
        recommendations: ['Try deep breathing exercises', 'Consider taking a short break']
      },
      sad: {
        color: 'var(--color-secondary)',
        bgColor: 'var(--color-secondary)',
        icon: 'CloudRain',
        label: 'Sad',
        description: 'Lower mood detected',
        recommendations: ['Reach out to someone you trust', 'Engage in self-care activities']
      },
      stressed: {
        color: 'var(--color-error)',
        bgColor: 'var(--color-error)',
        icon: 'Zap',
        label: 'Stressed',
        description: 'High stress levels detected',
        recommendations: ['Take immediate stress-relief actions', 'Consider professional support']
      },
      neutral: {
        color: 'var(--color-muted-foreground)',
        bgColor: 'var(--color-muted-foreground)',
        icon: 'Meh',
        label: 'Neutral',
        description: 'Balanced emotional state',
        recommendations: ['Good time for planning', 'Consider engaging in enjoyable activities']
      },
      focused: {
        color: 'var(--color-accent)',
        bgColor: 'var(--color-accent)',
        icon: 'Target',
        label: 'Focused',
        description: 'High concentration detected',
        recommendations: ['Great time for important tasks', 'Maintain your current workflow']
      }
    };

    return emotionMap?.[emotionType] || emotionMap?.neutral;
  };

  const emotionData = getEmotionData(currentEmotion?.type);
  const confidencePercentage = Math.round(currentEmotion?.confidence * 100);
  const intensityPercentage = Math.round(currentEmotion?.intensity * 100);

  const handleRecalibrate = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      // Simulate new detection
      const emotions = ['calm', 'happy', 'focused'];
      const newEmotion = emotions?.[Math.floor(Math.random() * emotions?.length)];
      setCurrentEmotion({
        type: newEmotion,
        confidence: 0.8 + Math.random() * 0.2,
        intensity: 0.5 + Math.random() * 0.5
      });
    }, 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: `${emotionData?.bgColor}20` }}
          >
            <Icon name="Activity" size={20} color={emotionData?.color} />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Real-time Emotion Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered multimodal detection
            </p>
          </div>
        </div>

        <button
          onClick={handleRecalibrate}
          disabled={isDetecting}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface hover:bg-muted/50 therapeutic-transition disabled:opacity-50"
        >
          <Icon 
            name={isDetecting ? "Loader2" : "RefreshCw"} 
            size={14} 
            className={isDetecting ? "animate-spin" : ""}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {isDetecting ? 'Detecting...' : 'Recalibrate'}
          </span>
        </button>
      </div>
      {/* Current Emotion Display */}
      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 therapeutic-transition"
          style={{ backgroundColor: `${emotionData?.bgColor}20` }}
        >
          <Icon 
            name={emotionData?.icon} 
            size={32} 
            color={emotionData?.color}
            className={isDetecting ? "animate-pulse" : ""}
          />
        </div>
        
        <h4 className="text-xl font-heading font-bold text-foreground mb-2">
          {emotionData?.label}
        </h4>
        
        <p className="text-sm text-muted-foreground mb-4">
          {emotionData?.description}
        </p>

        {/* Detection Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-surface rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full therapeutic-transition"
                  style={{ 
                    width: `${confidencePercentage}%`,
                    backgroundColor: emotionData?.color
                  }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                {confidencePercentage}%
              </span>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Intensity</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full therapeutic-transition"
                  style={{ 
                    width: `${intensityPercentage}%`,
                    backgroundColor: emotionData?.color
                  }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                {intensityPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div className="bg-surface rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Lightbulb" size={16} color="var(--color-secondary)" />
          <h5 className="text-sm font-medium text-foreground">AI Recommendations</h5>
        </div>
        <div className="space-y-2">
          {emotionData?.recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Detection Sources */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground mb-3">Detection Sources</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Text Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Voice Tone</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <span className="text-xs text-muted-foreground">Facial</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon name="Wifi" size={12} color="var(--color-success)" />
            <span className="text-xs text-success">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionFeedback;