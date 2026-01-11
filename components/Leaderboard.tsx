import React, { useState, useEffect } from 'react';
import { LeaderboardUser } from '../types';
import CommunityReviews from './CommunityReviews';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

interface LeaderboardProps {
  users: LeaderboardUser[]; // Kept for prop compatibility
  currentUserPoints: number;
  currentUserAvatar?: string;
}

interface ProcessedUser extends LeaderboardUser {
  displayPoints: number;
  rank: number;
}

const UserAvatar: React.FC<{
  user: ProcessedUser;
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  borderColor?: string;
}> = ({
  user,
  size = 'medium',
  className = '',
  borderColor = 'border-white',
}) => {
  const sizeClasses = {
    small: 'w-10 h-10 text-base',
    medium: 'w-12 h-12 text-lg',
    large: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`w-full h-full rounded-full overflow-hidden border-[3px] ${borderColor} shadow-lg relative z-10 bg-slate-200`}
      >
        {user.avatar ? (
          user.avatar.startsWith('http') ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-white'>
              {user.avatar}
            </div>
          )
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400'>
            <span className='font-bold text-white'>{user.name.charAt(0)}</span>
          </div>
        )}
      </div>
      {user.flag && (
        <div className='absolute -bottom-1 -right-1 z-20 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[10px]'>
          {user.flag}
        </div>
      )}
    </div>
  );
};

