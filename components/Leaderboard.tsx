import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import CommunityReviews from './CommunityReviews';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserPoints: number;
  currentUserAvatar?: string;
}

interface ProcessedUser extends LeaderboardUser {
  displayPoints: number;
  league: (typeof LEAGUE_DEFINITIONS)[0];
}

const LeagueIcons = {
  crown: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z' />
      <path d='M5 16v3h14v-3H5z' />
    </svg>
  ),
  lion: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 2C8.7 2 6 4.7 6 8c0 1.9 1 3.6 2.5 4.5-1.1 1.2-1.8 2.8-1.8 4.5v3h10v-3c0-1.7-.7-3.3-1.8-4.5C17 11.6 18 9.9 18 8c0-3.3-2.7-6-6-6z' />
      <circle cx='9' cy='8' r='1' />
      <circle cx='15' cy='8' r='1' />
      <path d='M12 18v3' />
    </svg>
  ),
  compass: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
      <path d='M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z' />
      <path d='M12 8v8M8 12h8' stroke='currentColor' strokeWidth='1' />
    </svg>
  ),
  backpack: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <path
        d='M6 20v-8a6 6 0 0112 0v8'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
      <path d='M18 20H6' stroke='currentColor' strokeWidth='2' />
      <path d='M9 11v3M15 11v3' stroke='currentColor' strokeWidth='1.5' />
      <rect x='8' y='4' width='8' height='4' rx='1' fill='currentColor' />
    </svg>
  ),
  rocket: (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M13.11 11.63L5 19.74V22h2.26l8.11-8.11M16 10l5-5-3-3-5 5-1 4 4 1z' />
      <path d='M19 15l-2 6 6-2 1-4-4 1z' />
      <circle cx='7.5' cy='7.5' r='0.5' fill='currentColor' />
    </svg>
  ),
  star: (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
    </svg>
  ),
  trophy: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M6 3v2c0 2.8 2.2 5 5 5h2c2.8 0 5-2.2 5-5V3H6z' />
      <path d='M8 21h8v-6c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6z' />
      <path d='M12 13v8M8 5h8' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  medal: (
    <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
      <circle
        cx='12'
        cy='8'
        r='6'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
      <path d='M12 14v8M8 18l2 2 4-4' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  ),
  flag: (
    <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' />
      <line
        x1='4'
        y1='22'
        x2='4'
        y2='15'
        stroke='currentColor'
        strokeWidth='2'
      />
    </svg>
  ),
  flame: (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 001.5 4.5z' />
    </svg>
  ),
  target: (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
      <circle
        cx='12'
        cy='12'
        r='6'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
      <circle cx='12' cy='12' r='2' fill='currentColor' />
    </svg>
  ),
  shield: (
    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
    </svg>
  ),
};

const LEAGUE_DEFINITIONS = [
  {
    threshold: 2000,
    name: 'King of Kutaisi',
    icon: LeagueIcons.crown,
    color: 'from-amber-400 to-yellow-600 via-orange-500',
    border: 'border-yellow-400',
    bg: 'bg-gradient-to-br from-amber-500/10 to-yellow-600/5',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
  },
  {
    threshold: 1000,
    name: 'Local Legend',
    icon: LeagueIcons.lion,
    color: 'from-emerald-400 to-teal-600 via-green-500',
    border: 'border-emerald-400',
    bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/5',
    glow: 'shadow-[0_0_25px_rgba(52,211,153,0.25)]',
  },
  {
    threshold: 500,
    name: 'City Scout',
    icon: LeagueIcons.compass,
    color: 'from-blue-400 to-indigo-600 via-purple-500',
    border: 'border-blue-400',
    bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-600/5',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]',
  },
  {
    threshold: 0,
    name: 'Backpacker',
    icon: LeagueIcons.backpack,
    color: 'from-slate-400 to-gray-600 via-slate-500',
    border: 'border-slate-300',
    bg: 'bg-gradient-to-br from-slate-500/10 to-gray-600/5',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.15)]',
  },
];

const BADGE_ICONS: Record<string, React.ReactNode> = {
  '🚀': LeagueIcons.rocket,
  '⭐': LeagueIcons.star,
  '🏆': LeagueIcons.trophy,
  '🎯': LeagueIcons.target,
  '🛡️': LeagueIcons.shield,
  '🔥': LeagueIcons.flame,
  '🏅': LeagueIcons.medal,
};

