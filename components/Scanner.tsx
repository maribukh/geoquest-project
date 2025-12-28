
import React, { useRef, useState, useEffect } from 'react';
import { identifyLandmark } from '../services/geminiService';
import { QuestResponse, Coordinates } from '../types';

interface ScannerProps {
  onAnalyzeComplete: (data: QuestResponse, imageBase64?: string) => void;
  onClose: () => void;
  userLocation: Coordinates;
}

const Scanner: React.FC<ScannerProps> = ({ onAnalyzeComplete, onClose, userLocation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access needed.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Maximize analysis performance by not sending 4K images
    const MAX_WIDTH = 1024;
    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.7); // Slightly higher quality for better recognition
      try {
        // Pass the GPS location to the AI service for Geogrounding
        const result = await identifyLandmark(imageBase64, userLocation);
        // Pass BOTH the result AND the image back to App.tsx
        onAnalyzeComplete(result, imageBase64);
      } catch (e) {
        setError("Connection failed.");
        setIsScanning(false);
      }
    }
  };

  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-6 z-50">
        <p className="mb-4 font-bold">{error}</p>
        <button onClick={onClose} className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold">Close</button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
        
        {/* --- HUD OVERLAY LAYER --- */}
        <div className="absolute inset-0 pointer-events-none">
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Scanning Beam Animation */}
            {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)] scanning-beam z-10"></div>
            )}

            {/* Central Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-emerald-500/30 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400"></div>
                
                {/* Center Cross */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-400/50"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-400/50"></div>
                </div>
            </div>

            {/* Top Info Bar */}
            <div className="absolute top-8 left-4 right-4 flex justify-between items-start">
                 <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400 uppercase tracking-widest">
                    SYS.ONLINE // GPS_LOCKED
                 </div>
                 <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400">
                    LAT: {userLocation.lat.toFixed(5)}<br/>
                    LNG: {userLocation.lng.toFixed(5)}
                 </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
                 <p className={`text-sm font-bold uppercase tracking-[0.2em] ${isScanning ? 'text-emerald-300 animate-pulse' : 'text-white/70'}`}>
                    {isScanning ? 'Analyzing Structure...' : 'Align Target & Capture'}
                 </p>
            </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Deck */}
      <div className="h-32 bg-slate-900 border-t border-emerald-900/50 flex items-center justify-center px-10 relative z-50">
        <button 
            onClick={onClose} 
            className="absolute left-10 text-emerald-500/70 hover:text-emerald-400 font-mono text-xs uppercase tracking-widest border border-emerald-500/30 px-4 py-2 rounded"
        >
            Abort
        </button>

        <button 
          onClick={handleCapture}
          disabled={isScanning}
          className={`w-20 h-20 rounded-full border border-emerald-500/30 flex items-center justify-center transition-all duration-300 ${isScanning ? 'scale-95 opacity-50' : 'active:scale-95 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}
        >
          <div className={`w-16 h-16 rounded-full border-2 border-emerald-200 transition-all ${isScanning ? 'bg-emerald-600' : 'bg-white'}`}></div>
        </button>
      </div>
    </div>
  );
};

export default Scanner;
