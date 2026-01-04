import React, { useState } from 'react';
import { KUTAISI_LEGENDS } from '../constants';
import { Legend } from '../types';

const HallOfFame: React.FC = () => {
  const [activeLegend, setActiveLegend] = useState<Legend | null>(null);

  return (
    <div className="mb-24 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex items-end justify-between px-2 mb-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-emerald-700">
                🏛️
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif leading-none tracking-tight">The Pantheon</h3>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-[0.2em] mt-2 opacity-70">
                   Kutaisi Hall of Fame
                </p>
            </div>
         </div>
      </div>

      {/* --- GALLERY GRID (MASONRY STYLE) --- */}
      <div className="grid grid-cols-2 gap-4 px-1">
         {KUTAISI_LEGENDS.map((legend, index) => {
             // Stagger animation delay
             const delay = `${index * 50}ms`;
             
             return (
                 <button 
                    key={legend.id}
                    onClick={() => setActiveLegend(legend)}
                    className="relative group flex flex-col items-center bg-white rounded-[24px] p-2 pb-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: delay }}
                 >
                    {/* Portrait Frame */}
                    <div className="w-full aspect-[4/5] rounded-[20px] overflow-hidden relative mb-3 bg-slate-100">
                        <img 
                            src={legend.image} 
                            alt={legend.name} 
                            className="w-full h-full object-cover filter sepia-[0.3] contrast-110 group-hover:sepia-0 group-hover:scale-105 transition-all duration-700"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                        
                        {/* Gymnasium Badge */}
                        {legend.gymnasiumConnection && (
                             <div className="absolute top-2 right-2 bg-white/90 text-emerald-900 p-1.5 rounded-full shadow-md backdrop-blur-sm">
                                <span className="text-[10px]">🎓</span>
                             </div>
                        )}
                    </div>

                    {/* Text Info */}
                    <div className="text-center px-1">
                        <h4 className="font-serif font-bold text-sm text-slate-800 leading-tight mb-1 group-hover:text-emerald-800 transition-colors">
                            {legend.name}
                        </h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            {legend.role}
                        </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/20 rounded-[24px] pointer-events-none transition-colors"></div>
                 </button>
             );
         })}
      </div>

      {/* --- DETAILED DOSSIER MODAL --- */}
      {activeLegend && (
          <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center bg-emerald-950/90 backdrop-blur-md animate-fadeIn p-4 sm:p-8">
              
              {/* Overlay Click to Close */}
              <div className="absolute inset-0" onClick={() => setActiveLegend(null)}></div>

              <div className="bg-[#fdfbf7] w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-slide-up z-10 border-4 border-[#eaddcf] flex flex-col">
                  
                  {/* Decorative Texture */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

                  {/* Close Button */}
                  <button 
                    onClick={() => setActiveLegend(null)}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold hover:bg-black transition-colors shadow-lg"
                  >
                    ✕
                  </button>

                  {/* Top Section: Photo & Header */}
                  <div className="relative shrink-0 p-6 pb-0 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-4 border-[#eaddcf] shadow-xl overflow-hidden mb-4 relative z-10">
                          <img src={activeLegend.image} alt={activeLegend.name} className="w-full h-full object-cover filter sepia-[0.2]" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 font-serif text-center leading-none relative z-10">
                          {activeLegend.name}
                      </h2>
                      <div className="h-0.5 w-12 bg-emerald-500 my-3 relative z-10"></div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] text-center relative z-10">
                          {activeLegend.role}
                      </p>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                      
                      {/* Timeline Badge */}
                      <div className="flex justify-center mb-6">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-mono font-bold">
                              {activeLegend.years}
                          </span>
                      </div>

                      {/* Bio */}
                      <div className="prose prose-sm text-slate-700 leading-relaxed font-medium text-justify mb-6">
                          <p>
                              <span className="text-3xl float-left mr-2 mt-[-10px] font-serif text-emerald-600">
                                  {activeLegend.bio.charAt(0)}
                              </span>
                              {activeLegend.bio.substring(1)}
                          </p>
                      </div>

                      {/* Quote Card */}
                      {activeLegend.quote && (
                          <div className="bg-white p-5 rounded-2xl border border-[#eaddcf] shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 text-6xl text-emerald-50 font-serif leading-none mr-2 mt-2">”</div>
                              <p className="italic text-slate-600 text-sm relative z-10 font-serif text-center">
                                  "{activeLegend.quote}"
                              </p>
                          </div>
                      )}

                      {/* Connection Badge */}
                      {activeLegend.gymnasiumConnection && (
                          <div className="mt-6 flex items-center justify-center gap-2 opacity-70">
                              <span className="text-lg">🎓</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  Gymnasium Alumni
                              </span>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HallOfFame;
