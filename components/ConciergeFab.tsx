
import React, { useState } from 'react';
import CurrencyConverter from './CurrencyConverter';

const ConciergeFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <>
        {/* Render Modal Outside the Flow */}
        {showCurrency && (
            <CurrencyConverter onClose={() => setShowCurrency(false)} />
        )}

        <div className="absolute bottom-28 right-4 z-[900] flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Menu Items */}
        {isOpen && (
            <div className="flex flex-col gap-3 animate-fade-in-up items-end">
                
                {/* Instagram Community */}
                <a 
                    href="https://www.instagram.com/historygeo_/" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2.5 rounded-full shadow-lg border border-purple-400/50 hover:brightness-110 transition-all"
                >
                    <span className="text-xs font-bold text-white">Join Community</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">📸</div>
                </a>

                {/* Currency Button */}
                <button 
                    onClick={() => { setShowCurrency(true); setIsOpen(false); }}
                    className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                    <span className="text-xs font-bold text-slate-700">Lari Lens</span>
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">₾</div>
                </button>
                
                {/* Bolt Taxi */}
                <a 
                    href="https://bolt.eu/" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                    <span className="text-xs font-bold text-slate-700">Order Taxi</span>
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">UB</div>
                </a>

                {/* Google Translate */}
                <a 
                    href="https://translate.google.com/?sl=ka&tl=en" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-blue-50 transition-colors"
                >
                    <span className="text-xs font-bold text-slate-700">Translator</span>
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">G</div>
                </a>

                {/* Emergency */}
                <a 
                    href="tel:112"
                    className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-red-50 transition-colors"
                >
                    <span className="text-xs font-bold text-red-600">SOS (112)</span>
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm">🚑</div>
                </a>

            </div>
        )}

        {/* Main Toggle Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 border-4 border-white active:scale-95 ${isOpen ? 'bg-slate-800 rotate-45' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105'}`}
        >
            <span className="text-white">{isOpen ? '＋' : '🧳'}</span>
        </button>

        </div>
    </>
  );
};

export default ConciergeFab;
