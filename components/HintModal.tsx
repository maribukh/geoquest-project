import React from 'react';
import { Landmark } from '../types';

interface HintModalProps {
  landmark: Landmark;
  onClose: () => void;
}

const HintModal: React.FC<HintModalProps> = ({ landmark, onClose }) => {
  const hintText = landmark.hints && landmark.hints.length > 0 ? landmark.hints[0] : "No hint available.";

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
        {/* Overlay Close */}
        <div className="absolute inset-0" onClick={onClose}></div>

        <div className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl animate-bounce-in">
            {/* Header with decorative background */}
            <div className="bg-amber-50 p-6 border-b border-amber-100 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10 pointer-events-none">📜</div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl shadow-sm border border-amber-200">
                        💡
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 font-serif leading-none">Secret Hint</h3>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">Unlocked Content</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                    For: {landmark.name}
                </h4>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-lg font-medium text-slate-800 leading-relaxed font-serif">
                        "{hintText}"
                    </p>
                </div>
                
                <div className="mt-6 flex justify-center">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HintModal;
