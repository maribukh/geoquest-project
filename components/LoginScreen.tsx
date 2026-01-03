import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = [
    {
      image:
        'https://images.unsplash.com/photo-1593693399504-0e77e694d72d?q=80&w=2070&auto=format&fit=crop',
      location: 'Bagrati Cathedral',
      gradient: 'from-emerald-900/40 via-slate-900/60 to-amber-900/30',
    },
    {
      image:
        'https://images.unsplash.com/photo-1593693399746-4c28f3e4f6b1?q=80&w=2070&auto=format&fit=crop',
      location: 'Kutaisi Historic Center',
      gradient: 'from-blue-900/40 via-slate-900/60 to-purple-900/30',
    },
    {
      image:
        'https://images.unsplash.com/photo-1590486803835-0d0e6f203b32?q=80&w=2070&auto=format&fit=crop',
      location: 'Colchis Fountain',
      gradient: 'from-cyan-900/40 via-slate-900/60 to-teal-900/30',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLoginSuccess(result.user);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled');
      } else {
        setError('Could not sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Adventure Seeker',
      photoURL: null,
      isAnonymous: true,
    };
    onLoginSuccess(guestUser);
  };

  return (
    <div className='fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden'>
      {/* Animated Background Slideshow */}
      <div className='absolute inset-0 overflow-hidden'>
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === bgIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{
                backgroundImage: `url(${bg.image})`,
                filter: 'brightness(0.3) saturate(1.2)',
              }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${bg.gradient}`}
            />
          </div>
        ))}

        {/* Animated Grid Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </div>

      {/* Floating Particles */}
      <div className='absolute inset-0'>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className='absolute w-[2px] h-[2px] bg-emerald-400/30 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className='relative z-10 w-full h-full flex flex-col items-center justify-center p-6'>
        <div className='w-full max-w-md animate-float-in'>
          {/* Logo Section - Exploration Theme */}
          <div className='text-center mb-10'>
            <div className='relative inline-block mb-8'>
              {/* Outer Glow */}
              <div className='absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse' />

              {/* Main Logo Container */}
              <div className='relative w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl flex items-center justify-center group'>
                {/* Compass Lines */}
                <div className='absolute w-full h-full flex items-center justify-center'>
                  <div className='w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent' />
                  <div className='absolute h-16 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent' />
                </div>

                {/* Compass Points */}
                <div className='absolute -top-2 text-emerald-300 font-bold text-xs'>
                  N
                </div>
                <div className='absolute -bottom-2 text-emerald-300 font-bold text-xs'>
                  S
                </div>
                <div className='absolute -left-2 text-emerald-300 font-bold text-xs'>
                  W
                </div>
                <div className='absolute -right-2 text-emerald-300 font-bold text-xs'>
                  E
                </div>

                {/* Center Point */}
                <div className='relative z-10'>
                  <div className='w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30'>
                    <div className='text-3xl animate-spin-slow'>✦</div>
                  </div>
                </div>
              </div>

              {/* Floating Rings */}
              <div className='absolute -inset-6 border-2 border-emerald-400/20 rounded-full animate-ping-slow' />
              <div className='absolute -inset-8 border border-cyan-400/10 rounded-full animate-ping-slower' />
            </div>

            <h1 className='text-5xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent'>
              GeoExplorer
            </h1>

            <div className='inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                <span className='text-sm font-semibold text-emerald-300 tracking-wider'>
                  {backgrounds[bgIndex].location}
                </span>
              </div>
              <div className='text-xs text-white/40'>|</div>
              <div className='text-xs text-cyan-300 font-medium'>
                KUTAISI QUEST
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className='bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6'>
            {/* Location Progress */}
            <div className='flex items-center justify-between mb-2'>
              <div className='text-sm text-white/70'>Discovering Kutaisi</div>
              <div className='text-xs text-emerald-300 font-medium'>
                {bgIndex + 1} of {backgrounds.length}
              </div>
            </div>
            <div className='h-1.5 bg-white/10 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500'
                style={{
                  width: `${((bgIndex + 1) / backgrounds.length) * 100}%`,
                }}
              />
            </div>

            {/* Buttons */}
            <div className='space-y-4 pt-2'>
              <button
                onClick={handleLogin}
                disabled={loading}
                className='w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
                <div className='relative px-6 py-4 flex items-center justify-center gap-3'>
                  {loading ? (
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  ) : (
                    <>
                      <div className='w-7 h-7 bg-white rounded-lg flex items-center justify-center'>
                        <span className='text-lg font-bold text-slate-900'>
                          G
                        </span>
                      </div>
                      <span className='text-white font-semibold text-lg tracking-wide'>
                        Start Expedition
                      </span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handleGuestLogin}
                disabled={loading}
                className='w-full group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 active:scale-[0.98] transition-all duration-300'
              >
                <div className='px-6 py-4 flex items-center justify-center gap-3'>
                  <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-white/20'>
                    <span className='text-lg'>🧭</span>
                  </div>
                  <span className='text-white font-semibold text-lg tracking-wide'>
                    Guest Explorer
                  </span>
                </div>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center'>
                    <span className='text-red-300'>⚠</span>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-red-200'>{error}</p>
                    <p className='text-xs text-red-300/70 mt-1'>
                      Please try again
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className='pt-6 border-t border-white/10'>
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  {backgrounds.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBgIndex(i)}
                      className={`w-8 h-1 rounded-full transition-all ${
                        i === bgIndex
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <div className='text-right'>
                  <div className='text-xs text-white/40 font-mono'>v2.1.0</div>
                  <div className='text-xs text-emerald-300/70 font-medium'>
                    By MariBukh
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hint Text */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-white/50'>
              Begin your adventure through historic Kutaisi
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float-in {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ping-slow {
          0% { 
            transform: scale(1); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }
        
        @keyframes ping-slower {
          0% { 
            transform: scale(1); 
            opacity: 0.5; 
          }
          100% { 
            transform: scale(1.8); 
            opacity: 0; 
          }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-float-in {
          animation: float-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
