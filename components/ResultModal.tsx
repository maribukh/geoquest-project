import React, { useState, useEffect, useRef } from 'react';
import { QuestResponse } from '../types';
import {
  generateAudioGuide,
  base64ToUint8Array,
  pcmToAudioBuffer,
} from '../services/geminiService';

interface ResultModalProps {
  result: QuestResponse;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const isSuccess = result.location_confirmed;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtor();
    setAudioContext(ctx);

    return () => {
      if (ctx.state !== 'closed') ctx.close();
    };
  }, []);

  const handleAudioTour = async () => {
    if (isPlaying) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        setIsPlaying(false);
      }
      return;
    }

    if (!audioContext) return;
    setIsLoadingAudio(true);

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

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
    } catch (e: any) {
      console.error('Failed to play audio tour', e);
      let msg = e.message || 'Unknown error';
      if (msg.includes('403')) msg = 'Google Cloud Billing is disabled.';
      alert(`Audio Failed: ${msg}`);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className='fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn'>
      <div className='w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative'>
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isSuccess
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
              : 'bg-gray-300'
          }`}
        ></div>

        <div className='pt-10 pb-8 px-8 text-center'>
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl shadow-lg ${
              isSuccess
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {isSuccess ? result.reward_icon || '🎉' : '🤔'}
          </div>

          <h2 className='text-2xl font-extrabold text-slate-800 mb-3 tracking-tight leading-tight'>
            {isSuccess ? result.place_name : 'Looking...'}
          </h2>

          <div className='relative mb-6'>
            <p className='text-slate-600 text-sm leading-relaxed font-medium'>
              "{result.story}"
            </p>
          </div>

          <button
            onClick={handleAudioTour}
            disabled={isLoadingAudio}
            className={`mx-auto mb-8 w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border-2
                ${
                  isPlaying
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 shadow-sm'
                }`}
          >
            {isLoadingAudio ? (
              <span className='animate-spin text-lg'>⏳</span>
            ) : isPlaying ? (
              <>
                <span className='animate-pulse text-lg'>🔊</span>
                <span>Stop Tour</span>
              </>
            ) : (
              <>
                <span className='text-lg'>✨</span>
                <span>Start AI Audio Tour</span>
              </>
            )}
          </button>

          {isSuccess && (
            <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 mb-6 border border-orange-100'>
              <p className='text-[10px] uppercase tracking-widest text-orange-400 font-bold mb-1'>
                Earned
              </p>
              <p className='text-3xl font-black text-slate-800'>
                +{result.points_earned}{' '}
                <span className='text-lg font-medium text-slate-400'>pts</span>
              </p>
            </div>
          )}

          <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 text-left'>
            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2'>
              Next Hint
            </p>
            <p className='text-sm font-semibold text-slate-700'>
              {result.next_quest_hint}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-transform active:scale-95 ${
              isSuccess
                ? 'bg-slate-900 hover:bg-black'
                : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {isSuccess ? 'Collect Reward' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
