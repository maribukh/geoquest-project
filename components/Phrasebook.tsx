import React, { useState, useRef, useEffect } from 'react';
import { GEORGIAN_PHRASES } from '../constants';
import { generatePhraseAudio } from '../services/geminiService';

const Phrasebook: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const categories = [
    'All',
    ...Array.from(new Set(GEORGIAN_PHRASES.map((p) => p.category))),
  ];

  const filteredPhrases =
    activeCategory === 'All'
      ? GEORGIAN_PHRASES
      : GEORGIAN_PHRASES.filter((p) => p.category === activeCategory);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlay = async (text: string, index: number) => {
    // Prevent multiple clicks
    if (loadingIndex !== null || playingIndex !== null) return;

    setLoadingIndex(index);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      // Resume context if suspended (browser policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const audioBufferData = await generatePhraseAudio(text);
      const audioBuffer = await ctx.decodeAudioData(audioBufferData);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      source.onended = () => {
        setPlayingIndex(null);
      };

      setLoadingIndex(null);
      setPlayingIndex(index);
      source.start(0);
    } catch (error) {
      console.error('Audio playback error:', error);
      setLoadingIndex(null);
      setPlayingIndex(null);
      alert('Audio unavailable. Check connection.');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-3xl p-6 border border-slate-100 shadow-lg'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-xl font-black text-slate-800 font-serif'>
              Speak Like a Local
            </h3>
            <p className='text-xs text-slate-500 font-medium mt-1'>
              Tap to listen & practice
            </p>
          </div>
          <div className='w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl'>
            🗣️
          </div>
        </div>

        {/* Categories */}
        <div className='flex gap-2 overflow-x-auto pb-4 no-scrollbar'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Phrases List */}
        <div className='grid gap-3'>
          {filteredPhrases.map((phrase, idx) => {
            // We use the index from the original array for state tracking if needed,
            // or just map index if list doesn't change order dynamically in a complex way.
            // Here simpler to just use current map index for visual state.
            const isPlaying = playingIndex === idx;
            const isLoading = loadingIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  isPlaying
                    ? 'bg-indigo-50 border-indigo-200 shadow-inner'
                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md'
                }`}
              >
                <div className='flex-1'>
                  {/* English Meaning */}
                  <h4 className='font-bold text-slate-800 text-sm mb-1'>
                    {phrase.eng}
                  </h4>

                  {/* Pronunciation (Latin) */}
                  <p className='text-indigo-600 font-bold text-sm mb-0.5 tracking-wide'>
                    "{phrase.phon}"
                  </p>

                  {/* Georgian Script */}
                  <p className='text-xs text-slate-400 font-medium font-serif opacity-80'>
                    {phrase.geo}
                  </p>
                </div>

                <button
                  onClick={() => handlePlay(phrase.geo, idx)}
                  disabled={isLoading || isPlaying}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm border-2 ${
                    isPlaying
                      ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse'
                      : isLoading
                      ? 'bg-white border-slate-200 text-slate-300'
                      : 'bg-white border-slate-100 text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {isLoading ? (
                    <div className='w-5 h-5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin'></div>
                  ) : isPlaying ? (
                    <span className='text-xl'>🔊</span>
                  ) : (
                    <span className='text-xl ml-1'>▶</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Phrasebook;