const getLeague = (points: number) => {
  return (
    LEAGUE_DEFINITIONS.find((league) => points >= league.threshold) ||
    LEAGUE_DEFINITIONS[3]
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserPoints,
  currentUserAvatar,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');

  const processUsers = (): ProcessedUser[] => {
    const allUsers: ProcessedUser[] = users.map((user) => ({
      ...user,
      displayPoints:
        timeframe === 'weekly' ? Math.round(user.points * 0.4) : user.points,
      league: getLeague(user.points),
    }));

    const currentUserData: ProcessedUser = {
      id: 'current',
      name: 'You',
      points: currentUserPoints,
      avatar: currentUserAvatar || '',
      isCurrentUser: true,
      flag: '🇬🇪',
      title: 'Explorer',
      badgeIcon: '🚀',
      displayPoints:
        timeframe === 'weekly'
          ? Math.round(currentUserPoints * 0.4)
          : currentUserPoints,
      league: getLeague(currentUserPoints),
    };

    return [...allUsers, currentUserData].sort(
      (a, b) => b.displayPoints - a.displayPoints
    );
  };

  const displayUsers = processUsers();
  const top3 = displayUsers.slice(0, 3);
  const others = displayUsers.slice(3);
  const myRank = displayUsers.findIndex((u) => u.id === 'current') + 1;
  const myLeague = getLeague(currentUserPoints);
  const isUserInTop3 = top3.some((u) => u.isCurrentUser);

  const UserAvatar: React.FC<{
    user: ProcessedUser;
    size?: 'small' | 'medium' | 'large' | 'xl';
    showFlag?: boolean;
    className?: string;
  }> = ({ user, size = 'medium', showFlag = true, className = '' }) => {
    const sizeClasses = {
      small: 'w-8 h-8 md:w-10 md:h-10',
      medium: 'w-12 h-12 md:w-14 md:h-14',
      large: 'w-16 h-16 md:w-20 md:h-20',
      xl: 'w-20 h-20 md:w-24 md:h-24',
    };

    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div
          className={`w-full h-full rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-3 ${user.league.border} shadow-md md:shadow-lg relative z-10 bg-gradient-to-br from-white to-slate-50 ${user.league.glow}`}
        >
          {user.avatar ? (
            user.avatar.startsWith('http') ? (
              <img
                src={user.avatar}
                alt={user.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-lg md:text-xl'>
                {user.avatar}
              </div>
            )
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200'>
              <div className='w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center'>
                <span className='text-sm md:text-lg font-bold text-white'>
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {showFlag && user.flag && (
          <div className='absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 z-20 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center shadow-sm md:shadow-lg border border-slate-200 md:border-2'>
            <div className='text-[8px] md:text-xs font-bold text-slate-700'>
              {user.flag}
            </div>
          </div>
        )}

        {user.badgeIcon && BADGE_ICONS[user.badgeIcon] && (
          <div className='absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm md:shadow-lg'>
            {BADGE_ICONS[user.badgeIcon]}
          </div>
        )}
      </div>
    );
  };

  const PodiumCard: React.FC<{ user: ProcessedUser; position: 1 | 2 | 3 }> = ({
    user,
    position,
  }) => {
    const positionConfig = {
      1: {
        rankClass:
          'w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white shadow-lg',
        containerClass: '-mt-4 md:-mt-8',
        cardClass:
          'bg-gradient-to-b from-white via-yellow-50/50 to-amber-50/30 border-yellow-300/50',
        textClass: 'text-amber-600',
        pointsSize: 'text-base md:text-lg',
        rankSize: 'text-sm md:text-base',
        glow: 'shadow-[0_10px_25px_rgba(251,191,36,0.3)] md:shadow-[0_20px_50px_rgba(251,191,36,0.4)]',
        badge: LeagueIcons.crown,
      },
      2: {
        rankClass:
          'w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white shadow-md',
        containerClass: '',
        cardClass:
          'bg-gradient-to-b from-white to-slate-50/50 border-slate-200',
        textClass: 'text-slate-600',
        pointsSize: 'text-sm md:text-md',
        rankSize: 'text-xs md:text-sm',
        glow: 'shadow-[0_5px_15px_rgba(148,163,184,0.2)] md:shadow-[0_10px_30px_rgba(148,163,184,0.2)]',
        badge: LeagueIcons.medal,
      },
      3: {
        rankClass:
          'w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-white shadow-md',
        containerClass: '',
        cardClass:
          'bg-gradient-to-b from-white to-orange-50/50 border-orange-200',
        textClass: 'text-orange-600',
        pointsSize: 'text-sm md:text-md',
        rankSize: 'text-xs md:text-sm',
        glow: 'shadow-[0_5px_15px_rgba(251,146,60,0.2)] md:shadow-[0_10px_30px_rgba(251,146,60,0.2)]',
        badge: LeagueIcons.star,
      },
    };

    const config = positionConfig[position];

    return (
      <div className={`flex flex-col items-center ${config.containerClass}`}>
        <div className='mb-2 md:mb-3 relative'>
          <UserAvatar user={user} size={position === 1 ? 'xl' : 'large'} />
          <div
            className={`absolute -top-2 -left-2 md:-top-3 md:-left-3 rounded-full flex items-center justify-center font-black border-2 md:border-3 border-white z-30 ${config.rankClass} animate-pulse`}
          >
            {config.badge}
          </div>
          {position === 1 && (
            <div className='absolute -inset-2 md:-inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl md:blur-2xl -z-10 animate-pulse' />
          )}
        </div>

        <div
          className={`w-full rounded-xl md:rounded-2xl p-3 md:p-4 text-center border md:border-2 backdrop-blur-sm ${config.glow} ${config.cardClass}`}
        >
          <div className='flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2'>
            <div className='w-3 h-3 md:w-4 md:h-4'>{user.league.icon}</div>
            <span className='text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider truncate'>
              {user.league.name}
            </span>
          </div>
          <p className='font-bold md:font-black text-slate-900 truncate text-xs md:text-sm mb-1'>
            {user.name}
          </p>
          <p
            className={`font-bold md:font-black ${config.textClass} ${config.pointsSize}`}
          >
            {user.displayPoints.toLocaleString()}
          </p>
          <div className='text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 md:mt-1'>
            points
          </div>
        </div>
      </div>
    );
  };

  const UserCard: React.FC<{ user: ProcessedUser; rank: number }> = ({
    user,
    rank,
  }) => {
    const isCurrentUser = user.isCurrentUser;

    return (
      <div
        className={`group flex items-center p-2 md:p-4 rounded-lg md:rounded-2xl transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] ${
          isCurrentUser
            ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/50 ring-2 md:ring-3 ring-emerald-400/30 shadow-md md:shadow-lg shadow-emerald-500/20'
            : 'bg-white/80 md:hover:bg-white border border-slate-200/50 md:hover:border-slate-300 md:hover:shadow-xl'
        } backdrop-blur-sm`}
      >
        <div
          className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-sm md:text-lg mr-2 md:mr-4 ${
            rank <= 3
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm md:shadow-md'
              : isCurrentUser
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'
          }`}
        >
          {rank}
        </div>

        <div className='flex-1 flex items-center gap-2 md:gap-4 overflow-hidden'>
          <UserAvatar
            user={user}
            size='small'
            showFlag={false}
            className='flex-shrink-0'
          />

          <div className='flex-1 min-w-0 overflow-hidden'>
            <div className='flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1'>
              <h4
                className={`font-semibold md:font-bold truncate text-xs md:text-sm ${
                  isCurrentUser ? 'text-slate-900' : 'text-slate-800'
                }`}
              >
                {user.name}
              </h4>
              {user.flag && (
                <div className='text-[10px] md:text-xs font-bold bg-slate-100 px-1 md:px-1.5 py-0.5 rounded'>
                  {user.flag}
                </div>
              )}
            </div>
            <div className='flex items-center gap-1 md:gap-2'>
              <div
                className={`w-3 h-3 md:w-4 md:h-4 ${
                  isCurrentUser ? 'text-emerald-500' : 'text-slate-400'
                }`}
              >
                {user.league.icon}
              </div>
              <span
                className={`text-[10px] md:text-xs font-medium truncate ${
                  isCurrentUser ? 'text-slate-600' : 'text-slate-500'
                }`}
              >
                {user.league.name}
              </span>
            </div>
          </div>
        </div>

        <div className='text-right ml-2 md:ml-4'>
          <div
            className={`font-bold md:font-black ${
              isCurrentUser
                ? 'text-slate-900 text-sm md:text-xl'
                : 'text-slate-800 text-xs md:text-lg'
            }`}
          >
            {user.displayPoints.toLocaleString()}
          </div>
          <div className='text-[6px] md:text-[10px] font-bold text-amber-500 uppercase tracking-wider'>
            pts
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='h-full bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col'>
      <div className='pt-16 md:pt-20 pb-4 md:pb-6 px-4 md:px-6 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-lg border-b border-slate-200/30 sticky top-0 z-20'>
        <div className='flex justify-between items-start md:items-center mb-4 md:mb-6'>
          <div className='flex-1'>
            <h1 className='text-xl md:text-2xl font-black text-slate-900 tracking-tight'>
              Global Rank
            </h1>
            <p className='text-xs md:text-sm text-slate-500 font-medium mt-0.5 md:mt-1'>
              Compete with travelers worldwide
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r ${myLeague.color} text-white shadow-lg md:shadow-xl ml-2`}
          >
            <div className='w-4 h-4 md:w-6 md:h-6'>{myLeague.icon}</div>
            <span className='text-xs md:text-sm font-bold uppercase tracking-wider hidden md:inline'>
              {myLeague.name}
            </span>
          </div>
        </div>

        <div className='flex gap-2 mb-4 md:mb-6'>
          {(['global', 'friends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md md:shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 text-slate-600 active:bg-white active:shadow-sm border border-slate-200'
              }`}
            >
              {tab === 'global' ? '🌍 Global' : '👥 Friends'}
            </button>
          ))}
        </div>

        <div className='bg-slate-100/80 p-1 md:p-1.5 rounded-lg md:rounded-2xl flex relative backdrop-blur-sm border border-slate-200/50'>
          {(['weekly', 'all-time'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`flex-1 py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-bold rounded-lg md:rounded-xl transition-all duration-300 relative z-10 ${
                timeframe === tab
                  ? 'text-slate-900'
                  : 'text-slate-500 active:text-slate-700'
              }`}
            >
              {tab === 'weekly' ? 'Week' : 'All Time'}
            </button>
          ))}
          <div
            className={`absolute top-1 bottom-1 md:top-1.5 md:bottom-1.5 w-1/2 bg-white rounded-lg md:rounded-xl transition-transform duration-500 shadow-sm md:shadow-md ${
              timeframe === 'all-time' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto scroll-smooth px-3 md:px-4 pt-4 md:pt-6 pb-32 md:pb-40'>
        {activeTab === 'global' && (
          <>
            <div className='grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-12 items-end px-1 md:px-2'>
              {top3[1] && <PodiumCard user={top3[1]} position={2} />}
              {top3[0] && <PodiumCard user={top3[0]} position={1} />}
              {top3[2] && <PodiumCard user={top3[2]} position={3} />}
            </div>

            <div className='space-y-2 md:space-y-3 mb-8 md:mb-10'>
              {others.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 4} />
              ))}
            </div>

            <div className='mb-6'>
              <div className='flex items-center justify-between mb-4 md:mb-6 px-1 md:px-2'>
                <h2 className='text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 md:gap-2'>
                  <div className='w-4 h-4 md:w-5 md:h-5 text-slate-400'>
                    {LeagueIcons.star}
                  </div>
                  <span className='hidden md:inline'>Traveler Stories</span>
                  <span className='md:hidden'>Stories</span>
                </h2>
                <div className='text-xs text-slate-400 font-medium bg-slate-100/50 px-2 py-1 md:px-3 md:py-1.5 rounded'>
                  Recent
                </div>
              </div>
              <CommunityReviews />
            </div>
          </>
        )}

        {activeTab === 'friends' && (
          <div className='py-8 md:py-10 text-center px-4'>
            <div className='w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center'>
              <div className='w-8 h-8 md:w-12 md:h-12 text-blue-400'>
                {LeagueIcons.compass}
              </div>
            </div>
            <h3 className='text-base md:text-lg font-bold text-slate-800 mb-2'>
              Coming Soon!
            </h3>
            <p className='text-xs md:text-sm text-slate-500'>
              Challenge your friends
            </p>
          </div>
        )}
      </div>

      {!isUserInTop3 && (
        <div className='fixed bottom-4 md:bottom-6 left-4 right-4 md:left-1/2 md:transform md:-translate-x-1/2 z-30 md:w-[95%] md:max-w-md'>
          <div className='bg-gradient-to-r from-slate-900/95 to-slate-800/95 text-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl flex items-center border border-white/10 backdrop-blur-xl'>
            <div
              className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-black text-base md:text-xl mr-2 md:mr-4 ${
                myRank <= 10
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              } shadow-md md:shadow-lg`}
            >
              {myRank}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1'>
                <span className='font-bold text-white text-xs md:text-sm truncate'>
                  Your Rank
                </span>
                <div className='flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1 bg-emerald-500/20 rounded-full flex-shrink-0'>
                  <div className='w-2 h-2 md:w-3 md:h-3 text-emerald-300'>
                    {myLeague.icon}
                  </div>
                  <span className='text-[10px] md:text-xs font-bold text-emerald-300 uppercase tracking-wider truncate max-w-[60px] md:max-w-none'>
                    {myLeague.name}
                  </span>
                </div>
              </div>
              <p className='text-[10px] md:text-xs text-slate-300/80 truncate'>
                Keep exploring to reach the top!
              </p>
            </div>

            <div className='text-right ml-2'>
              <div className='font-bold md:font-black text-white text-base md:text-xl'>
                {currentUserPoints.toLocaleString()}
              </div>
              <div className='text-[8px] md:text-xs text-emerald-300/80 font-bold tracking-wider'>
                Score
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-10' />
    </div>
  );
};

export default Leaderboard;
