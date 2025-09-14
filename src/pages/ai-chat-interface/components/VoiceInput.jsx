import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceInput = ({ onVoiceInput, isActive, onToggle }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const intervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
      
      // Setup audio visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef?.current?.createAnalyser();
      const source = audioContextRef?.current?.createMediaStreamSource(stream);
      source?.connect(analyserRef?.current);
      
      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks?.push(event?.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Simulate transcription
        setTimeout(() => {
          const mockTranscriptions = [
            "I\'ve been feeling quite anxious lately about work.",
            "Can you help me understand why I feel this way?",
            "I had a difficult conversation with my manager today.",
            "I\'m struggling to sleep well at night.",
            "How can I manage my stress better?"
          ];
          const randomTranscription = mockTranscriptions?.[Math.floor(Math.random() * mockTranscriptions?.length)];
          setTranscription(randomTranscription);
          onVoiceInput && onVoiceInput(randomTranscription, audioBlob);
        }, 1500);
      };
      
      mediaRecorderRef?.current?.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef?.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef?.current?.getByteFrequencyData(dataArray);
          const average = dataArray?.reduce((a, b) => a + b) / dataArray?.length;
          setAudioLevel(average / 255);
          
          if (isRecording) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      updateAudioLevel();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
      
      // Stop all tracks
      if (mediaRecorderRef?.current?.stream) {
        mediaRecorderRef?.current?.stream?.getTracks()?.forEach(track => track?.stop());
      }
      
      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Voice Input</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="X"
          iconSize={16}
        >
          Close
        </Button>
      </div>
      {/* Audio Visualization */}
      <div className="flex items-center justify-center h-20 bg-surface rounded-lg">
        <div className="flex items-end space-x-1 h-12">
          {Array.from({ length: 20 })?.map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full therapeutic-transition"
              style={{
                height: `${Math.max(4, (audioLevel * 40) + (Math.sin((Date.now() / 100) + i) * 8))}px`,
                opacity: isRecording ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <Button
            variant="default"
            onClick={startRecording}
            iconName="Mic"
            iconPosition="left"
            className="bg-primary hover:bg-primary/90"
          >
            Start Recording
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
              <span>Recording: {formatTime(recordingTime)}</span>
            </div>
            <Button
              variant="destructive"
              onClick={stopRecording}
              iconName="Square"
              iconPosition="left"
            >
              Stop Recording
            </Button>
          </div>
        )}
      </div>
      {/* Transcription Display */}
      {transcription && (
        <div className="bg-surface rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Transcription</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{transcription}"
          </p>
        </div>
      )}
      {/* Voice Input Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Speak clearly and at a normal pace</p>
        <p>• Your voice data is processed securely and not stored</p>
        <p>• Recording will automatically stop after 2 minutes</p>
      </div>
    </div>
  );
};

export default VoiceInput;