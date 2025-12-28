
import React from 'react';
import { Landmark } from '../types';

interface DigitalPassportProps {
  landmarks: Landmark[];
}

const DigitalPassport: React.FC<DigitalPassportProps> = ({ landmarks }) => {
  // Filter only quest landmarks
  const quests = landmarks.filter(l => l.category === 'quest');

  return (
    <div className="bg-[#fdfbf7] rounded-3xl p-6 shadow-xl border-2 border-[#eaddcf] relative overflow-hidden mb-8">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10 border-b-2 border-[#eaddcf] pb-4">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2c3e50] rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-[#eaddcf] text-white">
                🇬🇪
            </div>
            <div>
                <h3 className="font-serif font-black text-[#2c3e50] text-xl tracking-tight">OFFICIAL PASSPORT</h3>
                <p className="text-[#8c7b6d] text-[10px] font-bold uppercase tracking-widest">Republic of Georgia / Kutaisi</p>
            </div>
        </div>
        <div className="text-right">
             <span className="block text-3xl font-black text-[#2c3e50] opacity-20 font-serif">GEO</span>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="grid grid-cols-3 gap-4 relative z-10">
        {quests.map((quest, index) => {
           // Generate a consistent random rotation based on name length
           const rotation = (quest.name.length % 10 - 5) * 3; 
           
           return (
             <div key={quest.id} className="aspect-square flex flex-col items-center justify-center relative group">
                {quest.isUnlocked ? (
                    <div 
                        className="w-20 h-20 rounded-full border-4 border-indigo-900/80 flex items-center justify-center relative transform transition-transform duration-300 hover:scale-110"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <div className="absolute inset-0 rounded-full border border-indigo-900/30 m-1"></div>
                        <span className="text-3xl filter drop-shadow-sm">{quest.reward_icon}</span>
                        <div className="absolute bottom-3 text-[6px] font-bold text-indigo-900 uppercase tracking-widest opacity-70">Verified</div>
                        
                        {/* Ink Splatter Effect (CSS simulated) */}
                        <div className="absolute top-0 right-0 w-full h-full bg-indigo-900 opacity-10 rounded-full blur-md mix-blend-multiply"></div>
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center opacity-40 grayscale">
                         <span className="text-2xl">{quest.reward_icon}</span>
                    </div>
                )}
                <span className={`text-[8px] font-bold mt-2 text-center leading-tight max-w-full truncate ${quest.isUnlocked ? 'text-indigo-900' : 'text-gray-300'}`}>
                    {quest.name.split(' ')[0]}
                </span>
             </div>
           );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t-2 border-[#eaddcf] flex justify-between items-center opacity-60">
         <span className="text-[8px] font-mono text-[#8c7b6d]">DOC. NO: KUT-2024-GM</span>
         <span className="text-[8px] font-mono text-[#8c7b6d]">{quests.filter(q => q.isUnlocked).length} / {quests.length} STAMPS</span>
      </div>
    </div>
  );
};

export default DigitalPassport;
