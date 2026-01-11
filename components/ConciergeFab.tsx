import React, { useState } from 'react';
import CurrencyConverter from './CurrencyConverter';

interface ConciergeFabProps {
  onOpenPlanner?: () => void;
}

const ConciergeFab: React.FC<ConciergeFabProps> = ({ onOpenPlanner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <>
      {/* Render Modal Outside the Flow */}
      {showCurrency && (
        <CurrencyConverter onClose={() => setShowCurrency(false)} />
      )}

      {/* Positioned higher (bottom-32) to align with map controls, or just below them */}
      <div className='absolute bottom-32 left-4 z-[900] flex flex-col items-start gap-3 pointer-events-auto'>
        {/* Menu Items (Expanding Upwards) */}
        {isOpen && (
          <div className='flex flex-col gap-3 animate-fade-in-up items-start mb-2'>
            {/* AI Planner */}
            {onOpenPlanner && (
              <button
                onClick={() => {
                  onOpenPlanner();
                  setIsOpen(false);
                }}
                className='flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 rounded-full shadow-lg border border-indigo-400/50 hover:brightness-110 transition-all active:scale-95'
              >
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm'>
                  🪄
                </div>
                <span className='text-xs font-bold text-white'>
                  Magic Planner
                </span>
              </button>
            )}

            {/* Instagram Community */}
            <a
              href='https://www.instagram.com/historygeo_/'
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-all'
            >
              <div className='w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm'>
                📸
              </div>
              <span className='text-xs font-bold text-slate-700'>
                Community
              </span>
            </a>

            {/* Currency Button */}
            <button
              onClick={() => {
                setShowCurrency(true);
                setIsOpen(false);
              }}
              className='flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors'
            >
              <div className='w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold'>
                ₾
              </div>
              <span className='text-xs font-bold text-slate-700'>
                Lari Lens
              </span>
            </button>

            {/* Bolt Taxi */}
            <a
              href='https://bolt.eu/'
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors'
            >
              <div className='w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm'>
                UB
              </div>
              <span className='text-xs font-bold text-slate-700'>
                Order Taxi
              </span>
            </a>

            {/* Emergency */}
            <a
              href='tel:112'
              className='flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-red-50 transition-colors'
            >
              <div className='w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm'>
                🚑
              </div>
              <span className='text-xs font-bold text-red-600'>SOS (112)</span>
            </a>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all duration-300 border-4 border-white active:scale-95 ${
            isOpen
              ? 'bg-slate-800 rotate-45'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105'
          }`}
        >
          <span className='text-white'>{isOpen ? '＋' : '🧳'}</span>
        </button>
      </div>
    </>
  );
};

export default ConciergeFab;
