import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ onSendMessage, onVoiceToggle, onCameraToggle, isVoiceActive, isCameraActive }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim()) {
      onSendMessage(message?.trim());
      setMessage('');
      setIsTyping(false);
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextChange = (e) => {
    setMessage(e?.target?.value);
    setIsTyping(e?.target?.value?.length > 0);
    
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  };

  const quickResponses = [
    { text: "I\'m feeling anxious", icon: "AlertCircle" },
    { text: "I need help", icon: "HelpCircle" },
    { text: "Tell me more", icon: "MessageCircle" },
    { text: "I\'m grateful for...", icon: "Heart" }
  ];

  return (
    <div className="bg-card border-t border-border p-4 space-y-4">
      {/* Quick Response Buttons */}
      <div className="flex flex-wrap gap-2">
        {quickResponses?.map((response, index) => (
          <button
            key={index}
            onClick={() => {
              setMessage(response?.text);
              if (textareaRef?.current) {
                textareaRef?.current?.focus();
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-surface hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full text-sm therapeutic-transition"
          >
            <Icon name={response?.icon} size={14} />
            <span>{response?.text}</span>
          </button>
        ))}
      </div>
      {/* Main Input Area */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Multimodal Controls */}
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant={isVoiceActive ? "default" : "outline"}
            size="icon"
            onClick={onVoiceToggle}
            className="w-10 h-10"
          >
            <Icon 
              name={isVoiceActive ? "MicOff" : "Mic"} 
              size={18}
              color={isVoiceActive ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"}
            />
          </Button>
          
          <Button
            type="button"
            variant={isCameraActive ? "default" : "outline"}
            size="icon"
            onClick={onCameraToggle}
            className="w-10 h-10"
          >
            <Icon 
              name={isCameraActive ? "CameraOff" : "Camera"} 
              size={18}
              color={isCameraActive ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)"}
            />
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
            className="w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-12 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary therapeutic-transition"
            rows={1}
          />
          
          {/* Character Count */}
          {message?.length > 0 && (
            <div className="absolute bottom-1 right-12 text-xs text-muted-foreground">
              {message?.length}
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!message?.trim()}
          className="w-12 h-12 rounded-lg"
        >
          <Icon 
            name="Send" 
            size={20}
            color="var(--color-primary-foreground)"
          />
        </Button>
      </form>
      {/* Input Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          {isTyping && (
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <span>Typing...</span>
            </div>
          )}
          
          {isVoiceActive && (
            <div className="flex items-center space-x-1">
              <Icon name="Mic" size={12} color="var(--color-primary)" />
              <span>Voice input active</span>
            </div>
          )}
          
          {isCameraActive && (
            <div className="flex items-center space-x-1">
              <Icon name="Camera" size={12} color="var(--color-primary)" />
              <span>Camera active</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={12} />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;