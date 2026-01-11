
import React from 'react';

interface SupportModalProps {
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-gradient-to-b from-white to-slate-50 rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
        
        {/* Header Image / Pattern */}
        <div className="h-32 bg-amber-400 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="text-6xl animate-bounce-slow">☕️</div>
        </div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-white font-bold transition-colors z-10"
        >
            ✕
        </button>

        <div className="p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-serif">Support the Dev</h2>
            <div className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-4">
                Solo Developer Project
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                Gamarjoba! I built <b>GeoQuest</b> all by myself to help you love Kutaisi as much as I do. 
                <br/><br/>
                If this app made your trip better, consider buying me a coffee (or a Khinkali!) to keep the servers running.
            </p>

            <div className="space-y-3">
                <a 
                    href="https://ko-fi.com/mariambukhaidze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-white border-2 border-amber-100 rounded-2xl hover:border-amber-400 hover:bg-amber-50 transition-all group shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🥟</span>
                        <div className="text-left">
                            <div className="text-sm font-bold text-slate-800">Buy me a Khinkali</div>
                            <div className="text-[10px] text-slate-400">Small support</div>
                        </div>
                    </div>
                    <span className="font-bold text-amber-600">$3</span>
                </a>

                <a 
                    href="https://ko-fi.com/mariambukhaidze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl text-white shadow-lg shadow-amber-500/30 transform transition-transform hover:scale-[1.02] active:scale-95"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl animate-pulse">☕️</span>
                        <div className="text-left">
                            <div className="text-sm font-bold">Coffee & Servers</div>
                            <div className="text-[10px] text-amber-100">Keep the AI alive</div>
                        </div>
                    </div>
                    <span className="font-bold text-white">$5</span>
                </a>

                <a 
                    href="https://ko-fi.com/mariambukhaidze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl hover:bg-black transition-all group shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:rotate-12 transition-transform">🦁</span>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white">Legend Status</div>
                            <div className="text-[10px] text-slate-400">Serious contribution</div>
                        </div>
                    </div>
                    <span className="font-bold text-emerald-400">$15</span>
                </a>
            </div>

            <p className="text-[10px] text-slate-400 mt-6">
                Thank you for supporting independent creators! ❤️
            </p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
