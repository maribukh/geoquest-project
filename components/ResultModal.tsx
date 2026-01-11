import React, { useState, useEffect, useRef } from 'react';
import { QuestResponse } from '../types';
import {
  generateAudioGuide,
  base64ToUint8Array,
  pcmToAudioBuffer,
  speakNative,
  stopNativeSpeech,
} from '../services/geminiService';

interface ResultModalProps {
  result: QuestResponse;
  onClose: () => void;
  forceOffline?: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  forceOffline = false,
}) => {
  const isSuccess = result.location_confirmed;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [usingNative, setUsingNative] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtor();
    setAudioContext(ctx);
    return () => {
      if (ctx.state !== 'closed') ctx.close();
      stopNativeSpeech();
    };
  }, []);

  const playNative = async () => {
    setUsingNative(true);
    setIsPlaying(true);
    setAudioError(null);
    try {
      const textToSpeak = `${result.place_name}. ${result.story}`;
      await speakNative(textToSpeak);
    } catch (nativeError) {
      console.error('Native speech failed', nativeError);
      setAudioError('Voice not supported.');
    } finally {
      setIsPlaying(false);
      setUsingNative(false);
    }
  };

  const handleAudioTour = async () => {
    setAudioError(null);

    if (isPlaying) {
      if (usingNative) {
        stopNativeSpeech();
        setIsPlaying(false);
        setUsingNative(false);
      } else {
        if (audioSourceRef.current) {
          audioSourceRef.current.stop();
          setIsPlaying(false);
        }
      }
      return;
    }

    if (forceOffline) {
      playNative();
      return;
    }

    setIsLoadingAudio(true);

    try {
      if (!audioContext) throw new Error('No Audio Context');
      if (audioContext.state === 'suspended') await audioContext.resume();

      const base64Data = await generateAudioGuide(
        result.place_name,
        result.story
      );
      const rawBytes = base64ToUint8Array(base64Data);
      const audioBuffer = pcmToAudioBuffer(rawBytes, audioContext, 24000);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);

      source.start(0);
      audioSourceRef.current = source;
      setIsPlaying(true);
      setUsingNative(false);
    } catch (e: any) {
      console.warn('AI Audio failed:', e.message);
      setAudioError('Network Error. Tap to read offline.');
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleClose = () => {
    if (isPlaying) {
      if (usingNative) stopNativeSpeech();
      else if (audioSourceRef.current) audioSourceRef.current.stop();
    }
    onClose();
  };

  return (
    <div className='fixed inset-0 z-[3000] flex items-end sm:items-center justify-center pointer-events-none'>
      <div
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto'
        onClick={handleClose}
      ></div>

      {/* Main Card */}
      <div className='pointer-events-auto w-full max-w-sm bg-white sm:rounded-[32px] rounded-t-[32px] overflow-hidden shadow-2xl relative animate-slide-up sm:mb-8'>
        {/* HERO IMAGE SECTION */}
        <div className='relative h-64 w-full bg-slate-200'>
          {result.image ? (
            <img
              src={result.image}
              className='w-full h-full object-cover'
              alt={result.place_name}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-slate-100'>
              <span className='text-4xl'>📸</span>
            </div>
          )}

          {/* Gradient Overlay for Text */}
          <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent'></div>

          {/* Status Badge */}
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
              isSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isSuccess ? 'Location Verified' : 'Searching...'}
          </div>

          {/* Floating Audio Button (Overlapping Image & Content) */}
          <button
            onClick={handleAudioTour}
            disabled={isLoadingAudio}
            className={`absolute -bottom-8 right-6 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-20 ${
              isPlaying
                ? 'bg-white border-4 border-emerald-500 text-emerald-600 scale-110'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {isLoadingAudio ? (
              <div className='w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin'></div>
            ) : isPlaying ? (
              <span className='text-2xl'>⏸</span>
            ) : (
              <span className='text-3xl ml-1'>▶</span>
            )}
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className='px-8 pt-6 pb-8 bg-white relative z-10'>
          {/* Title Block */}
          <div className='mb-6 pr-16'>
            <h2 className='text-3xl font-black text-slate-900 leading-none mb-2 font-serif tracking-tight'>
              {result.place_name}
            </h2>
            {isSuccess && (
              <div className='flex items-center gap-2'>
                <span className='text-2xl'>{result.reward_icon}</span>
                <span className='text-emerald-600 font-bold text-sm'>
                  +{result.points_earned} XP
                </span>
              </div>
            )}
          </div>

          {/* Audio Status Text / Waveform Placeholder */}
          {isPlaying && (
            <div className='mb-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100'>
              <div className='flex gap-1 items-end h-4'>
                <div className='w-1 bg-emerald-500 animate-wave h-2'></div>
                <div
                  className='w-1 bg-emerald-500 animate-wave h-4'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-1 bg-emerald-500 animate-wave h-3'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className='w-1 bg-emerald-500 animate-wave h-2'
                  style={{ animationDelay: '0.3s' }}
                ></div>
              </div>
              <span className='text-xs font-bold uppercase tracking-wider'>
                AI Guide Speaking...
              </span>
            </div>
          )}

          {/* Story Text */}
          <div className='prose prose-sm text-slate-600 leading-relaxed mb-6 font-medium'>
            <p>"{result.story}"</p>
          </div>

          {/* Footer / Next Step */}
          <div className='bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3'>
            <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm shrink-0'>
              🧭
            </div>
            <div>
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>
                Next Quest
              </p>
              <p className='text-xs font-bold text-slate-800'>
                {result.next_quest_hint}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className='w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-black transition-colors'
          >
            {isSuccess ? 'Continue Journey' : 'Try Again'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes wave {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
        }
        .animate-wave {
            animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
