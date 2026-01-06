
import React, { useState } from 'react';
import { planItinerary } from '../services/geminiService';
import { Coordinates, ItineraryItem, Landmark } from '../types';

interface ItineraryPlannerProps {
    onClose: () => void;
    userLocation: Coordinates;
    landmarks: Landmark[];
    onNavigateToLandmark: (id: string) => void;
}

const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({ onClose, userLocation, landmarks, onNavigateToLandmark }) => {
    const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
    const [duration, setDuration] = useState('2 hours');
    const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

    const vibes = ['🏛️ History', '🥟 Food', '📸 Photo Ops', '🌳 Nature', '🍷 Wine', '👻 Myths'];

    const toggleVibe = (vibe: string) => {
        if (selectedVibes.includes(vibe)) {
            setSelectedVibes(prev => prev.filter(v => v !== vibe));
        } else {
            if (selectedVibes.length < 3) {
                setSelectedVibes(prev => [...prev, vibe]);
            }
        }
    };

    const handleGenerate = async () => {
        setStep('loading');
        try {
            const result = await planItinerary({
                duration,
                vibe: selectedVibes,
                userLocation
            });
            setItinerary(result);
            setStep('result');
        } catch (e) {
            console.error(e);
            alert("AI is sleepy. Try again!");
            setStep('input');
        }
    };

    return (
        <div className="fixed inset-0 z-[5000] flex items-end md:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto transition-opacity" onClick={onClose}></div>

            {/* Modal Card */}
            <div className="pointer-events-auto bg-white w-full md:max-w-md h-[85vh] md:h-auto md:rounded-[40px] rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col relative animate-slide-up">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 z-10"
                >✕</button>

                {/* --- STATE 1: INPUT --- */}
                {step === 'input' && (
                    <div className="p-8 flex flex-col h-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30 mx-auto mb-4 animate-float">
                                ✨
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 font-serif">Magic Planner</h2>
                            <p className="text-slate-500 text-sm mt-1">Tell AI what you like, and we'll design the perfect route for you.</p>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            {/* Duration */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">How much time?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['1 hour', '2 hours', 'Half Day'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setDuration(t)}
                                            className={`py-3 rounded-xl text-xs font-bold transition-all ${duration === t ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vibes */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Pick your vibe (max 3)</label>
                                <div className="flex flex-wrap gap-2">
                                    {vibes.map(v => (
                                        <button 
                                            key={v}
                                            onClick={() => toggleVibe(v)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${selectedVibes.includes(v) ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={selectedVibes.length === 0}
                            className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">Generate Plan 🪄</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </button>
                    </div>
                )}

                {/* --- STATE 2: LOADING --- */}
                {step === 'loading' && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🤖</div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Consulting with AI...</h3>
                        <p className="text-slate-500 text-sm">Finding the best Khachapuri & shortcuts.</p>
                    </div>
                )}

                {/* --- STATE 3: RESULT --- */}
                {step === 'result' && (
                    <div className="flex flex-col h-full bg-[#f8fafc]">
                        <div className="p-6 bg-white border-b border-slate-100 shadow-sm z-10">
                            <h2 className="text-xl font-black text-slate-900 font-serif">Your Adventure</h2>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{duration}</span>
                                {selectedVibes.map(v => (
                                    <span key={v} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{v}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
                            {/* Timeline Line */}
                            <div className="absolute left-[2.25rem] top-6 bottom-6 w-0.5 bg-slate-200"></div>

                            {itinerary.map((item, idx) => (
                                <div key={idx} className="relative pl-12 mb-8 last:mb-0 group animate-slide-left" style={{ animationDelay: `${idx * 100}ms` }}>
                                    {/* Dot */}
                                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-[#f8fafc] flex items-center justify-center text-lg shadow-md z-10 ${item.type === 'eat' ? 'bg-amber-100 text-amber-600' : 'bg-white text-indigo-600'}`}>
                                        {item.icon}
                                    </div>

                                    {/* Card */}
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{item.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{item.description}</p>
                                        
                                        {item.landmarkId && (
                                            <button 
                                                onClick={() => {
                                                    onClose();
                                                    onNavigateToLandmark(item.landmarkId!);
                                                }}
                                                className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span>🗺️</span> View on Map
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 bg-white border-t border-slate-100">
                             <button 
                                onClick={() => setStep('input')}
                                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200"
                             >
                                Start Over
                             </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ItineraryPlanner;
