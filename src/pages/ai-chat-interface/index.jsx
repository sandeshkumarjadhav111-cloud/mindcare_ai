import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import VoiceInput from './components/VoiceInput';
import FacialRecognition from './components/FacialRecognition';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { generateMentalHealthResponse, analyzeEmotionalContent } from '../../services/aiService';

const AIChatInterface = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator?.onLine);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      content: `Hello Sarah! I'm your MindCare AI companion. I'm here to provide a safe, supportive space for you to share your thoughts and feelings.\n\nI can help you with:\n• Processing emotions and thoughts\n• Developing coping strategies\n• Tracking your mood patterns\n• Providing therapeutic insights\n\nHow are you feeling today? You can type, speak, or even let me analyze your facial expressions to better understand your emotional state.`,
      isUser: false,
      timestamp: new Date(Date.now() - 30000),
      emotionData: null
    };

    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent?.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: messageContent?.trim(),
      isUser: true,
      timestamp: new Date(),
      emotionData: currentEmotion
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Analyze emotional content of user message if no current emotion
      let emotionContext = currentEmotion;
      if (!emotionContext && isOnline) {
        try {
          const emotionAnalysis = await analyzeEmotionalContent(messageContent);
          emotionContext = {
            type: emotionAnalysis?.emotion,
            confidence: emotionAnalysis?.confidence,
            intensity: emotionAnalysis?.intensity,
            timestamp: new Date(),
            source: 'text'
          };
        } catch (error) {
          console.log('Emotion analysis failed, continuing without it');
        }
      }

      // Generate AI response
      const aiResponseContent = await generateMentalHealthResponse(
        messageContent,
        emotionContext,
        messages
      );

      const aiMessage = {
        id: Date.now() + 1,
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
        emotionData: null
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback message
      const errorMessage = {
        id: Date.now() + 1,
        content: isOnline 
          ? "I apologize, but I'm having trouble processing your message right now. Please try again in a moment." :"I notice you're offline right now. I'm still here to listen, but my responses may be limited. Please check your internet connection for the full experience.",
        isUser: false,
        timestamp: new Date(),
        emotionData: null
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = (transcription, audioBlob) => {
    if (transcription?.trim()) {
      handleSendMessage(transcription?.trim());
    }
  };

  const handleEmotionDetected = (emotionData) => {
    setCurrentEmotion(emotionData);
  };

  const handleMoodLog = (moodData) => {
    const logMessage = {
      id: Date.now(),
      content: `I've logged your mood as "${moodData?.type}" for ${new Date()?.toLocaleString()}. Thank you for sharing how you're feeling - this helps me better understand your emotional patterns.`,
      isUser: false,
      timestamp: new Date(),
      emotionData: null
    };
    setMessages(prev => [...prev, logMessage]);
  };

  const handleEmergencyHelp = () => {
    const emergencyMessage = {
      id: Date.now(),
      content: `I understand you may be going through a difficult time. Please remember that you're not alone, and there are people who want to help.\n\nIf you're in immediate danger, please call 911 or go to your nearest emergency room.\n\nFor crisis support:\n• Crisis Text Line: Text HOME to 741741\n• National Suicide Prevention Lifeline: 988\n\nWould you like to talk about what's troubling you? I'm here to listen and support you.`,
      isUser: false,
      timestamp: new Date(),
      emotionData: null
    };
    setMessages(prev => [...prev, emergencyMessage]);
  };

  const handleExportChat = (exportData) => {
    // Simulate chat export
    const chatData = {
      session: exportData?.session,
      timestamp: exportData?.timestamp,
      messages: messages,
      emotionData: currentEmotion,
      duration: Math.round((new Date() - sessionStartTime) / 1000 / 60) // minutes
    };
    
    console.log('Exporting chat data:', chatData);
    
    const exportMessage = {
      id: Date.now(),
      content: `I've prepared your chat session for export. The file includes ${messages?.length} messages and ${Math.round((new Date() - sessionStartTime) / 1000 / 60)} minutes of conversation data.\n\nYour privacy is important - all exported data is encrypted and can only be accessed by you.`,
      isUser: false,
      timestamp: new Date(),
      emotionData: null
    };
    setMessages(prev => [...prev, exportMessage]);
  };

  const handleMessageReaction = (messageId, reaction) => {
    if (reaction === 'copy') {
      const message = messages?.find(m => m?.id === messageId);
      if (message?.content) {
        navigator?.clipboard?.writeText(message?.content);
        
        // Show feedback
        const feedbackMessage = {
          id: Date.now(),
          content: "Message copied to clipboard!",
          isUser: false,
          timestamp: new Date(),
          emotionData: null
        };
        setMessages(prev => [...prev, feedbackMessage]);
        
        // Remove feedback after 2 seconds
        setTimeout(() => {
          setMessages(prev => prev?.filter(m => m?.id !== feedbackMessage?.id));
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        emotionState={currentEmotion}
        onNavigate={navigate}
      />
      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Chat Header */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Icon name="Bot" size={20} color="var(--color-secondary)" />
                </div>
                <div>
                  <h1 className="text-lg font-heading font-semibold text-foreground">
                    MindCare AI Companion
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2">
                    <span>Your therapeutic conversation partner</span>
                    {!isOnline && (
                      <>
                        <span>•</span>
                        <span className="text-warning">Offline Mode</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>Session: {Math.round((new Date() - sessionStartTime) / 1000 / 60)}m</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/main-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages?.map((message) => (
              <ChatMessage
                key={message?.id}
                message={message?.content || message}
                isUser={message?.isUser}
                timestamp={message?.timestamp}
                emotionData={message?.emotionData}
                onReaction={handleMessageReaction}
              />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Icon name="Bot" size={16} color="var(--color-secondary)" />
                    </div>
                    <span className="text-sm font-medium text-foreground">MindCare AI</span>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-4 mr-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Multimodal Input Areas */}
          <div className="space-y-4 p-4 border-t border-border">
            {/* Voice Input */}
            <VoiceInput
              isActive={isVoiceActive}
              onToggle={() => setIsVoiceActive(!isVoiceActive)}
              onVoiceInput={handleVoiceInput}
            />

            {/* Facial Recognition */}
            <FacialRecognition
              isActive={isCameraActive}
              onToggle={() => setIsCameraActive(!isCameraActive)}
              onEmotionDetected={handleEmotionDetected}
            />

            {/* Quick Actions */}
            <QuickActions
              currentEmotion={currentEmotion}
              onMoodLog={handleMoodLog}
              onEmergencyHelp={handleEmergencyHelp}
              onExportChat={handleExportChat}
            />

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
              onCameraToggle={() => setIsCameraActive(!isCameraActive)}
              isVoiceActive={isVoiceActive}
              isCameraActive={isCameraActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;