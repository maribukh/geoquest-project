
import React from 'react';
import { Landmark } from '../types';

interface SouvenirBoardProps {
  landmarks: Landmark[];
  unlockedIds: string[];
}

const SouvenirBoard: React.FC<SouvenirBoardProps> = ({ landmarks, unlockedIds }) => {
  // Only quest items are collectable souvenirs
  const quests = landmarks.filter(l => l.category === 'quest');

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memory Wall</h3>
         <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
            {unlockedIds.length} / {quests.length} Photos
         </span>
      </div>

      {/* CORKBOARD CONTAINER */}
      <div className="relative bg-[#d4a373] p-4 rounded-3xl shadow-inner border-4 border-[#bc8a5f] overflow-hidden min-h-[300px]">
         {/* Cork Texture Pattern */}
         <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cork-board.png")' }}></div>
         
         {/* Pins Grid */}
         <div className="grid grid-cols-2 gap-4 relative z-10">
            {quests.map((quest, index) => {
                const isUnlocked = unlockedIds.includes(quest.id) || quest.isUnlocked;
                // Random rotation for natural look
                const rotation = (index % 2 === 0 ? -1 : 1) * ((index * 7) % 6 + 2);
                
                // Decide which image to show: User's capture or Stock
                const displayImage = quest.userPhoto || quest.image;
                const hasUserPhoto = !!quest.userPhoto;

                return (
                    <div 
                        key={quest.id} 
                        className={`relative group transition-all duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-60 grayscale blur-[1px]'}`}
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {/* PIN */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-red-500 shadow-md border border-red-700">
                             <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-40"></div>
                        </div>

                        {/* POLAROID FRAME */}
                        <div className="bg-white p-2 pb-8 shadow-xl transform transition-transform hover:scale-105 hover:z-10">
                            <div className="aspect-square bg-slate-200 overflow-hidden mb-2 filter sepia-[.3] relative">
                                <img 
                                    src={displayImage} 
                                    alt={quest.name} 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                />
                                {hasUserPhoto && (
                                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur rounded-full p-1">
                                        <div className="text-[8px] text-white">📸 You</div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                                <span className={`font-serif text-[10px] text-slate-600 font-bold block truncate ${isUnlocked ? '' : 'line-through decoration-slate-400'}`}>
                                    {quest.name}
                                </span>
                            </div>
                        </div>

                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                                    Not Found
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
         </div>

         {unlockedIds.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white/80 p-4 rounded-xl text-center transform rotate-2 shadow-lg">
                     <p className="font-serif text-slate-600 italic">"Your memories go here..."</p>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default SouvenirBoard;