const Podium: React.FC<{ top3: ProcessedUser[] }> = ({ top3 }) => {
  const [first, second, third] = [
    top3.find((u) => u.rank === 1),
    top3.find((u) => u.rank === 2),
    top3.find((u) => u.rank === 3),
  ];

  return (
    <div className='flex justify-center items-end gap-2 sm:gap-4 mb-8 pt-4 px-4'>
      {/* 2nd Place */}
      <div className='flex flex-col items-center w-1/3 max-w-[100px]'>
        {second && (
          <>
            <div className='mb-2 relative'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm'>
                #2
              </div>
              <UserAvatar
                user={second}
                size='large'
                borderColor='border-slate-300'
              />
            </div>
            <div className='w-full bg-gradient-to-b from-slate-200/50 to-slate-50/50 rounded-t-2xl p-2 pb-4 text-center border-t border-white/50 backdrop-blur-sm h-24 flex flex-col justify-start pt-3'>
              <p className='text-xs font-bold text-slate-800 truncate w-full'>
                {second.name}
              </p>
              <p className='text-[10px] font-bold text-slate-500'>
                {second.displayPoints}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 1st Place */}
      <div className='flex flex-col items-center w-1/3 max-w-[110px] -mx-2 z-10'>
        {first && (
          <>
            <div className='mb-3 relative'>
              <div className='absolute -top-6 left-1/2 -translate-x-1/2 text-3xl drop-shadow-md animate-bounce-slow'>
                👑
              </div>
              <UserAvatar
                user={first}
                size='xl'
                borderColor='border-yellow-400'
                className='shadow-yellow-400/30 shadow-xl'
              />
            </div>
            <div className='w-full bg-gradient-to-b from-yellow-100/60 to-amber-50/60 rounded-t-2xl p-2 pb-4 text-center border-t border-white/60 backdrop-blur-md h-32 flex flex-col justify-start pt-4 shadow-lg'>
              <p className='text-sm font-black text-slate-900 truncate w-full'>
                {first.name}
              </p>
              <p className='text-xs font-bold text-amber-600'>
                {first.displayPoints} pts
              </p>
            </div>
          </>
        )}
      </div>

      {/* 3rd Place */}
      <div className='flex flex-col items-center w-1/3 max-w-[100px]'>
        {third && (
          <>
            <div className='mb-2 relative'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm'>
                #3
              </div>
              <UserAvatar
                user={third}
                size='large'
                borderColor='border-orange-300'
              />
            </div>
            <div className='w-full bg-gradient-to-b from-orange-100/40 to-orange-50/40 rounded-t-2xl p-2 pb-4 text-center border-t border-white/50 backdrop-blur-sm h-20 flex flex-col justify-start pt-3'>
              <p className='text-xs font-bold text-slate-800 truncate w-full'>
                {third.name}
              </p>
              <p className='text-[10px] font-bold text-slate-500'>
                {third.displayPoints}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserPoints,
  currentUserAvatar,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');
  const [realUsers, setRealUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers: LeaderboardUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedUsers.push({
          id: doc.id,
          name: data.displayName || 'Anonymous',
          points: data.points || 0,
          avatar: data.photoURL || '',
          flag: '🇬🇪', // Can be customized later if we add country to profile
        });
      });
      setRealUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const processedUsers: ProcessedUser[] = realUsers.map((u, index) => ({
    ...u,
    displayPoints: u.points,
    rank: index + 1,
  }));

  const top3 = processedUsers.slice(0, 3);
  const rest = processedUsers.slice(3);

  // Mock calculation for current user if they aren't in the fetched top list
  // In a real app, you'd fetch the specific user rank from backend function
  const myRank = processedUsers.findIndex(
    (u) => u.points === currentUserPoints
  ); // Simplistic matching
  const myDisplayRank = myRank !== -1 ? myRank + 1 : '99+';

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full bg-slate-50'>
        <div className='animate-spin text-4xl text-emerald-500'>⏳</div>
      </div>
    );
  }

  return (
    <div className='h-full bg-[#f8fafc] flex flex-col relative'>
      {/* --- HEADER --- */}
      <div className='px-6 pt-6 pb-2 bg-white sticky top-0 z-20 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
            Leaderboard
          </h1>
          <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
            🏆
          </div>
        </div>

        {/* Custom Tabs */}
        <div className='bg-slate-100 p-1 rounded-xl flex relative mb-2'>
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-spring ${
              timeframe === 'all-time' ? 'translate-x-full left-1' : 'left-1'
            }`}
          />
          <button
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${
              timeframe === 'weekly' ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('all-time')}
            className={`flex-1 py-2 text-xs font-bold z-10 transition-colors ${
              timeframe === 'all-time' ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className='flex-1 overflow-y-auto pb-32 no-scrollbar'>
        {/* Podium Section */}
        <div className='bg-white rounded-b-[40px] shadow-sm mb-6 border-b border-slate-100'>
          <Podium top3={top3} />
        </div>

        {/* The List */}
        <div className='px-4 space-y-3'>
          {rest.map((user) => (
            <div
              key={user.id}
              className='flex items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100'
            >
              <span className='w-8 text-center text-slate-400 font-bold text-sm font-mono'>
                #{user.rank}
              </span>
              <UserAvatar user={user} size='small' className='mx-3' />
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-bold text-slate-800 truncate'>
                  {user.name}
                </h4>
                <p className='text-[10px] text-slate-400 font-medium'>
                  Explorer
                </p>
              </div>
              <div className='bg-slate-50 px-3 py-1 rounded-lg'>
                <span className='text-sm font-black text-slate-700'>
                  {user.displayPoints}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stories Teaser */}
        <div className='mt-8 px-6'>
          <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest mb-4'>
            Community Stories
          </h3>
          <CommunityReviews />
        </div>
      </div>

      {/* --- STICKY USER STATS (If viewing map/other tabs, this might be hidden, but good for Leaderboard view) --- */}
      <div className='absolute bottom-24 left-4 right-4 z-30'>
        <div className='bg-slate-900 text-white p-3 rounded-2xl shadow-2xl shadow-slate-900/30 flex items-center justify-between border border-white/10 backdrop-blur-xl'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden bg-slate-800'>
              {currentUserAvatar ? (
                <img
                  src={currentUserAvatar}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='flex items-center justify-center h-full'>
                  👤
                </div>
              )}
            </div>
            <div>
              <p className='text-xs text-slate-400 font-bold uppercase'>
                My Rank
              </p>
              <p className='text-lg font-black leading-none'>
                #{myDisplayRank}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xs text-slate-400 font-bold uppercase'>Points</p>
            <p className='text-lg font-black leading-none text-emerald-400'>
              {currentUserPoints}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .ease-spring {
            transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
