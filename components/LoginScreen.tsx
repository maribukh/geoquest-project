
import React, { useState, useEffect } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebaseConfig";

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

const BACKGROUNDS = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bagrati_Cathedral_2.jpg/1280px-Bagrati_Cathedral_2.jpg',
    location: 'Bagrati Cathedral'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kutaisi_Colchis_Fountain.jpg/1280px-Kutaisi_Colchis_Fountain.jpg',
    location: 'Colchis Fountain'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/White_bridge%2C_Kutaisi.jpg/1280px-White_bridge%2C_Kutaisi.jpg',
    location: 'White Bridge'
  }
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Background Slideshow Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (provider: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      onLoginSuccess(result.user);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login cancelled");
      } else if (err.code === 'auth/configuration-not-found') {
        setError("Firebase config missing");
      } else {
        setError("Could not sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
      const guestUser = {
          uid: 'guest_' + Math.random().toString(36).substr(2, 9),
          displayName: 'Guest Explorer',
          photoURL: null,
          isAnonymous: true
      };
      onLoginSuccess(guestUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-end sm:justify-center z-50 overflow-hidden font-sans">
      
      {/* --- CINEMATIC BACKGROUND SLIDESHOW --- */}
      {BACKGROUNDS.map((bg, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={bg.image} 
            alt={bg.location} 
            className="w-full h-full object-cover transform scale-110 animate-subtle-zoom" 
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-transparent"></div>
        </div>
      ))}

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-sm flex flex-col px-6 pb-12 animate-fade-in-up">
        
        {/* LOGO AREA */}
        <div className="mb-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl rotate-6 blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-3 border-4 border-white/20 backdrop-blur-sm bg-opacity-90">
                    <span className="text-5xl">🧭</span>
                </div>
            </div>

            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter font-serif drop-shadow-2xl">
              GeoQuest
            </h1>
            <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-emerald-400/50"></div>
                <p className="text-sm font-bold text-emerald-200 uppercase tracking-[0.2em] drop-shadow-md">
                  Kutaisi Edition
                </p>
                <div className="h-[1px] w-8 bg-emerald-400/50"></div>
            </div>
        </div>

        {/* Buttons Container */}
        <div className="w-full space-y-4">
           {/* Google Button */}
           <button 
             onClick={() => handleLogin(googleProvider)}
             disabled={loading}
             className="w-full bg-white text-slate-900 font-bold py-4 rounded-3xl flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:bg-slate-50 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             {loading ? <span className="animate-spin">⏳</span> : (
               <>
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
                 <span className="text-sm tracking-wide">Start with Google</span>
               </>
             )}
           </button>

           {/* Guest Button */}
           <button 
             onClick={handleGuestLogin}
             disabled={loading}
             className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-white/20 active:scale-[0.98] transition-all duration-200"
           >
             <span className="text-sm tracking-wide">Guest Access</span>
             <span className="text-white/50 text-xs">(Dev Mode)</span>
           </button>
        </div>

        {error && (
            <div className="mt-6 px-4 py-3 bg-red-500/20 border border-red-500/30 backdrop-blur-xl rounded-2xl flex items-center gap-2 animate-shake">
                <span className="text-red-200 text-xs font-bold">⚠️ {error}</span>
            </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-white/40 text-[10px] font-medium uppercase tracking-widest px-2">
           <span>v1.0.2 Beta</span>
           <span>Powered by MariBukh</span>
        </div>

      </div>
      
      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1.1); }
          100% { transform: scale(1.2); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 15s ease-in-out infinite alternate;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
