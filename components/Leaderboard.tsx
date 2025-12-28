
import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import CommunityReviews from './CommunityReviews';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserPoints: number;
  currentUserAvatar?: string;
}

// LEAGUE DEFINITIONS
const getLeague = (points: number) => {
    if (points >= 2000) return { name: 'King of Kutaisi', icon: '👑', color: 'from-amber-400 to-yellow-600', border: 'border-yellow-400' };
    if (points >= 1000) return { name: 'Local Legend', icon: '🦁', color: 'from-emerald-400 to-teal-600', border: 'border-emerald-400' };
    if (points >= 500) return { name: 'City Scout', icon: '🧭', color: 'from-blue-400 to-indigo-600', border: 'border-blue-400' };
    return { name: 'Backpacker', icon: '🎒', color: 'from-slate-400 to-gray-600', border: 'border-slate-300' };
};

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUserPoints, currentUserAvatar }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');

  // MERGE CURRENT USER & SORT
  const currentUserData: LeaderboardUser = { 
      id: 'current', 
      name: 'You', 
      points: currentUserPoints, 
      avatar: currentUserAvatar || '🤠', 
      isCurrentUser: true,
      flag: '🏳️', // Default flag
      title: 'Explorer',
      badgeIcon: '🚀'
  };

  // Simulate "Weekly" points by just slightly randomizing/reducing the mock data for visual difference
  const displayUsers = [...users, currentUserData].map(u => ({
      ...u,
      displayPoints: timeframe === 'weekly' ? Math.round(u.points * 0.4) : u.points
  })).sort((a, b) => b.displayPoints - a.displayPoints);

  const top3 = displayUsers.slice(0, 3);
  const others = displayUsers.slice(3);
  
  // Find current user's rank after sort
  const myRank = displayUsers.findIndex(u => u.id === 'current') + 1;
  const myLeague = getLeague(currentUserPoints);

  const renderAvatar = (user: any, sizeClass: string) => {
     const league = getLeague(user.points);
     
     return (
        <div className={`relative ${sizeClass}`}>
            {/* Avatar Image */}
            <div className={`w-full h-full rounded-[18px] overflow-hidden border-2 ${league.border} shadow-lg relative z-10 bg-white`}>
                {user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl bg-slate-50">
                        {user.avatar}
                    </div>
                )}
            </div>
            
            {/* Flag Badge */}
            {user.flag && (
                <div className="absolute -bottom-1 -right-1 z-20 w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] shadow-sm border border-slate-100">
                    {user.flag}
                </div>
            )}
        </div>
     );
  };

  return (
    <div className="h-full bg-slate-50 relative overflow-hidden flex flex-col">
       
        {/* --- HEADER --- */}
        <div className="pt-24 pb-6 px-6 bg-white border-b border-slate-100 z-10 sticky top-0 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">Global Rank</h2>
                    <p className="text-xs text-slate-500 font-bold">Compete with travelers worldwide</p>
                </div>
                {/* Current League Badge (Small) */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${myLeague.color} text-white shadow-md`}>
                    <span className="text-sm">{myLeague.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{myLeague.name}</span>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="bg-slate-100 p-1 rounded-xl flex relative">
                <button 
                    onClick={() => setTimeframe('weekly')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10 ${timeframe === 'weekly' ? 'text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                    This Week
                </button>
                <button 
                    onClick={() => setTimeframe('all-time')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10 ${timeframe === 'all-time' ? 'text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                    All Time
                </button>
                {/* Sliding Background */}
                <div className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg transition-transform duration-300 shadow-sm ${timeframe === 'all-time' ? 'translate-x-full' : 'translate-x-0'}`}></div>
            </div>
        </div>

        {/* --- SCROLLABLE LIST --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-6 pb-40">
            
            {/* TOP 3 PODIUM (Modern Cards) */}
            <div className="grid grid-cols-3 gap-3 mb-8 items-end">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center">
                        <div className="mb-2 relative">
                            {renderAvatar(top3[1], 'w-14 h-14')}
                            <div className="absolute -top-3 w-6 h-6 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-sm z-30">2</div>
                        </div>
                        <div className="w-full bg-white rounded-2xl p-3 text-center border-b-4 border-slate-200 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-800 truncate">{top3[1].name}</p>
                            <p className="text-[9px] font-black text-slate-400">{top3[1].displayPoints}</p>
                        </div>
                    </div>
                )}
                
                {/* 1st Place */}
                {top3[0] && (
                    <div className="flex flex-col items-center -mt-6">
                        <div className="mb-2 relative">
                             {renderAvatar(top3[0], 'w-20 h-20')}
                             <div className="absolute -top-4 w-8 h-8 bg-yellow-400 text-yellow-800 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm z-30 animate-bounce">1</div>
                             <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl -z-10"></div>
                        </div>
                        <div className="w-full bg-gradient-to-b from-yellow-50 to-white rounded-2xl p-4 text-center border-b-4 border-yellow-300 shadow-md relative z-10">
                            <p className="text-xs font-black text-slate-900 truncate">{top3[0].name}</p>
                            <p className="text-[10px] font-black text-yellow-600">{top3[0].displayPoints} pts</p>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center">
                        <div className="mb-2 relative">
                            {renderAvatar(top3[2], 'w-14 h-14')}
                            <div className="absolute -top-3 w-6 h-6 bg-orange-300 text-orange-800 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-sm z-30">3</div>
                        </div>
                        <div className="w-full bg-white rounded-2xl p-3 text-center border-b-4 border-orange-200 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-800 truncate">{top3[2].name}</p>
                            <p className="text-[9px] font-black text-slate-400">{top3[2].displayPoints}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* THE REST OF THE LIST */}
            <div className="space-y-3">
                {others.map((user, index) => {
                    const rank = index + 4;
                    const isMe = user.isCurrentUser;

                    return (
                        <div key={user.id} className={`flex items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm ${isMe ? 'ring-2 ring-emerald-400 bg-emerald-50' : ''}`}>
                            <span className="w-8 text-center font-bold text-slate-400 text-sm">{rank}</span>
                            
                            <div className="mr-3 relative">
                                {user.avatar.startsWith('http') ? (
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">{user.avatar}</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{user.name}</h4>
                                    {user.flag && <span className="text-xs">{user.flag}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.badgeIcon && <span className="text-[10px]">{user.badgeIcon}</span>}
                                    <span className="text-[10px] text-slate-500 font-medium truncate">{user.title || 'Traveler'}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="block font-black text-slate-800 text-sm">{user.displayPoints}</span>
                                <span className="text-[8px] font-bold text-amber-500 uppercase">pts</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Community Section (Moved down) */}
            <div className="mt-8 mb-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Traveler Stories</h3>
                 <CommunityReviews />
            </div>

        </div>

        {/* --- STICKY MY RANK BAR --- */}
        {/* Only show if I'm not in the top 3 (visible area) */}
        {!top3.find(u => u.isCurrentUser) && (
            <div className="absolute bottom-24 left-4 right-4 z-20 animate-slide-up">
                <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center border border-white/10">
                    <div className="w-8 text-center font-black text-emerald-400 text-sm">{myRank}</div>
                    
                    <div className="mx-3 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        {currentUserAvatar ? (
                             currentUserAvatar.startsWith('http') ? <img src={currentUserAvatar} className="w-full h-full rounded-xl object-cover" /> : <span className="text-lg">{currentUserAvatar}</span>
                        ) : (
                            <span className="text-lg">🤠</span>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                             <span className="font-bold text-sm">You</span>
                             <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded uppercase font-bold">{myLeague.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Keep exploring to rank up!</p>
                    </div>

                    <div className="text-right">
                         <span className="block font-black text-white">{displayUsers.find(u => u.isCurrentUser)?.displayPoints}</span>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Leaderboard;
