import React, { useState } from 'react';
import { Coupon, UserState } from '../types';
import { REWARDS } from '../constants';

interface ShopProps {
  userState: UserState;
  onPurchase: (coupon: Coupon) => void;
  onOpenMysteryBox: () => void;
  isOpeningBox: boolean;
  lootBoxMessage: string | null;
}

const Shop: React.FC<ShopProps> = ({
  userState,
  onPurchase,
  onOpenMysteryBox,
  isOpeningBox,
  lootBoxMessage,
}) => {
  const [filter, setFilter] = useState<'all' | 'digital' | 'secret' | 'status'>(
    'all'
  );

  const filteredRewards =
    filter === 'all' ? REWARDS : REWARDS.filter((r) => r.category === filter);

  return (
    <div className='h-full bg-slate-50 relative flex flex-col'>
      {/* Sticky Header with Balance */}
      <div className='bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm'>
        <div>
          <h2 className='text-xl font-black text-slate-900 font-serif tracking-tight'>
            Gift Shop
          </h2>
          <p className='text-xs text-slate-500 font-medium'>Spend your coins</p>
        </div>
        <div className='flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100'>
          <div className='w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs shadow-sm'>
            🪙
          </div>
          <span className='font-black text-slate-800'>{userState.points}</span>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-4 pb-32'>
        {/* Mystery Box Hero Section */}
        <div className='mt-4 mb-8'>
          <div
            className='relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-700 shadow-xl shadow-indigo-500/20 group cursor-pointer'
            onClick={() =>
              !isOpeningBox && userState.points >= 100 && onOpenMysteryBox()
            }
          >
            {/* Animated Background */}
            <div className='absolute inset-0 opacity-20'>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
            </div>

            <div className='relative p-6 flex flex-col items-center text-center z-10'>
              <div className='mb-2 text-6xl drop-shadow-2xl transform transition-transform group-hover:scale-110 duration-300'>
                🎁
              </div>
              <h3 className='text-2xl font-black text-white mb-1'>
                Mystery Chest
              </h3>
              <p className='text-indigo-100 text-xs font-medium mb-4 max-w-[200px]'>
                Contains random amount of coins (0 - 500). Try your luck!
              </p>

              <button
                disabled={isOpeningBox || userState.points < 100}
                className='bg-white text-indigo-700 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[180px]'
              >
                {isOpeningBox ? 'Opening...' : 'Open for 100 🪙'}
              </button>
            </div>

            {/* Loot Message Overlay */}
            {lootBoxMessage && (
              <div className='absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex items-center justify-center p-6 text-center animate-fadeIn'>
                <div>
                  <div className='text-4xl mb-2'>🎉</div>
                  <p className='text-slate-900 font-bold text-lg'>
                    {lootBoxMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className='flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2'>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'status', label: 'Badges' },
            { id: 'secret', label: 'Secrets' },
            { id: 'digital', label: 'Souvenirs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Items */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {filteredRewards.map((item) => {
            const isOwned = userState.redeemedCoupons.includes(item.id);
            const canAfford = userState.points >= item.cost;

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-3xl p-5 border transition-all duration-300 ${
                  isOwned
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                }`}
              >
                <div className='flex justify-between items-start mb-4'>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                      isOwned
                        ? 'bg-white'
                        : `bg-gradient-to-br ${item.color} text-white`
                    }`}
                  >
                    {item.icon}
                  </div>
                  {isOwned ? (
                    <span className='bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide'>
                      Owned
                    </span>
                  ) : (
                    <div className='flex flex-col items-end'>
                      <span
                        className={`text-lg font-black ${
                          canAfford ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {item.cost}
                      </span>
                      <span className='text-[9px] font-bold text-slate-400 uppercase'>
                        Coins
                      </span>
                    </div>
                  )}
                </div>

                <h3 className='font-bold text-slate-900 leading-tight mb-1'>
                  {item.title}
                </h3>
                <p className='text-xs text-slate-500 leading-relaxed mb-4 min-h-[32px] line-clamp-2'>
                  {item.description}
                </p>

                <button
                  onClick={() => onPurchase(item)}
                  disabled={isOwned || !canAfford}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 ${
                    isOwned
                      ? 'bg-transparent text-emerald-600 border border-emerald-200 cursor-default'
                      : canAfford
                      ? 'bg-slate-900 text-white shadow-lg hover:bg-black'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isOwned
                    ? 'In Inventory'
                    : canAfford
                    ? 'Purchase'
                    : 'Need more coins'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
