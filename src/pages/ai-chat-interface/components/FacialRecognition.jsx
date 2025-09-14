import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FacialRecognition = ({ onEmotionDetected, isActive, onToggle }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const emotions = [
    { type: 'calm', color: 'var(--color-primary)', icon: 'Smile' },
    { type: 'happy', color: 'var(--color-success)', icon: 'Laugh' },
    { type: 'anxious', color: 'var(--color-warning)', icon: 'Frown' },
    { type: 'sad', color: 'var(--color-secondary)', icon: 'Meh' },
    { type: 'stressed', color: 'var(--color-error)', icon: 'AlertCircle' },
    { type: 'neutral', color: 'var(--color-muted-foreground)', icon: 'Minus' }
  ];

  const startWebcam = async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const stream = await navigator.mediaDevices?.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (!stream) {
        throw new Error('Failed to access camera stream');
      }
      
      streamRef.current = stream;
      setPermissionGranted(true);
      
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef?.current?.play()?.then(() => {
            setIsWebcamActive(true);
            startEmotionDetection();
          })?.catch(error => {
            console.error('Error playing video:', error);
            setError('Failed to display camera feed');
          });
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setError('Camera display error');
        };
      }
      
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setError(error?.message || 'Failed to access camera');
      
      if (error?.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (error?.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (error?.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      }
    }
  };

  const stopWebcam = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => {
        track?.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef?.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
    }
    
    if (detectionIntervalRef?.current) {
      clearInterval(detectionIntervalRef?.current);
      detectionIntervalRef.current = null;
    }
    
    setIsWebcamActive(false);
    setDetectedEmotion(null);
    setConfidence(0);
    setError(null);
    setPermissionGranted(false);
  };

  const startEmotionDetection = () => {
    // Simulate emotion detection with mock data
    detectionIntervalRef.current = setInterval(() => {
      const randomEmotion = emotions?.[Math.floor(Math.random() * emotions?.length)];
      const randomConfidence = 0.6 + Math.random() * 0.4; // 60-100% confidence
      
      setDetectedEmotion(randomEmotion);
      setConfidence(randomConfidence);
      
      if (onEmotionDetected) {
        onEmotionDetected({
          type: randomEmotion?.type,
          confidence: randomConfidence,
          timestamp: new Date(),
          source: 'facial'
        });
      }
    }, 3000); // Update every 3 seconds
  };

  const togglePrivacyMode = () => {
    setPrivacyMode(!privacyMode);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Facial Emotion Recognition</h3>
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

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-destructive)" className="mt-0.5" />
            <div className="text-sm text-destructive">
              <p className="font-medium">Camera Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Webcam Preview */}
      <div className="relative bg-surface rounded-lg overflow-hidden min-h-[240px]" style={{ aspectRatio: '4/3' }}>
        {isWebcamActive && !error ? (
          <>
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${privacyMode ? 'blur-lg' : ''}`}
              muted
              playsInline
              autoPlay
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: 'none' }}
            />
            
            {/* Emotion Overlay */}
            {detectedEmotion && !privacyMode && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={detectedEmotion?.icon} 
                    size={16} 
                    color={detectedEmotion?.color}
                  />
                  <span className="text-sm font-medium capitalize">
                    {detectedEmotion?.type}
                  </span>
                  <span className="text-xs opacity-80">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Privacy Mode Indicator */}
            {privacyMode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Icon name="EyeOff" size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Privacy Mode Active</p>
                  <p className="text-xs opacity-80">Emotion detection continues</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Icon name="Camera" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium">
                {error ? 'Camera unavailable' : 'Webcam not active'}
              </p>
              <p className="text-xs opacity-80">
                {error ? 'Please resolve the error above' : 'Click start to begin emotion detection'}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isWebcamActive ? (
            <Button
              variant="default"
              onClick={startWebcam}
              iconName="Camera"
              iconPosition="left"
              disabled={!!error}
            >
              Start Camera
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopWebcam}
              iconName="CameraOff"
              iconPosition="left"
            >
              Stop Camera
            </Button>
          )}
          
          {isWebcamActive && !error && (
            <Button
              variant="outline"
              onClick={togglePrivacyMode}
              iconName={privacyMode ? "Eye" : "EyeOff"}
              iconPosition="left"
            >
              {privacyMode ? "Show" : "Hide"}
            </Button>
          )}
        </div>

        {/* Current Emotion Display */}
        {detectedEmotion && !error && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface rounded-full">
            <Icon 
              name={detectedEmotion?.icon} 
              size={16} 
              color={detectedEmotion?.color}
            />
            <span className="text-sm font-medium capitalize text-foreground">
              {detectedEmotion?.type}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        )}
      </div>
      {/* Privacy Notice */}
      <div className="bg-surface rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} color="var(--color-primary)" className="mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Privacy & Security</p>
            <p>• Video processing happens locally on your device</p>
            <p>• No video data is transmitted or stored on our servers</p>
            <p>• Only emotion analysis results are used for therapeutic insights</p>
            <p>• You can enable privacy mode to blur your video feed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialRecognition;