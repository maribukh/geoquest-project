import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ReviewData } from '../types';

const CommunityReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('isPublic', '==', true),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews: ReviewData[] = [];
        snapshot.forEach((doc) => {
          fetchedReviews.push(doc.data() as ReviewData);
        });
        setReviews(fetchedReviews);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className='flex gap-2 overflow-x-auto pb-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='min-w-[200px] h-32 bg-slate-200 rounded-2xl animate-pulse'
          ></div>
        ))}
      </div>
    );

  if (reviews.length === 0)
    return (
      <div className='text-center py-8 bg-white/50 rounded-3xl border border-dashed border-slate-300'>
        <span className='text-3xl block mb-2 grayscale opacity-50'>🏔️</span>
        <p className='text-slate-400 text-sm font-bold'>
          No stories yet. Be the first!
        </p>
      </div>
    );

  return (
    <div className='grid grid-cols-1 gap-4'>
      {reviews.map((review, index) => (
        <div
          key={index}
          className='group bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300'
        >
          {/* Header */}
          <div className='flex justify-between items-start mb-3'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-lg shadow-inner'>
                {review.avatar || '👤'}
              </div>
              <div>
                <p className='text-sm font-bold text-slate-800 leading-tight'>
                  {review.userName || 'Anonymous'}
                </p>
                <div className='flex items-center gap-1'>
                  <span className='text-[10px] text-slate-400 font-medium'>
                    {review.date}
                  </span>
                  <span className='text-[8px] text-emerald-500 bg-emerald-50 px-1 rounded font-bold'>
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
            <div className='flex bg-amber-50 px-2 py-1 rounded-lg border border-amber-100'>
              <span className='text-xs font-bold text-amber-500 mr-1'>
                {review.rating}.0
              </span>
              <span className='text-xs'>⭐</span>
            </div>
          </div>

          {/* Content Bubble */}
          <div className='relative'>
            <div className='absolute -left-2 top-0 bottom-0 w-1 bg-slate-100 rounded-full'></div>
            <p className='text-slate-600 text-sm leading-relaxed pl-3 italic'>
              "{review.comment}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityReviews;
