import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JournalEditor = ({ 
  content, 
  onContentChange, 
  onEmotionDetected, 
  isVoiceRecording, 
  onVoiceToggle,
  wordCount,
  autoSaveStatus 
}) => {
  const [isFormatting, setIsFormatting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const editorRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Mock emotion detection from text
  const analyzeEmotion = (text) => {
    if (!text || text?.length < 10) return null;
    
    const emotions = ['calm', 'happy', 'anxious', 'sad', 'stressed', 'hopeful'];
    const keywords = {
      happy: ['joy', 'excited', 'wonderful', 'amazing', 'great', 'love', 'smile'],
      sad: ['sad', 'down', 'depressed', 'lonely', 'hurt', 'cry', 'empty'],
      anxious: ['worried', 'nervous', 'scared', 'panic', 'stress', 'fear', 'overwhelmed'],
      calm: ['peaceful', 'relaxed', 'serene', 'quiet', 'tranquil', 'centered'],
      stressed: ['pressure', 'deadline', 'busy', 'exhausted', 'tired', 'overwhelmed'],
      hopeful: ['hope', 'future', 'better', 'improve', 'positive', 'optimistic']
    };

    const lowerText = text?.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'neutral';

    Object.entries(keywords)?.forEach(([emotion, words]) => {
      const score = words?.reduce((acc, word) => {
        return acc + (lowerText?.includes(word) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    });

    return {
      type: detectedEmotion,
      confidence: Math.min(maxScore * 0.2 + 0.3, 1),
      keywords: keywords?.[detectedEmotion] || []
    };
  };

  useEffect(() => {
    if (content && content?.length > 50) {
      const emotion = analyzeEmotion(content);
      if (emotion && onEmotionDetected) {
        onEmotionDetected(emotion);
      }
    }
  }, [content, onEmotionDetected]);

  const handleTextChange = (e) => {
    const newContent = e?.target?.value;
    onContentChange(newContent);
    setCursorPosition(e?.target?.selectionStart);
  };

  const handleTextSelection = () => {
    if (editorRef?.current) {
      const selected = window.getSelection()?.toString();
      setSelectedText(selected);
    }
  };

  const formatText = (format) => {
    if (!editorRef?.current) return;
    
    const start = editorRef?.current?.selectionStart;
    const end = editorRef?.current?.selectionEnd;
    const selectedText = content?.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      default:
        return;
    }

    const newContent = content?.substring(0, start) + formattedText + content?.substring(end);
    onContentChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      if (editorRef?.current) {
        editorRef?.current?.focus();
        editorRef?.current?.setSelectionRange(start + formattedText?.length, start + formattedText?.length);
      }
    }, 0);
  };

  const insertPrompt = (prompt) => {
    const newContent = content + (content ? '\n\n' : '') + prompt + '\n\n';
    onContentChange(newContent);
    
    setTimeout(() => {
      if (editorRef?.current) {
        editorRef?.current?.focus();
        editorRef?.current?.setSelectionRange(newContent?.length, newContent?.length);
      }
    }, 0);
  };

  const writingPrompts = [
    "How am I feeling right now, and what might be contributing to this emotion?",
    "What was the highlight of my day, and why did it stand out?",
    "What challenge am I facing, and what steps can I take to address it?",
    "What am I grateful for today?",
    "What would I tell a friend who was experiencing what I\'m going through?",
    "What patterns do I notice in my thoughts and feelings lately?"
  ];

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-soft">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Journal Entry
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="FileText" size={16} />
            <span>{wordCount} words</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Auto-save status */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon 
              name={autoSaveStatus === 'saving' ? 'Loader2' : 'Check'} 
              size={14} 
              className={autoSaveStatus === 'saving' ? 'animate-spin' : ''}
            />
            <span>
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </span>
          </div>

          {/* Voice recording toggle */}
          <Button
            variant={isVoiceRecording ? 'destructive' : 'outline'}
            size="sm"
            onClick={onVoiceToggle}
            iconName={isVoiceRecording ? 'MicOff' : 'Mic'}
            iconPosition="left"
            className="therapeutic-transition"
          >
            {isVoiceRecording ? 'Stop Recording' : 'Voice Input'}
          </Button>
        </div>
      </div>
      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            iconName="Bold"
            className="w-8 h-8"
            disabled={!selectedText}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            iconName="Italic"
            className="w-8 h-8"
            disabled={!selectedText}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            iconName="Underline"
            className="w-8 h-8"
            disabled={!selectedText}
          />
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFormatting(!isFormatting)}
            iconName="Lightbulb"
            className="w-8 h-8"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          {new Date()?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      {/* Writing Prompts Panel */}
      {isFormatting && (
        <div className="p-4 bg-accent/10 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Writing Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {writingPrompts?.map((prompt, index) => (
              <button
                key={index}
                onClick={() => insertPrompt(prompt)}
                className="text-left p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md therapeutic-transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Main Editor */}
      <div className="flex-1 p-4">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleTextChange}
          onSelect={handleTextSelection}
          placeholder="Start writing about your thoughts and feelings... Let your emotions flow freely onto the page. This is your safe space for reflection and self-discovery."
          className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder-muted-foreground text-base leading-relaxed font-normal therapeutic-transition"
          style={{ minHeight: '400px' }}
        />
      </div>
      {/* Voice Recording Indicator */}
      {isVoiceRecording && (
        <div className="p-4 bg-error/10 border-t border-border">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <span className="text-sm font-medium text-error">
              Recording... Speak naturally and your words will appear above
            </span>
            <div className="flex space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-error/60 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEditor;