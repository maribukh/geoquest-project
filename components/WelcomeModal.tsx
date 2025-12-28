
import React, { useEffect, useState } from 'react';

interface WelcomeModalProps {
  userName: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay for animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[5000] flex items-center justify-center p-6 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose}></div>

        {/* Card */}
        <div className={`relative bg-white w-full max-w-sm rounded-[40px] p-8 text-center shadow-2xl transform transition-transform duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
            
            {/* Icon */}
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm animate-bounce-slow">
                👋
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-2 font-serif tracking-tight">
                Gamarjoba, {userName}!
            </h2>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                Welcome to your digital home in Kutaisi. We are so happy to see you here! Get ready to discover hidden gems and taste delicious food.
            </p>

            <button 
                onClick={handleClose}
                className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-transform hover:bg-black"
            >
                Let's Explore! 🚀
            </button>
        </div>
        
        <style>{`
            @keyframes bounce-slow {
                0%, 100% { transform: translateY(-5%); }
                50% { transform: translateY(5%); }
            }
            .animate-bounce-slow {
                animation: bounce-slow 2s infinite ease-in-out;
            }
        `}</style>
    </div>
  );
};

export default WelcomeModal;
