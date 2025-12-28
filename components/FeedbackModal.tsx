
import React, { useState } from 'react';
import { ReviewData } from '../types';

interface FeedbackModalProps {
  type: 'bug' | 'review';
  onClose: () => void;
  onSubmit: (data: string | ReviewData) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ type, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [tripType, setTripType] = useState('Solo'); // New field for context

  const handleSubmit = () => {
    if (type === 'bug') {
      onSubmit(comment);
    } else {
      onSubmit({
        rating,
        comment,
        isPublic,
        date: new Date().toLocaleDateString(),
        // tripType can be added to ReviewData interface in the future
      });
    }
    onClose();
  };

  const isReview = type === 'review';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl relative transform transition-all scale-100 animate-fade-in-up">
        
        {/* Decorative Header Background */}
        <div className={`h-32 w-full absolute top-0 left-0 right-0 ${isReview ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>
        </div>

        <div className="relative pt-8 px-6 pb-6">
            
            {/* Icon & Title */}
            <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-white transform -rotate-3 ${isReview ? 'bg-white text-purple-500' : 'bg-slate-800 text-white'}`}>
                    {isReview ? '✈️' : '🔧'}
                </div>
                <h2 className={`text-2xl font-black tracking-tight ${isReview ? 'text-slate-900' : 'text-slate-800'}`}>
                    {isReview ? 'Journey Log' : 'System Report'}
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    {isReview ? 'Share your memories before you fly!' : 'Help us fix the matrix.'}
                </p>
            </div>

            {/* Review Specifics */}
            {isReview && (
                <div className="space-y-6 mb-6">
                    {/* Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-4xl transition-all duration-200 focus:outline-none transform hover:scale-110 active:scale-90 ${rating >= star ? 'grayscale-0 drop-shadow-md' : 'grayscale opacity-20'}`}
                        >
                            ⭐
                        </button>
                        ))}
                    </div>

                    {/* Trip Type Chips */}
                    <div className="flex justify-center gap-2">
                        {['Solo', 'Couple', 'Family', 'Friends'].map(type => (
                            <button
                                key={type}
                                onClick={() => setTripType(type)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tripType === type ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="relative mb-6">
                <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
                    rows={4}
                    placeholder={isReview ? "What was the highlight of your trip?" : "Describe the bug..."}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300">
                    {comment.length}/500
                </div>
            </div>

            {/* Toggle (Review Only) */}
            {isReview && (
                <div className="flex items-center justify-between mb-8 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                            {isPublic ? '🌍' : '🔒'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{isPublic ? 'Public Story' : 'Private Note'}</span>
                            <span className="text-[10px] text-slate-400">{isPublic ? 'Visible to community' : 'Only for you'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsPublic(!isPublic)}
                        className={`w-12 h-7 rounded-full transition-colors relative ${isPublic ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPublic ? 'translate-x-5' : ''}`}></div>
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    className={`flex-[2] py-4 rounded-2xl font-bold text-sm text-white shadow-lg shadow-purple-500/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none ${isReview ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-800'}`}
                >
                    {isReview ? 'Publish Story' : 'Send Report'}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
