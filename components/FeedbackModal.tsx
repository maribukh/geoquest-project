import React, { useState } from 'react';
import { ReviewData } from '../types';

interface FeedbackModalProps {
  type: 'bug' | 'review';
  onClose: () => void;
  onSubmit: (data: string | ReviewData) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  type,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [tripType, setTripType] = useState('Solo');
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const emotions = [
    { emoji: '😍', label: 'Amazing', color: 'from-pink-500 to-rose-500' },
    { emoji: '😊', label: 'Happy', color: 'from-amber-400 to-orange-500' },
    { emoji: '😌', label: 'Relaxed', color: 'from-emerald-400 to-teal-500' },
    { emoji: '🤩', label: 'Excited', color: 'from-purple-500 to-indigo-600' },
    { emoji: '🤔', label: 'Thoughtful', color: 'from-blue-400 to-cyan-500' },
  ];

  const handleSubmit = () => {
    if (type === 'bug') {
      onSubmit(comment);
    } else {
      const reviewData: ReviewData = {
        rating,
        comment,
        isPublic,
        date: new Date().toLocaleDateString(),
        emotion:
          selectedEmotion !== null
            ? emotions[selectedEmotion].label
            : undefined,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
      };

      onSubmit(reviewData);
    }
    onClose();
  };

  const isReview = type === 'review';

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              setUploadedPhotos((prev) => [...prev, ...newPhotos].slice(0, 3));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='fixed inset-0 z-[5000] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-xl transition-opacity duration-500'
        onClick={onClose}
      />

      <div className='relative w-full max-w-md bg-gradient-to-b from-white to-slate-50 rounded-3xl overflow-hidden shadow-2xl transform transition-all scale-100 animate-scale-in'>
        <div className='absolute inset-0 overflow-hidden'>
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 ${
              isReview
                ? 'bg-gradient-to-br from-indigo-300/20 to-purple-300/10'
                : 'bg-slate-300/10'
            } rounded-full blur-2xl animate-spin-slow`}
          />
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 ${
              isReview
                ? 'bg-gradient-to-br from-pink-300/20 to-rose-300/10'
                : 'bg-slate-400/10'
            } rounded-full blur-2xl animate-spin-slow-reverse`}
          />
        </div>

        <div className='relative bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm border-b border-white/40'>
          <div className='flex items-center justify-between p-6'>
            <div className='flex items-center gap-3'>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                  isReview
                    ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                }`}
              >
                {isReview ? '✈️' : '🔧'}
              </div>
              <div>
                <h2 className='text-xl font-bold text-slate-900'>
                  {isReview ? 'Share Your Journey' : 'Report an Issue'}
                </h2>
                <p className='text-xs text-slate-500 font-medium'>
                  {isReview ? 'Capture your memories' : 'Help us improve'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-90'
            >
              ✕
            </button>
          </div>
        </div>

        <div className='relative px-6 py-8 max-h-[80vh] overflow-y-auto custom-scrollbar'>
          {isReview ? (
            <div className='space-y-6'>
              <div className='text-center'>
                <h3 className='text-sm font-bold text-slate-700 mb-3'>
                  How was your experience?
                </h3>
                <div className='flex justify-center gap-2'>
                  {emotions.map((emotion, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedEmotion(index)}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                        selectedEmotion === index
                          ? 'scale-110 ring-2 ring-offset-2'
                          : 'hover:scale-105'
                      } ${
                        selectedEmotion === index
                          ? `ring-indigo-400 bg-gradient-to-br ${emotion.color} text-white`
                          : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className='text-2xl mb-1'>{emotion.emoji}</span>
                      <span className='text-[10px] font-bold uppercase tracking-wider'>
                        {emotion.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='text-center'>
                <h3 className='text-sm font-bold text-slate-700 mb-3'>
                  Travel Style
                </h3>
                <div className='flex gap-2 overflow-x-auto pb-2 no-scrollbar'>
                  {[
                    'Solo Adventure',
                    'Couple Trip',
                    'Family Time',
                    'Friends Getaway',
                    'Business',
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTripType(type)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        tripType === type
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-slate-700 mb-3'>
                  Add Photos (Optional)
                </h3>
                <div className='flex gap-3'>
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className='relative w-20 h-20'>
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className='w-full h-full object-cover rounded-xl border-2 border-white shadow'
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors'
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {uploadedPhotos.length < 3 && (
                    <label className='cursor-pointer group'>
                      <div className='w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors bg-slate-50/50'>
                        <span className='text-2xl mb-1'>📸</span>
                        <span className='text-[10px] font-bold'>Add</span>
                      </div>
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handlePhotoUpload}
                        className='hidden'
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className='text-center'>
                <h3 className='text-sm font-bold text-slate-700 mb-3'>
                  Overall Rating
                </h3>
                <div className='flex justify-center gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all duration-300 transform hover:scale-125 active:scale-95 ${
                        rating >= star
                          ? 'grayscale-0 drop-shadow-lg scale-110'
                          : 'grayscale opacity-40 hover:opacity-60'
                      }`}
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center mb-6'>
              <div className='w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl text-slate-600'>
                🐛
              </div>
              <h3 className='text-lg font-bold text-slate-800 mb-2'>
                Found a Bug?
              </h3>
              <p className='text-slate-600 text-sm'>
                Help us squash it! Describe what happened.
              </p>
            </div>
          )}

          <div className='mb-6 mt-6'>
            <textarea
              className='w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all resize-none font-medium text-slate-800 placeholder:text-slate-400 shadow-sm'
              rows={isReview ? 4 : 5}
              placeholder={
                isReview
                  ? 'Tell us about your favorite moment... What made this trip special?'
                  : 'Describe what happened, steps to reproduce, and any error messages...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div className='flex justify-between items-center mt-2 px-1'>
              <span className='text-[10px] text-slate-400 font-medium'>
                {isReview
                  ? 'Your story will inspire others ✨'
                  : 'Be as detailed as possible'}
              </span>
              <span
                className={`text-xs font-bold ${
                  comment.length > 450 ? 'text-amber-600' : 'text-slate-400'
                }`}
              >
                {comment.length}/500
              </span>
            </div>
          </div>

          {isReview && (
            <div className='flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPublic
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPublic ? '🌍' : '🔒'}
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold text-slate-800'>
                    {isPublic ? 'Public Story' : 'Private Note'}
                  </span>
                  <span className='text-xs text-slate-500'>
                    {isPublic ? 'Share with community' : 'Keep for yourself'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                  isPublic ? 'bg-indigo-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    isPublic ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl transform transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isReview
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/40'
                : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:shadow-2xl hover:shadow-slate-900/40'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              {isReview ? (
                <>
                  <span>📤</span>
                  <span>Publish Your Story</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Send Report</span>
                </>
              )}
            </div>
          </button>

          {isReview && (
            <p className='text-center text-xs text-slate-400 mt-3 font-medium'>
              Your review helps other explorers discover amazing places
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
