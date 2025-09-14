import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ message, isUser, timestamp, emotionData, onReaction }) => {
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      calm: 'var(--color-primary)',
      happy: 'var(--color-success)',
      anxious: 'var(--color-warning)',
      sad: 'var(--color-secondary)',
      stressed: 'var(--color-error)',
      neutral: 'var(--color-muted-foreground)'
    };
    return emotionColors?.[emotion] || 'var(--color-muted)';
  };

  const formatTime = (date) => {
    if (!date) return '';
    try {
      return new Date(date)?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  // Handle both string messages and message objects
  const messageContent = typeof message === 'string' ? message : message?.content || message?.text || '';
  const messageId = typeof message === 'object' ? message?.id : Date.now();

  if (!messageContent) {
    return null; // Don't render empty messages
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar and Name */}
        <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-primary/10' : 'bg-secondary/10'
            }`}>
              <Icon 
                name={isUser ? "User" : "Bot"} 
                size={16} 
                color={isUser ? "var(--color-primary)" : "var(--color-secondary)"}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {isUser ? 'You' : 'MindCare AI'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(timestamp)}
            </span>
          </div>
        </div>

        {/* Message Content */}
        <div className={`p-4 rounded-2xl shadow-soft ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-4' 
            : 'bg-card border border-border mr-4'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {messageContent}
          </p>

          {/* Emotion Indicator */}
          {emotionData && (
            <div className={`flex items-center space-x-2 mt-3 pt-3 border-t ${
              isUser ? 'border-primary-foreground/20' : 'border-border'
            }`}>
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getEmotionColor(emotionData?.type) }}
              />
              <span className={`text-xs font-caption ${
                isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                Detected: {emotionData?.type} ({Math.round((emotionData?.confidence || 0) * 100)}%)
              </span>
            </div>
          )}
        </div>

        {/* AI Message Actions */}
        {!isUser && (
          <div className="flex items-center space-x-2 mt-2 mr-4">
            <button
              onClick={() => onReaction && onReaction(messageId, 'helpful')}
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-success hover:bg-success/10 therapeutic-transition"
            >
              <Icon name="ThumbsUp" size={14} />
              <span>Helpful</span>
            </button>
            <button
              onClick={() => onReaction && onReaction(messageId, 'copy')}
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 therapeutic-transition"
            >
              <Icon name="Copy" size={14} />
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;