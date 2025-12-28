
import React from 'react';
import { UserState } from '../types';

interface ShareModalProps {
  userState: UserState;
  onClose: () => void;
  userName: string;
  customImage?: string; // Optional: The photo user took
}

const ShareModal: React.FC<ShareModalProps> = ({ userState, onClose, userName, customImage }) => {
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GeoQuest Kutaisi',
          text: `I'm exploring Kutaisi with AI! 🌍 Found ${userState.inventory.length} secrets. Stay at Mari Apartment for the best experience!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert("Copy link: " + window.location.href);
    }
  };

  // Default image if no user photo
  const bgImage = customImage || "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fadeIn">
      
      <div className="flex flex-col items-center w-full max-w-sm">
        
        {/* --- INSTRUCTIONS --- */}
        <div className="text-white text-center mb-6">
            <h3 className="text-xl font-bold tracking-tight">Your Travel Story 🇬🇪</h3>
            <p className="text-xs text-slate-400 mt-1">Screenshot this card to share on Instagram!</p>
        </div>

        {/* --- THE STORY CARD (Design target: 9:16 Ratio) --- */}
        <div className="relative w-full aspect-[9/16] bg-white rounded-[32px] overflow-hidden shadow-2xl group transform transition-transform hover:scale-[1.02] duration-500">
            
            {/* Background Image */}
            <img 
                src={bgImage} 
                alt="Kutaisi" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90"></div>

            {/* Glass Frame Border */}
            <div className="absolute inset-0 border-[8px] border-white/20 rounded-[32px]"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                
                {/* Top: Date & Location */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-1">Georgia</span>
                        <h1 className="text-4xl font-black text-white leading-none font-serif tracking-tighter">KUTAISI</h1>
                        <div className="mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 w-fit">
                            <span className="text-xs">📍</span>
                            <span className="text-[10px] text-white font-bold uppercase">City Explorer</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-500">
                        🇬🇪
                    </div>
                </div>

                {/* Center: User Stats Circle */}
                <div className="self-center relative">
                     {/* Decorative Rings */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full animate-spin-slow"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full"></div>
                     
                     <div className="text-center bg-white/10 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-2xl relative z-10">
                        <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-1">Explorer Rank</p>
                        <h2 className="text-3xl font-black text-white mb-2">{userName}</h2>
                        <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full mb-3"></div>
                        <div className="flex justify-center gap-6 text-white">
                            <div>
                                <span className="block text-xl font-bold">{userState.level}</span>
                                <span className="text-[8px] uppercase opacity-70">Lvl</span>
                            </div>
                            <div>
                                <span className="block text-xl font-bold">{userState.inventory.length}</span>
                                <span className="text-[8px] uppercase opacity-70">Found</span>
                            </div>
                            <div>
                                <span className="block text-xl font-bold">{userState.points}</span>
                                <span className="text-[8px] uppercase opacity-70">Pts</span>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Bottom: Hotel Promo */}
                <div>
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-xl transform rotate-1">
                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-xl shrink-0">
                            🏡
                        </div>
                        <div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Stay at</p>
                            <p className="text-sm font-black text-slate-800 leading-tight">Mari Apartment Kutaisi</p>
                        </div>
                        <div className="ml-auto">
                            <div className="w-8 h-8 border-2 border-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold">➜</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-white/50 text-[8px] mt-4 uppercase tracking-[0.3em]">Generated by GeoQuest AI</p>
                </div>
            </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex gap-3 mt-8 w-full px-4">
            <button 
                onClick={onClose}
                className="flex-1 py-3.5 bg-slate-800 text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-colors"
            >
                Close
            </button>
            <button 
                onClick={handleNativeShare}
                className="flex-[2] py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <span>🚀</span> Share Link
            </button>
        </div>

      </div>
      
      <style>{`
        @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ShareModal;
