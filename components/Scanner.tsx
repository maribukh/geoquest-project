import React, { useRef, useState, useEffect } from 'react';
import { identifyLandmark } from '../services/geminiService';
import { QuestResponse, Coordinates } from '../types';

interface ScannerProps {
  onAnalyzeComplete: (data: QuestResponse, imageBase64?: string) => void;
  onClose: () => void;
  userLocation: Coordinates;
}

const Scanner: React.FC<ScannerProps> = ({
  onAnalyzeComplete,
  onClose,
  userLocation,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        // Mobile-optimized constraints
        const constraints = {
          audio: false,
          video: {
            facingMode: 'environment', // Rear camera
            width: { ideal: 1280 }, // Lower resolution for better stability
            height: { ideal: 720 },
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Important for iOS: ensure video actually plays
          videoRef.current.onloadedmetadata = () => {
            setIsVideoReady(true);
            videoRef.current
              ?.play()
              .catch((e) => console.error('Play error:', e));
          };
        }
      } catch (err) {
        console.error('Camera Error:', err);
        // Don't show blocking error immediately, allow gallery upload
        setIsVideoReady(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const processImage = async (imageBase64: string) => {
    setIsScanning(true);
    try {
      const result = await identifyLandmark(imageBase64, userLocation);
      onAnalyzeComplete(result, imageBase64);
    } catch (e) {
      console.error('Scan failed:', e);
      setError('Connection failed. Try again.');
      setIsScanning(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;

    // Scale down image for API performance (Max 1024px width)
    const MAX_WIDTH = 1024;
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.7);
      await processImage(imageBase64);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  if (error) {
    return (
      <div className='absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-6 z-50'>
        <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4'>
          <span className='text-3xl'>🚫</span>
        </div>
        <p className='mb-6 font-bold text-center'>{error}</p>
        <button
          onClick={onClose}
          className='px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold'
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className='absolute inset-0 z-40 bg-black flex flex-col'>
      <div className='relative flex-1 bg-black overflow-hidden'>
        {/* Video Element: PlaysInline is CRITICAL for iOS */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover opacity-80 ${
            !isVideoReady ? 'hidden' : ''
          }`}
        />

        {/* Fallback Message if camera denied/loading */}
        {!isVideoReady && (
          <div className='absolute inset-0 flex items-center justify-center p-8 text-center'>
            <div>
              <div className='text-4xl mb-4'>📷</div>
              <p className='text-white/70 text-sm font-medium'>
                Camera access not available.
              </p>
              <p className='text-white/50 text-xs mt-2'>
                Please use the Upload button below to take a photo.
              </p>
            </div>
          </div>
        )}

        {/* --- HUD OVERLAY LAYER --- */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Grid Overlay */}
          <div
            className='absolute inset-0 opacity-20'
            style={{
              backgroundImage:
                'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>

          {/* Scanning Beam Animation */}
          {isScanning && (
            <div className='absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)] scanning-beam z-10'></div>
          )}

          {/* Central Reticle */}
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-emerald-500/30 rounded-lg'>
            <div className='absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400'></div>
            <div className='absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400'></div>
            <div className='absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400'></div>
            <div className='absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400'></div>

            {/* Center Cross */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4'>
              <div className='absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-400/50'></div>
              <div className='absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-400/50'></div>
            </div>
          </div>

          {/* Top Info Bar */}
          <div className='absolute top-8 left-4 right-4 flex justify-between items-start'>
            <div className='bg-black/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400 uppercase tracking-widest'>
              {isVideoReady ? 'SYS.ONLINE // READY' : 'CAM.OFFLINE'}
            </div>
            <div className='bg-black/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400'>
              LAT: {userLocation.lat.toFixed(5)}
              <br />
              LNG: {userLocation.lng.toFixed(5)}
            </div>
          </div>

          {/* Bottom Status */}
          <div className='absolute bottom-32 left-0 right-0 text-center'>
            <p
              className={`text-sm font-bold uppercase tracking-[0.2em] ${
                isScanning ? 'text-emerald-300 animate-pulse' : 'text-white/70'
              }`}
            >
              {isScanning ? 'Analyzing Structure...' : 'Align Target & Capture'}
            </p>
          </div>
        </div>

        <canvas ref={canvasRef} className='hidden' />

        {/* Hidden File Input for Native Camera/Gallery */}
        <input
          type='file'
          ref={fileInputRef}
          accept='image/*'
          capture='environment' // This tries to open the rear camera directly on mobile
          className='hidden'
          onChange={handleFileSelect}
        />
      </div>

      {/* Control Deck */}
      <div className='h-32 bg-slate-900 border-t border-emerald-900/50 flex items-center justify-between px-10 relative z-50'>
        <button
          onClick={onClose}
          className='text-emerald-500/70 hover:text-emerald-400 font-mono text-xs uppercase tracking-widest border border-emerald-500/30 px-4 py-2 rounded'
        >
          Abort
        </button>

        {/* Shutter Button (Live Camera) */}
        {isVideoReady && (
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className={`w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center transition-all duration-300 ${
              isScanning
                ? 'scale-95 opacity-50'
                : 'active:scale-95 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full border-2 border-emerald-200 transition-all ${
                isScanning ? 'bg-emerald-600' : 'bg-white'
              }`}
            ></div>
          </button>
        )}

        {/* Gallery / Upload Button (Fallback) */}
        <button
          onClick={openGallery}
          disabled={isScanning}
          className='flex flex-col items-center gap-1 text-emerald-500/70 hover:text-emerald-400 active:scale-95 transition-transform'
        >
          <div className='w-10 h-10 rounded-xl border border-emerald-500/30 flex items-center justify-center bg-emerald-900/20'>
            <span className='text-xl'>🖼️</span>
          </div>
          <span className='text-[9px] font-bold uppercase tracking-widest'>
            Upload
          </span>
        </button>
      </div>
    </div>
  );
};

export default Scanner;
