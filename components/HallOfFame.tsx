import React, { useState, useRef, useEffect } from 'react';
import { KUTAISI_LEGENDS } from '../constants';
import { Legend, ChatMessage } from '../types';
import { chatWithLegend } from '../services/geminiService';

interface HallOfFameProps {
  onToggleFullScreen?: (isFull: boolean) => void;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ onToggleFullScreen }) => {
  const [activeLegend, setActiveLegend] = useState<Legend | null>(null);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle full screen mode in parent App when activeLegend changes
  useEffect(() => {
    if (onToggleFullScreen) {
      onToggleFullScreen(!!activeLegend);
    }
    // Cleanup: ensure menu comes back if component unmounts while reading
    return () => {
      if (onToggleFullScreen && activeLegend) {
        onToggleFullScreen(false);
      }
    };
  }, [activeLegend, onToggleFullScreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatMode]);

  const handleStartChat = () => {
    setIsChatMode(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'model',
          text: `Gamarjoba! I am ${activeLegend?.name}. What brings you to me in this strange time?`,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeLegend) return;

    const userMsg: ChatMessage = { role: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await chatWithLegend(
        activeLegend.name,
        activeLegend.bio,
        messages,
        userMsg.text
      );
      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Forgive me, the mists of time are thick today. I cannot hear you. (API Error)',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-full bg-[#fcfbf9]'>
      {/* HEADER: Book Cover Style */}
      <div className='px-6 pt-8 pb-6 border-b border-stone-200 bg-[#f4f1ea] sticky top-0 z-10 shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-stone-800 text-[#f4f1ea] rounded-full flex items-center justify-center text-2xl font-serif shadow-md border-2 border-[#d6cfc2]'>
            ❦
          </div>
          <div>
            <h3 className='text-2xl font-black text-stone-800 font-serif leading-none tracking-tight'>
              Chronicles
            </h3>
            <p className='text-[11px] text-stone-500 font-bold uppercase tracking-[0.2em] mt-1.5'>
              The Faces of Kutaisi
            </p>
          </div>
        </div>
      </div>

      {/* --- LIST VIEW: Table of Contents Style --- */}
      <div className='px-4 py-6 space-y-4 pb-32'>
        {KUTAISI_LEGENDS.map((legend, index) => (
          <button
            key={legend.id}
            onClick={() => {
              setActiveLegend(legend);
              setIsChatMode(false);
              setMessages([]);
            }}
            className='w-full group bg-white rounded-2xl p-4 shadow-sm border border-stone-200 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 flex items-center gap-5 text-left active:scale-[0.99]'
          >
            {/* Portrait Thumbnail */}
            <div className='relative shrink-0'>
              <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-stone-100 shadow-inner group-hover:scale-105 transition-transform duration-500'>
                <img
                  src={legend.image}
                  alt={legend.name}
                  className='w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500'
                />
              </div>
              {legend.gymnasiumConnection && (
                <div
                  className='absolute -bottom-1 -right-1 bg-emerald-100 text-emerald-800 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm'
                  title='Gymnasium Alumni'
                >
                  🎓
                </div>
              )}
            </div>

            {/* Text Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-baseline mb-1'>
                <h4 className='font-serif font-bold text-lg text-stone-800 truncate pr-2 group-hover:text-emerald-800 transition-colors'>
                  {legend.name}
                </h4>
                <span className='text-[10px] font-mono text-stone-400 shrink-0'>
                  {legend.years.split('–')[0]}
                </span>
              </div>
              <p className='text-xs font-medium text-stone-500 uppercase tracking-wider mb-1'>
                {legend.role}
              </p>
              <p className='text-xs text-stone-600 line-clamp-1 font-serif italic opacity-80'>
                "{legend.quote || legend.bio.substring(0, 40)}..."
              </p>
            </div>

            {/* Arrow */}
            <div className='text-stone-300 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1'>
              ➝
            </div>
          </button>
        ))}
      </div>

      {/* --- READING / CHAT MODE (Full Screen Overlay) --- */}
      {activeLegend && (
        <div className='fixed inset-0 z-[4000] bg-stone-900/40 backdrop-blur-sm animate-fadeIn flex justify-end'>
          {/* Overlay Click to Close */}
          <div
            className='absolute inset-0'
            onClick={() => setActiveLegend(null)}
          ></div>

          {/* The "Page" Container */}
          <div className='relative w-full md:max-w-xl h-full bg-[#fdfbf7] shadow-2xl flex flex-col animate-slide-left'>
            {/* Paper Texture */}
            <div
              className='absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply z-0'
              style={{
                backgroundImage:
                  'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              }}
            ></div>

            {/* Sticky Nav */}
            <div className='sticky top-0 z-20 flex justify-between items-center p-4 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-stone-200/50'>
              <button
                onClick={() => setActiveLegend(null)}
                className='flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors px-2 py-1'
              >
                <span className='text-xl'>←</span>
                <span className='text-xs font-bold uppercase tracking-widest'>
                  Back
                </span>
              </button>

              {!isChatMode ? (
                <button
                  onClick={handleStartChat}
                  className='bg-emerald-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-900 active:scale-95 transition-all'
                >
                  <span>💬</span> Chat with Legend
                </button>
              ) : (
                <button
                  onClick={() => setIsChatMode(false)}
                  className='bg-stone-200 text-stone-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-stone-300'
                >
                  📖 Read Bio
                </button>
              )}
            </div>

            {/* CONTENT AREA */}
            <div
              className={`flex-1 relative z-10 ${
                isChatMode
                  ? 'flex flex-col overflow-hidden'
                  : 'overflow-y-auto custom-scrollbar'
              }`}
            >
              {!isChatMode ? (
                <>
                  {/* Hero Image Section */}
                  <div className='relative w-full h-72 shrink-0 bg-stone-200'>
                    <img
                      src={activeLegend.image}
                      alt={activeLegend.name}
                      className='w-full h-full object-cover filter sepia-[0.15]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-black/30'></div>

                    <div className='absolute bottom-0 left-0 right-0 p-8 pt-20'>
                      <h2 className='text-4xl font-black text-stone-900 font-serif leading-tight mb-2 drop-shadow-sm'>
                        {activeLegend.name}
                      </h2>
                      <div className='flex items-center gap-3'>
                        <span className='bg-emerald-800 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm'>
                          {activeLegend.role}
                        </span>
                        <span className='text-sm font-mono text-stone-600 font-bold'>
                          {activeLegend.years}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className='px-8 py-8 pb-32'>
                    <div className='prose prose-stone prose-lg max-w-none'>
                      <p className='font-serif text-lg leading-relaxed text-stone-800 text-justify first-letter:text-6xl first-letter:font-black first-letter:text-emerald-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]'>
                        {activeLegend.bio}
                      </p>
                    </div>

                    <div className='my-10 border-t border-b border-stone-300 py-8'>
                      {activeLegend.quote && (
                        <blockquote className='relative text-center px-4'>
                          <span className='absolute top-0 left-0 text-6xl text-stone-200 font-serif leading-none'>
                            “
                          </span>
                          <p className='text-xl font-serif italic text-stone-700 relative z-10 leading-relaxed'>
                            {activeLegend.quote}
                          </p>
                          <span className='absolute bottom-0 right-0 text-6xl text-stone-200 font-serif leading-none rotate-180'>
                            “
                          </span>
                        </blockquote>
                      )}
                    </div>

                    {activeLegend.link && (
                      <div className='mb-10 text-center'>
                        <a
                          href={activeLegend.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 px-6 py-3 bg-stone-800 text-[#f4f1ea] rounded-full font-serif italic text-sm hover:bg-stone-700 transition-colors shadow-lg active:scale-95 duration-200'
                        >
                          <span>🏛️</span>
                          <span>Visit Virtual Museum</span>
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // CHAT MODE LAYOUT (Flex Column: Messages + Input)
                <>
                  <div className='flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar'>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            msg.role === 'user'
                              ? 'bg-stone-800 text-white rounded-tr-none'
                              : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none font-serif'
                          }`}
                        >
                          {msg.role === 'model' && (
                            <div className='text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1'>
                              {activeLegend.name}
                            </div>
                          )}
                          <p className='text-sm leading-relaxed'>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className='flex justify-start'>
                        <div className='bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-none flex gap-2'>
                          <div className='w-2 h-2 bg-stone-400 rounded-full animate-bounce'></div>
                          <div
                            className='w-2 h-2 bg-stone-400 rounded-full animate-bounce'
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className='w-2 h-2 bg-stone-400 rounded-full animate-bounce'
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} className='h-4' />
                  </div>

                  {/* Input Area - Pinned to Bottom */}
                  <div className='bg-[#fdfbf7] border-t border-stone-200 p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] relative z-30'>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSendMessage()
                        }
                        placeholder={`Ask ${
                          activeLegend.name.split(' ')[0]
                        } a question...`}
                        className='flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner font-serif'
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                        className='bg-stone-800 text-white w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-stone-700 active:scale-95 transition-all shadow-md'
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-left {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .animate-slide-left {
            animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default HallOfFame;
