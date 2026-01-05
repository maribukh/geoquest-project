import React, { useState } from 'react';
import { KUTAISI_LEGENDS } from '../constants';
import { Legend } from '../types';

const HallOfFame: React.FC = () => {
  const [activeLegend, setActiveLegend] = useState<Legend | null>(null);

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
            onClick={() => setActiveLegend(legend)}
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

      {/* --- READING MODE (Full Screen Book Page) --- */}
      {activeLegend && (
        <div className='fixed inset-0 z-[4000] bg-stone-900/40 backdrop-blur-sm animate-fadeIn flex justify-end'>
          {/* Overlay Click to Close */}
          <div
            className='absolute inset-0'
            onClick={() => setActiveLegend(null)}
          ></div>

          {/* The "Page" */}
          <div className='relative w-full md:max-w-xl h-full bg-[#fdfbf7] shadow-2xl overflow-y-auto animate-slide-left flex flex-col'>
            {/* Paper Texture */}
            <div
              className='absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply'
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
              <span className='text-[10px] font-mono text-stone-400'>
                ARCHIVE REF: {activeLegend.id.toUpperCase()}
              </span>
            </div>

            {/* Hero Image Section */}
            <div className='relative w-full h-72 shrink-0 bg-stone-200'>
              <img
                src={activeLegend.image}
                alt={activeLegend.name}
                className='w-full h-full object-cover filter sepia-[0.15]'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-black/30'></div>

              {/* Name Overlay */}
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
            <div className='relative px-8 py-8 flex-1'>
              {/* Drop Cap Bio */}
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

              {/* Online Museum Link */}
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

              {/* Connection Footnote */}
              {activeLegend.gymnasiumConnection && (
                <div className='bg-[#f4f1ea] rounded-xl p-5 border border-[#e6e2d6] flex gap-4 items-start'>
                  <div className='text-2xl pt-1'>🎓</div>
                  <div>
                    <h5 className='font-bold text-stone-800 text-sm mb-1 font-serif'>
                      Historical Connection
                    </h5>
                    <p className='text-xs text-stone-600 leading-relaxed'>
                      This figure is historically linked to the{' '}
                      <strong>Kutaisi Classical Gymnasium</strong>. Their legacy
                      is preserved within the walls of the city's oldest
                      educational institution.
                    </p>
                  </div>
                </div>
              )}

              {/* End Mark */}
              <div className='mt-12 mb-8 text-center text-stone-300 text-2xl'>
                ❦
              </div>
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
